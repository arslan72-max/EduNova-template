import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <div class="services-container">
      <div class="content-wrapper">
        <h1 class="page-title">Services</h1>
        
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">🆘</div>
            <h3>Aide</h3>
            <p>Obtenez de l'aide personnalisée pour vos questions académiques</p>
            <ul class="service-features">
              <li>Support 24/7</li>
              <li>Réponses rapides</li>
              <li>Experts qualifiés</li>
            </ul>
            <button class="service-btn">Demander de l'aide</button>
          </div>
          
          <div class="service-card">
            <div class="service-icon">🎓</div>
            <h3>Tutoriels</h3>
            <p>Suivez nos tutoriels pas à pas pour maîtriser les concepts</p>
            <ul class="service-features">
              <li>Vidéos HD</li>
              <li>Explications détaillées</li>
              <li>Exemples pratiques</li>
            </ul>
            <button class="service-btn">Voir les tutoriels</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 3rem;
      justify-items: center;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      max-width: 450px;
      width: 100%;
    }

    .service-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .service-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .service-card h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .service-card p {
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .service-features {
      list-style: none;
      margin-bottom: 2rem;
      text-align: left;
    }

    .service-features li {
      padding: 0.5rem 0;
      position: relative;
      padding-left: 1.5rem;
    }

    .service-features li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4ade80;
      font-weight: bold;
    }

    .service-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .service-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .services-container {
        padding: 4rem 1rem 2rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .services-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .service-card {
        padding: 2rem;
      }
    }
  `]
})
export class ServicesComponent {}