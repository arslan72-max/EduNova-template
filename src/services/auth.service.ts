import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  level: string;
  specialty: string;
  joinDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$ = this.apiService.currentUser$;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.login(email, password);
  }

  register(userData: any): Observable<any> {
    return this.apiService.register(userData);
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/home']);
  }

  getCurrentUser(): User | null {
    return this.apiService.currentUser$.value;
  }

  isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }
}