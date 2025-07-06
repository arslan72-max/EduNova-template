import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="container-foot">
        <p>&copy; 2025 Edu-nova. All rights reserved.</p>
        <div class="foot-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.3);
      padding: 0.5rem 0;
      color: #f0f0f0;
      border-top: 1px solid rgba(255, 255, 255, 0.4);
    }
    .container-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      margin: 0 auto;
      max-width: 1200px;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .container-foot p {
      font-size: 0.9rem;
      margin: 0;
    }
    .foot-links a {
      color: #f0f0f0;
      text-decoration: none;
      margin: 0 0.75rem;
      transition: color 0.3s;
      font-size: 0.9rem;
    }
    .foot-links a:hover {
      color: #ffffff;
      text-decoration: underline;
    }
  `]
})
export class AppFooter {}