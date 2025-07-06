import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import accountsData from '../data/accounts.json';

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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    const account = accountsData.accounts.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      const user: User = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        avatar: account.avatar,
        level: account.level,
        specialty: account.specialty,
        joinDate: account.joinDate
      };
      
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}