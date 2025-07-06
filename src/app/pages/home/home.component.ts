import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <h1 class="hero-title">Bienvenue sur Edu-Nova</h1>
        <p class="hero-subtitle">Votre voie vers l'excellence académique</p>
        <button class="cta-button" (click)="scrollToContent()">Commencer</button>
      </section>

      <!-- Main Content Section -->
      <main class="main-content" id="main-content">
        <div class="content-wrapper">
          <div class="info-section">
            <h2>Savoir plus</h2>
            <p>Edu-nova est une plateforme tunisienne d'apprentissage en ligne dédiée aux lycéens, aux étudiants des classes préparatoires et à plusieurs autres spécialités académiques. Nous proposons gratuitement des ressources pédagogiques variées, notamment des documents et des cours vidéo, pour accompagner les élèves dans leur parcours scolaire et universitaire.</p>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Cours Gratuits</h3>
              <p>Accédez à une vaste bibliothèque de cours pour tous les niveaux</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎥</div>
              <h3>Vidéos Éducatives</h3>
              <p>Apprenez avec nos vidéos explicatives détaillées</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>Exercices Pratiques</h3>
              <p>Renforcez vos connaissances avec nos exercices interactifs</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🏆</div>
              <h3>Suivi des Progrès</h3>
              <p>Suivez votre évolution et atteignez vos objectifs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Hero Section Styles */
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 70vh;
      padding: 4rem 2rem;
      color: white;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      animation: fadeInUp 1s ease-out;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      font-weight: 300;
      animation: fadeInUp 1s ease-out 0.2s both;
    }

    .cta-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
    }

    .cta-button:active {
      transform: translateY(-1px);
    }

    /* Main Content Styles */
    .main-content {
      flex: 1;
      padding: 4rem 2rem;
      color: white;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .info-section {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 4rem;
      animation: fadeInUp 1s ease-out 0.6s both;
    }

    .info-section h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .info-section p {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      animation: fadeInUp 1s ease-out calc(0.8s + var(--delay, 0s)) both;
    }

    .feature-card:nth-child(1) { --delay: 0s; }
    .feature-card:nth-child(2) { --delay: 0.1s; }
    .feature-card:nth-child(3) { --delay: 0.2s; }
    .feature-card:nth-child(4) { --delay: 0.3s; }

    .feature-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .feature-card p {
      opacity: 0.9;
      line-height: 1.6;
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero {
        min-height: 60vh;
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .main-content {
        padding: 2rem 1rem;
      }

      .info-section h2 {
        font-size: 1.5rem;
      }

      .info-section p {
        font-size: 1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2rem;
      }

      .feature-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  scrollToContent() {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}