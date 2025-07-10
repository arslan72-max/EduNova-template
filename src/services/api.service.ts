import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';

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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  // Authentication methods
  login(email: string, password: string): Observable<any> {
    return this.http.get<any>('/data/accounts.json').pipe(
      delay(500), // Simulate network delay
      map(data => {
        const user = data.accounts.find((account: any) => 
          account.email === email && account.password === password
        );
        
        if (user) {
          const userData = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            level: user.level,
            specialty: user.specialty,
            joinDate: user.joinDate
          };
          
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
          this.currentUserSubject.next(userData);
          
          return { user: userData, token: 'mock-jwt-token' };
        } else {
          throw new Error('Email ou mot de passe incorrect');
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.get<any>('/data/accounts.json').pipe(
      delay(500), // Simulate network delay
      map(data => {
        // Check if user already exists
        const existingUser = data.accounts.find((account: any) => 
          account.email === userData.email
        );
        
        if (existingUser) {
          throw new Error('Un compte avec cet email existe déjà');
        }
        
        // Create new user
        const newUser = {
          id: data.accounts.length + 1,
          fullName: userData.fullName,
          email: userData.email,
          avatar: this.getRandomAvatar(),
          level: userData.level,
          specialty: userData.specialty,
          joinDate: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true');
        this.currentUserSubject.next(newUser);
        
        return { user: newUser, token: 'mock-jwt-token' };
      })
    );
  }

  private getRandomAvatar(): string {
    const avatars = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
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
    return this.http.get<any>('/data/documents.json').pipe(
      map(data => {
        let documents = data.documents;
        
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            documents = documents.filter((doc: Document) =>
              doc.title.toLowerCase().includes(searchTerm) ||
              doc.description.toLowerCase().includes(searchTerm) ||
              doc.subject.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.subject) {
            documents = documents.filter((doc: Document) => doc.subject === filters.subject);
          }
          
          if (filters.level) {
            documents = documents.filter((doc: Document) => doc.level === filters.level);
          }
          
          if (filters.type) {
            documents = documents.filter((doc: Document) => doc.type === filters.type);
          }
        }
        
        return { documents };
      })
    );
  }

  getVideos(filters?: any): Observable<{ videos: Video[] }> {
    return this.http.get<any>('/data/videos.json').pipe(
      map(data => {
        let videos = data.videos;
        
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            videos = videos.filter((video: Video) =>
              video.title.toLowerCase().includes(searchTerm) ||
              video.description.toLowerCase().includes(searchTerm) ||
              video.subject.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.subject) {
            videos = videos.filter((video: Video) => video.subject === filters.subject);
          }
          
          if (filters.level) {
            videos = videos.filter((video: Video) => video.level === filters.level);
          }
        }
        
        return { videos };
      })
    );
  }

  // Settings methods
  getSettings(): Observable<Settings> {
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
  }

  updateSettings(settings: Settings): Observable<any> {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    return of({ message: 'Settings updated successfully' }).pipe(delay(300));
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
    const progress = JSON.parse(localStorage.getItem('userProgress') || '[]');
    const completedCourses = progress.filter((p: any) => p.contentType === 'document' && p.completed).length;
    const completedExercises = progress.filter((p: any) => p.contentType === 'exercise' && p.completed).length;
    
    return of({
      courses: completedCourses,
      exercises: completedExercises,
      successRate: 89,
      hoursThisWeek: 12
    });
  }
}