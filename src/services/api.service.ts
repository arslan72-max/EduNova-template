import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  level: string;
  specialty: string;
  joinDate: string;
}

export interface Document {
  id: number;
  title: string;
  type: string;
  subject: string;
  level: string;
  thumbnail: string;
  description: string;
  pages: number;
  downloadUrl: string;
}

export interface Video {
  id: number;
  title: string;
  subject: string;
  level: string;
  duration: string;
  thumbnail: string;
  description: string;
  views: number;
  videoUrl: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'ar';
  notifications: {
    email: boolean;
    push: boolean;
    newCourses: boolean;
    reminders: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    allowMessages: boolean;
  };
  preferences: {
    autoplay: boolean;
    subtitles: boolean;
    playbackSpeed: number;
    downloadQuality: 'low' | 'medium' | 'high';
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      // Network error or CORS issue
      throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
    } else if (error.status === 401) {
      // Unauthorized
      throw new Error(error.error?.error || 'Email ou mot de passe incorrect');
    } else if (error.status === 400) {
      // Bad request
      throw new Error(error.error?.error || 'Données invalides');
    } else {
      // Other errors
      throw new Error(error.error?.error || 'Une erreur est survenue');
    }
  };

  // Authentication methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('isLoggedIn', 'true');
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, userData).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('isLoggedIn', 'true');
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return of(JSON.parse(userData));
    }
    return throwError(() => new Error('User not found'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Content methods
  getDocuments(filters?: any): Observable<{ documents: Document[] }> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.subject) params = params.set('subject', filters.subject);
      if (filters.level) params = params.set('level', filters.level);
      if (filters.type) params = params.set('type', filters.type);
    }
    
    return this.http.get<{ documents: Document[] }>(`${this.baseUrl}/documents`, { params }).pipe(
      catchError(error => {
        console.error('Error loading documents:', error);
        // Fallback to static data if backend is unavailable
        return this.http.get<any>('/assets/data/documents.json').pipe(
          map(data => ({ documents: data.documents }))
        );
      })
    );
  }

  getVideos(filters?: any): Observable<{ videos: Video[] }> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.subject) params = params.set('subject', filters.subject);
      if (filters.level) params = params.set('level', filters.level);
    }
    
    return this.http.get<{ videos: Video[] }>(`${this.baseUrl}/videos`, { params }).pipe(
      catchError(error => {
        console.error('Error loading videos:', error);
        // Fallback to static data if backend is unavailable
        return this.http.get<any>('/assets/data/videos.json').pipe(
          map(data => ({ videos: data.videos }))
        );
      })
    );
  }

  // Settings methods
  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}/user/settings`).pipe(
      catchError(error => {
        console.error('Error loading settings:', error);
        // Fallback to localStorage
        const defaultSettings: Settings = {
          theme: 'auto',
          language: 'fr',
          notifications: {
            email: true,
            push: true,
            newCourses: true,
            reminders: false
          },
          privacy: {
            profileVisibility: 'public',
            showProgress: true,
            allowMessages: true
          },
          preferences: {
            autoplay: false,
            subtitles: true,
            playbackSpeed: 1,
            downloadQuality: 'medium'
          }
        };

        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          return of({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
        
        return of(defaultSettings);
      })
    );
  }

  updateSettings(settings: Settings): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/settings`, settings).pipe(
      tap(() => {
        // Also save to localStorage as backup
        localStorage.setItem('userSettings', JSON.stringify(settings));
      }),
      catchError(error => {
        console.error('Error updating settings:', error);
        // Fallback to localStorage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        return of({ message: 'Settings updated successfully' }).pipe(delay(300));
      })
    );
  }

  // Progress tracking methods
  getUserProgress(): Observable<any> {
    const progress = localStorage.getItem('userProgress');
    return of({ progress: progress ? JSON.parse(progress) : [] });
  }

  updateProgress(contentType: string, contentId: number, progress: number, completed: boolean = false): Observable<any> {
    const existingProgress = JSON.parse(localStorage.getItem('userProgress') || '[]');
    const progressItem = {
      contentType,
      contentId,
      progress,
      completed,
      lastAccessed: new Date().toISOString()
    };
    
    const index = existingProgress.findIndex((p: any) => 
      p.contentType === contentType && p.contentId === contentId
    );
    
    if (index >= 0) {
      existingProgress[index] = progressItem;
    } else {
      existingProgress.push(progressItem);
    }
    
    localStorage.setItem('userProgress', JSON.stringify(existingProgress));
    return of({ message: 'Progress updated successfully' }).pipe(delay(200));
  }

  // Statistics methods
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/stats`).pipe(
      catchError(error => {
        console.error('Error loading user stats:', error);
        // Fallback to local calculation
        const progress = JSON.parse(localStorage.getItem('userProgress') || '[]');
        const completedCourses = progress.filter((p: any) => p.contentType === 'document' && p.completed).length;
        const completedExercises = progress.filter((p: any) => p.contentType === 'exercise' && p.completed).length;
        
        return of({
          courses: completedCourses,
          exercises: completedExercises,
          successRate: 89,
          hoursThisWeek: 12
        });
      })
    );
  }
}