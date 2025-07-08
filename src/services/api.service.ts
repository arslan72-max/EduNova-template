import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  download_url: string;
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
  video_url: string;
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
    const token = localStorage.getItem('token');
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Authentication methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
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
    
    return this.http.get<{ documents: Document[] }>(`${this.baseUrl}/documents`, { params });
  }

  getVideos(filters?: any): Observable<{ videos: Video[] }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.subject) params = params.set('subject', filters.subject);
      if (filters.level) params = params.set('level', filters.level);
    }
    
    return this.http.get<{ videos: Video[] }>(`${this.baseUrl}/videos`, { params });
  }

  // Settings methods
  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}/settings`, {
      headers: this.getAuthHeaders()
    });
  }

  updateSettings(settings: Settings): Observable<any> {
    return this.http.put(`${this.baseUrl}/settings`, settings, {
      headers: this.getAuthHeaders()
    });
  }

  // Progress tracking methods
  getUserProgress(): Observable<any> {
    return this.http.get(`${this.baseUrl}/progress`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProgress(contentType: string, contentId: number, progress: number, completed: boolean = false): Observable<any> {
    return this.http.post(`${this.baseUrl}/progress`, {
      contentType,
      contentId,
      progress,
      completed
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // Statistics methods
  getUserStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`, {
      headers: this.getAuthHeaders()
    });
  }
}