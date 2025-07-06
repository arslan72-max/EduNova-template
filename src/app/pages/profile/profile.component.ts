import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="user">
      <div class="content-wrapper">
        <div class="profile-header">
          <div class="profile-avatar">
            <img [src]="user.avatar" [alt]="user.fullName" />
          </div>
          <div class="profile-info">
            <h1>{{ user.fullName }}</h1>
            <p class="email">{{ user.email }}</p>
            <div class="profile-details">
              <div class="detail-item">
                <span class="label">Niveau:</span>
                <span class="value">{{ user.level }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Spécialité:</span>
                <span class="value">{{ user.specialty }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Membre depuis:</span>
                <span class="value">{{ formatDate(user.joinDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.courses }}</div>
            <div class="stat-label">Cours Suivis</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.exercises }}</div>
            <div class="stat-label">Exercices Résolus</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.successRate }}%</div>
            <div class="stat-label">Taux de Réussite</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.hoursThisWeek }}</div>
            <div class="stat-label">Heures cette semaine</div>
          </div>
        </div>

        <div class="profile-sections">
          <div class="section">
            <h3>Activité Récente</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">📖</div>
                <div class="activity-content">
                  <p>Cours terminé: Analyse Mathématique</p>
                  <span class="activity-time">Il y a 2 heures</span>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">✏️</div>
                <div class="activity-content">
                  <p>Exercice résolu: Algèbre Linéaire #15</p>
                  <span class="activity-time">Il y a 5 heures</span>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">🎥</div>
                <div class="activity-content">
                  <p>Vidéo regardée: Dérivées et Applications</p>
                  <span class="activity-time">Hier</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Objectifs</h3>
            <div class="goals-list">
              <div class="goal-item">
                <div class="goal-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="animatedProgress.physicsModule"></div>
                  </div>
                </div>
                <div class="goal-content">
                  <p>Terminer le module de Physique Quantique</p>
                  <span class="goal-progress-text">{{ animatedProgress.physicsModule }}% complété</span>
                </div>
              </div>
              <div class="goal-item">
                <div class="goal-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="animatedProgress.mathExercises"></div>
                  </div>
                </div>
                <div class="goal-content">
                  <p>Résoudre 50 exercices de mathématiques</p>
                  <span class="goal-progress-text">{{ Math.round(animatedProgress.mathExercises * 50 / 100) }}/50 exercices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .profile-avatar img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(255, 255, 255, 0.3);
    }

    .profile-info h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .email {
      font-size: 1.1rem;
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }

    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      gap: 1rem;
    }

    .label {
      font-weight: 600;
      min-width: 100px;
    }

    .value {
      opacity: 0.9;
    }

    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transition: all 0.3s ease;
    }

    .stat-label {
      opacity: 0.9;
      font-weight: 500;
    }

    .profile-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .section h3 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .activity-list, .goals-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: background 0.3s ease;
    }

    .activity-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .activity-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .activity-time {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .goal-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .goal-progress {
      width: 60px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .goal-content p {
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .goal-progress-text {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 4rem 1rem 2rem;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .profile-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  Math = Math; // Make Math available in template

  // Target values for statistics
  private targetStats = {
    courses: 24,
    exercises: 156,
    successRate: 89,
    hoursThisWeek: 12
  };

  // Target values for progress bars
  private targetProgress = {
    physicsModule: 75,
    mathExercises: 40
  };

  // Current animated values
  animatedStats = {
    courses: 0,
    exercises: 0,
    successRate: 0,
    hoursThisWeek: 0
  };

  animatedProgress = {
    physicsModule: 0,
    mathExercises: 0
  };

  private animationIntervals: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.startCountingAnimations();
      }
    });
  }

  ngOnDestroy() {
    // Clean up intervals
    this.animationIntervals.forEach(interval => clearInterval(interval));
  }

  private startCountingAnimations() {
    // Delay the start of animations slightly for better effect
    setTimeout(() => {
      this.animateNumber('courses', this.targetStats.courses, 2000);
      this.animateNumber('exercises', this.targetStats.exercises, 2500);
      this.animateNumber('successRate', this.targetStats.successRate, 2200);
      this.animateNumber('hoursThisWeek', this.targetStats.hoursThisWeek, 1800);
      
      // Animate progress bars
      this.animateProgress('physicsModule', this.targetProgress.physicsModule, 2300);
      this.animateProgress('mathExercises', this.targetProgress.mathExercises, 2600);
    }, 500);
  }

  private animateNumber(property: keyof typeof this.animatedStats, target: number, duration: number) {
    const startTime = Date.now();
    const startValue = 0;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easedProgress = this.easeOutCubic(progress);
      const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
      
      this.animatedStats[property] = currentValue;
      
      if (progress >= 1) {
        clearInterval(interval);
        this.animatedStats[property] = target; // Ensure exact target value
      }
    }, 16); // ~60fps
    
    this.animationIntervals.push(interval);
  }

  private animateProgress(property: keyof typeof this.animatedProgress, target: number, duration: number) {
    const startTime = Date.now();
    const startValue = 0;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easedProgress = this.easeOutCubic(progress);
      const currentValue = startValue + (target - startValue) * easedProgress;
      
      this.animatedProgress[property] = Math.round(currentValue * 10) / 10; // Round to 1 decimal
      
      if (progress >= 1) {
        clearInterval(interval);
        this.animatedProgress[property] = target; // Ensure exact target value
      }
    }, 16); // ~60fps
    
    this.animationIntervals.push(interval);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}