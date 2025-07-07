import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SettingsData {
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

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="content-wrapper">
        <div class="settings-header">
          <h1 class="page-title">Paramètres</h1>
          <p class="page-subtitle">Personnalisez votre expérience Edu-Nova</p>
        </div>

        <div class="settings-content">
          <!-- Theme Settings -->
          <div class="settings-section">
            <div class="section-header">
              <div class="section-icon">🎨</div>
              <h3>Apparence</h3>
            </div>
            <div class="setting-item">
              <label for="theme">Thème</label>
              <select id="theme" [(ngModel)]="settings.theme" (change)="saveSettings()" class="setting-select">
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>
            <div class="setting-item">
              <label for="language">Langue</label>
              <select id="language" [(ngModel)]="settings.language" (change)="saveSettings()" class="setting-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="settings-section">
            <div class="section-header">
              <div class="section-icon">🔔</div>
              <h3>Notifications</h3>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.notifications.email"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Notifications par email
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.notifications.push"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Notifications push
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.notifications.newCourses"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Nouveaux cours disponibles
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.notifications.reminders"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Rappels d'étude
              </label>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="settings-section">
            <div class="section-header">
              <div class="section-icon">🔒</div>
              <h3>Confidentialité</h3>
            </div>
            <div class="setting-item">
              <label for="profileVisibility">Visibilité du profil</label>
              <select id="profileVisibility" [(ngModel)]="settings.privacy.profileVisibility" (change)="saveSettings()" class="setting-select">
                <option value="public">Public</option>
                <option value="private">Privé</option>
                <option value="friends">Amis uniquement</option>
              </select>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.privacy.showProgress"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Afficher mes progrès
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.privacy.allowMessages"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Autoriser les messages privés
              </label>
            </div>
          </div>

          <!-- Video Preferences -->
          <div class="settings-section">
            <div class="section-header">
              <div class="section-icon">🎥</div>
              <h3>Préférences Vidéo</h3>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.preferences.autoplay"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Lecture automatique
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="settings.preferences.subtitles"
                  (change)="saveSettings()"
                  class="toggle-input">
                <span class="toggle-slider"></span>
                Sous-titres par défaut
              </label>
            </div>
            <div class="setting-item">
              <label for="playbackSpeed">Vitesse de lecture</label>
              <select id="playbackSpeed" [(ngModel)]="settings.preferences.playbackSpeed" (change)="saveSettings()" class="setting-select">
                <option [value]="0.5">0.5x</option>
                <option [value]="0.75">0.75x</option>
                <option [value]="1">1x (Normal)</option>
                <option [value]="1.25">1.25x</option>
                <option [value]="1.5">1.5x</option>
                <option [value]="2">2x</option>
              </select>
            </div>
            <div class="setting-item">
              <label for="downloadQuality">Qualité de téléchargement</label>
              <select id="downloadQuality" [(ngModel)]="settings.preferences.downloadQuality" (change)="saveSettings()" class="setting-select">
                <option value="low">Basse (480p)</option>
                <option value="medium">Moyenne (720p)</option>
                <option value="high">Haute (1080p)</option>
              </select>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="settings-section">
            <div class="section-header">
              <div class="section-icon">⚙️</div>
              <h3>Compte</h3>
            </div>
            <div class="action-buttons">
              <button class="action-btn primary" (click)="exportData()">
                📥 Exporter mes données
              </button>
              <button class="action-btn secondary" (click)="resetSettings()">
                🔄 Réinitialiser les paramètres
              </button>
              <button class="action-btn danger" (click)="showDeleteConfirmation = true">
                🗑️ Supprimer le compte
              </button>
            </div>
          </div>
        </div>

        <!-- Save Notification -->
        <div class="save-notification" [class.show]="showSaveNotification">
          ✅ Paramètres sauvegardés
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal-overlay" *ngIf="showDeleteConfirmation" (click)="showDeleteConfirmation = false">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>Supprimer le compte</h3>
            <p>Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.</p>
            <div class="modal-actions">
              <button class="action-btn secondary" (click)="showDeleteConfirmation = false">
                Annuler
              </button>
              <button class="action-btn danger" (click)="deleteAccount()">
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .settings-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .page-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .settings-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .section-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-item label {
      font-weight: 500;
      flex: 1;
    }

    .setting-select {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      min-width: 150px;
      backdrop-filter: blur(10px);
    }

    .setting-select:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
    }

    .setting-select option {
      background: #333;
      color: white;
    }

    /* Toggle Switch Styles */
    .toggle-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 100%;
      justify-content: space-between;
    }

    .toggle-input {
      display: none;
    }

    .toggle-slider {
      position: relative;
      width: 50px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .toggle-input:checked + .toggle-slider {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .toggle-input:checked + .toggle-slider::before {
      transform: translateX(26px);
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-btn {
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .action-btn.danger {
      background: rgba(220, 53, 69, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(220, 53, 69, 0.5);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .action-btn.danger:hover {
      background: rgba(220, 53, 69, 0.3);
    }

    /* Save Notification */
    .save-notification {
      position: fixed;
      top: 100px;
      right: 2rem;
      background: rgba(40, 167, 69, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      backdrop-filter: blur(10px);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 1000;
    }

    .save-notification.show {
      transform: translateX(0);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
    }

    .modal-content h3 {
      margin-bottom: 1rem;
      color: #ff6b6b;
    }

    .modal-content p {
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 4rem 1rem 2rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .settings-section {
        padding: 1.5rem;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .toggle-label {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      }

      .setting-select {
        width: 100%;
      }

      .modal-actions {
        flex-direction: column;
      }

      .save-notification {
        right: 1rem;
        left: 1rem;
        text-align: center;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: SettingsData = {
    theme: 'auto',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      newCourses: true,
      reminders: false
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      allowMessages: true
    },
    preferences: {
      autoplay: false,
      subtitles: true,
      playbackSpeed: 1,
      downloadQuality: 'medium'
    }
  };

  showSaveNotification = false;
  showDeleteConfirmation = false;

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('eduNovaSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  saveSettings() {
    localStorage.setItem('eduNovaSettings', JSON.stringify(this.settings));
    this.showSaveNotification = true;
    
    setTimeout(() => {
      this.showSaveNotification = false;
    }, 3000);
  }

  resetSettings() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      this.settings = {
        theme: 'auto',
        language: 'fr',
        notifications: {
          email: true,
          push: true,
          newCourses: true,
          reminders: false
        },
        privacy: {
          profileVisibility: 'public',
          showProgress: true,
          allowMessages: true
        },
        preferences: {
          autoplay: false,
          subtitles: true,
          playbackSpeed: 1,
          downloadQuality: 'medium'
        }
      };
      this.saveSettings();
    }
  }

  exportData() {
    const userData = {
      settings: this.settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'edu-nova-data.json';
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  deleteAccount() {
    // In a real application, this would make an API call
    alert('Fonctionnalité de suppression de compte non implémentée dans cette démo.');
    this.showDeleteConfirmation = false;
  }
}