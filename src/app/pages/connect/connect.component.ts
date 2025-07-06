import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="connect-container">
      <div class="content-wrapper">
        <div class="auth-card">
          <div class="auth-header">
            <h1 class="auth-title">{{ isLogin ? 'se connecter' : 's\'inscrire' }}</h1>
            <p class="auth-subtitle">
              {{ isLogin ? 'Accédez à votre compte Edu-Nova' : 'Créez votre compte Edu-Nova' }}
            </p>
          </div>

          <form class="auth-form" (ngSubmit)="onSubmit()">
            <div class="form-group" *ngIf="!isLogin">
              <label for="fullName">Nom complet</label>
              <input 
                type="text" 
                id="fullName" 
                [(ngModel)]="formData.fullName"
                name="fullName"
                placeholder="Votre nom complet"
                required>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="formData.email"
                name="email"
                placeholder="votre@email.com"
                required>
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="formData.password"
                name="password"
                placeholder="••••••••"
                required>
            </div>

            <div class="form-group" *ngIf="!isLogin">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input 
                type="password" 
                id="confirmPassword" 
                [(ngModel)]="formData.confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button type="submit" class="auth-btn">
              {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
            </button>
          </form>

          <div class="auth-switch">
            <p>
              {{ isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
              <button type="button" class="switch-btn" (click)="toggleMode()">
                {{ isLogin ? 'S\'inscrire' : 'Se connecter' }}
              </button>
            </p>
          </div>

          <div class="demo-accounts" *ngIf="isLogin">
            <h4>Comptes de démonstration :</h4>
            <div class="demo-list">
              <button 
                type="button" 
                class="demo-btn"
                *ngFor="let account of demoAccounts"
                (click)="loginWithDemo(account.email, account.password)">
                {{ account.name }}
              </button>
            </div>
          </div>

          <div class="social-auth">
            <div class="divider">
              <span>ou</span>
            </div>
            <button type="button" class="social-btn google-btn">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="social-icon">
              Continuer avec Google
            </button>
            <button type="button" class="social-btn facebook-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" class="social-icon">
              Continuer avec Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connect-container {
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .content-wrapper {
      width: 100%;
      max-width: 450px;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 3rem;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      text-transform: capitalize;
    }

    .auth-subtitle {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .auth-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-group input {
      width: 100%;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .form-group input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    }

    .error-message {
      background: rgba(220, 53, 69, 0.2);
      border: 1px solid rgba(220, 53, 69, 0.5);
      color: #ff6b6b;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }

    .auth-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .auth-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
    }

    .auth-switch {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-switch p {
      margin: 0;
      opacity: 0.9;
    }

    .switch-btn {
      background: none;
      border: none;
      color: #a18cd1;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      margin-left: 0.5rem;
      transition: color 0.3s ease;
    }

    .switch-btn:hover {
      color: #fbc2eb;
    }

    .demo-accounts {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .demo-accounts h4 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      opacity: 0.9;
      text-align: center;
    }

    .demo-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .demo-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .demo-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .social-auth {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 2rem;
    }

    .divider {
      text-align: center;
      margin-bottom: 1.5rem;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
    }

    .divider span {
      background: rgba(255, 255, 255, 0.1);
      padding: 0 1rem;
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .social-btn {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .social-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .google-btn:hover {
      background: rgba(66, 133, 244, 0.2);
      border-color: rgba(66, 133, 244, 0.4);
    }

    .facebook-btn:hover {
      background: rgba(24, 119, 242, 0.2);
      border-color: rgba(24, 119, 242, 0.4);
    }

    .social-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    @media (max-width: 768px) {
      .connect-container {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem;
      }

      .auth-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ConnectComponent {
  isLogin = true;
  errorMessage = '';
  formData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  demoAccounts = [
    { name: 'Ahmed Ben Ali (Terminale)', email: 'ahmed.benali@email.com', password: 'password123' },
    { name: 'Fatima Trabelsi (Prépa)', email: 'fatima.trabelsi@email.com', password: 'password123' },
    { name: 'Mohamed Khelifi (Prépa)', email: 'mohamed.khelifi@email.com', password: 'password123' },
    { name: 'Salma Bouazizi (Terminale)', email: 'salma.bouazizi@email.com', password: 'password123' },
    { name: 'Youssef Mansouri (Université)', email: 'youssef.mansouri@email.com', password: 'password123' },
    { name: 'Raslene Haddaji (Prépa Tech)', email: 'raslene.haddaji@email.com', password: 'password123' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.formData = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  loginWithDemo(email: string, password: string) {
    this.formData.email = email;
    this.formData.password = password;
    this.onSubmit();
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.isLogin) {
      const success = this.authService.login(this.formData.email, this.formData.password);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    } else {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
        return;
      }
      
      // For demo purposes, we'll just show a success message
      // In a real app, you'd create the account here
      this.errorMessage = '';
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      this.isLogin = true;
      this.formData = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    }
  }
}