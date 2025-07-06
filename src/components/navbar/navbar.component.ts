import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="header">
      <nav class="nav">
        <div class="logo">
          <h2>Edu-Nova Studio</h2>
        </div>

        <ul class='nav-links'>
          <li><a [routerLink]="isLoggedIn ? '/dashboard' : '/home'" routerLinkActive="active">{{ isLoggedIn ? 'Tableau de bord' : 'Accueil' }}</a></li>

          <li class="dropdown" *ngIf="!isLoggedIn" (mouseenter)="openOnly('documents')" (click)="toggleDropdown('documents')">
            <a routerLink="/documents" routerLinkActive="active">Documents</a>
            <ul class="dropdown-content" [class.show]="dropdowns.documents">
              <li><a href="#">Cours</a></li>
              <li><a href="#">Exercices</a></li>
              <li><a href="#">Fiches</a></li>
            </ul>
          </li>

          <li class="dropdown" *ngIf="!isLoggedIn" (mouseenter)="openOnly('services')" (click)="toggleDropdown('services')">
            <a routerLink="/services" routerLinkActive="active">Services</a>
            <ul class="dropdown-content" [class.show]="dropdowns.services">
              <li><a href="#">Aide</a></li>
              <li><a href="#">Tutoriels</a></li>
            </ul>
          </li>

          <li class="dropdown" *ngIf="!isLoggedIn" (mouseenter)="openOnly('connect')" (click)="toggleDropdown('connect')">
            <a routerLink="/connect" routerLinkActive="active">Connecter</a>
            <ul class="dropdown-content" [class.show]="dropdowns.connect">
              <li><a routerLink="/connect">S'inscrire</a></li>
              <li><a routerLink="/connect">Se connecter</a></li>
            </ul>
          </li>

          <li class="dropdown user-dropdown" *ngIf="isLoggedIn" (mouseenter)="openOnly('user')" (click)="toggleDropdown('user')">
            <a href="#" class="user-link">
              <img [src]="currentUser?.avatar" [alt]="currentUser?.fullName" class="user-avatar">
              <span>{{ currentUser?.fullName }}</span>
            </a>
            <ul class="dropdown-content" [class.show]="dropdowns.user">
              <li><a routerLink="/profile">Profil</a></li>
              <li><a href="#" (click)="logout($event)">Déconnexion</a></li>
            </ul>
          </li>

          <li class="dropdown hamburger" (mouseenter)="openOnly('more')" (click)="toggleDropdown('more')">
            <a href='#more' title="More">&#9776;</a>
            <ul class="dropdown-content" [class.show]="dropdowns.more">
              <li *ngIf="isLoggedIn"><a routerLink="/profile">Profil</a></li>
              <li *ngIf="!isLoggedIn"><a href="#">Paramètres</a></li>
              <li *ngIf="isLoggedIn"><a href="#" (click)="logout($event)">Déconnexion</a></li>
              <li *ngIf="!isLoggedIn"><a routerLink="/connect">Connexion</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      padding: 1rem 0;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h2 {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      position: relative;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      position: relative;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      text-decoration: underline;
    }

    .dropdown {
      position: relative;
    }

    .user-dropdown .user-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .dropdown-content {
      display: none;
      position: absolute;
      top: 40px;
      left: 0;
      min-width: 180px;
      border-radius: 12px;
      padding: 0.5rem 0;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      flex-direction: column;
      z-index: 10;
      transition: all 0.3s ease;
    }

    .user-dropdown .dropdown-content {
      right: 0;
      left: auto;
    }

    .dropdown-content li {
      list-style: none;
    }

    .dropdown-content a {
      display: block;
      padding: 10px 16px;
      color: white;
      text-decoration: none;
      transition: background 0.3s;
    }

    .dropdown-content a:hover {
      background-color: rgba(255, 255, 255, 0.25);
      color: white;
      transform: none;
    }

    .dropdown-content.show {
      display: flex;
      backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .nav {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .user-dropdown .user-link span {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  dropdowns = {
    documents: false,
    services: false,
    connect: false,
    user: false,
    more: false
  };

  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  openOnly(menu: keyof typeof this.dropdowns) {
    for (const key in this.dropdowns) {
      this.dropdowns[key as keyof typeof this.dropdowns] = false;
    }
    this.dropdowns[menu] = true;
  }

  toggleDropdown(menu: keyof typeof this.dropdowns) {
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    // Close all dropdowns
    for (const key in this.dropdowns) {
      this.dropdowns[key as keyof typeof this.dropdowns] = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      for (const key in this.dropdowns) {
        this.dropdowns[key as keyof typeof this.dropdowns] = false;
      }
    }
  }
}