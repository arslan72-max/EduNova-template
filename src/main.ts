import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppFooter } from './components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, AppFooter, RouterOutlet],
  template: `
    <div class="container">
      <div class="background-overlay"></div>
      <div class="content">
        <app-navbar></app-navbar>
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      position: relative;
      background-image: url('/assets/creatvise-FuTwsOk98GM-unsplash.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }

    .content {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding-top: 80px; /* Account for fixed navbar */
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .container {
        background-attachment: scroll;
      }

      .main-content {
        padding-top: 120px; /* More space for mobile navbar */
      }
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});