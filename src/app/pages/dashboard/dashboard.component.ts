import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Document, Video } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="content-wrapper">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-bar">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Rechercher des cours, exercices, vidéos..."
              class="search-input">
            <button class="search-btn">🔍</button>
          </div>
          
          <div class="filters">
            <select [(ngModel)]="selectedSubject" (change)="onFilter()" class="filter-select">
              <option value="">Toutes les matières</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Physique">Physique</option>
              <option value="Chimie">Chimie</option>
              <option value="Informatique">Informatique</option>
              <option value="Histoire">Histoire</option>
              <option value="Français">Français</option>
            </select>
            
            <select [(ngModel)]="selectedLevel" (change)="onFilter()" class="filter-select">
              <option value="">Tous les niveaux</option>
              <option value="Terminale">Terminale</option>
              <option value="Prépa">Prépa</option>
              <option value="Université">Université</option>
            </select>
            
            <select [(ngModel)]="selectedType" (change)="onFilter()" class="filter-select">
              <option value="">Tous les types</option>
              <option value="cours">Cours</option>
              <option value="exercices">Exercices</option>
              <option value="fiches">Fiches</option>
              <option value="videos">Vidéos</option>
            </select>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section">
          <div class="section-tabs">
            <button 
              class="tab-btn"
              [class.active]="activeTab === 'documents'"
              (click)="setActiveTab('documents')">
              Documents ({{ filteredDocuments.length }})
            </button>
            <button 
              class="tab-btn"
              [class.active]="activeTab === 'videos'"
              (click)="setActiveTab('videos')">
              Vidéos ({{ filteredVideos.length }})
            </button>
          </div>

          <!-- Documents Grid -->
          <div class="content-grid" *ngIf="activeTab === 'documents'">
            <div class="content-card" *ngFor="let doc of filteredDocuments">
              <div class="card-thumbnail">
                <img [src]="doc.thumbnail" [alt]="doc.title">
                <div class="card-type">{{ doc.type }}</div>
              </div>
              <div class="card-content">
                <h3>{{ doc.title }}</h3>
                <p class="card-description">{{ doc.description }}</p>
                <div class="card-meta">
                  <span class="subject">{{ doc.subject }}</span>
                  <span class="level">{{ doc.level }}</span>
                  <span class="pages">{{ doc.pages }} pages</span>
                </div>
                <button class="card-btn">Télécharger</button>
              </div>
            </div>
          </div>

          <!-- Videos Grid -->
          <div class="content-grid" *ngIf="activeTab === 'videos'">
            <div class="content-card" *ngFor="let video of filteredVideos">
              <div class="card-thumbnail">
                <img [src]="video.thumbnail" [alt]="video.title">
                <div class="video-duration">{{ video.duration }}</div>
                <div class="play-overlay">▶</div>
              </div>
              <div class="card-content">
                <h3>{{ video.title }}</h3>
                <p class="card-description">{{ video.description }}</p>
                <div class="card-meta">
                  <span class="subject">{{ video.subject }}</span>
                  <span class="level">{{ video.level }}</span>
                  <span class="views">{{ formatViews(video.views) }} vues</span>
                </div>
                <button class="card-btn">Regarder</button>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div class="no-results" *ngIf="(activeTab === 'documents' && filteredDocuments.length === 0) || (activeTab === 'videos' && filteredVideos.length === 0)">
            <div class="no-results-icon">🔍</div>
            <h3>Aucun résultat trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-section {
      margin-bottom: 3rem;
    }

    .search-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      backdrop-filter: blur(10px);
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .search-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
    }

    .search-btn {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
    }

    .filter-select option {
      background: #333;
      color: white;
    }

    .section-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 25px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
    }

    .tab-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.15);
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .content-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .content-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .card-thumbnail {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .card-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .content-card:hover .card-thumbnail img {
      transform: scale(1.05);
    }

    .card-type {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
    }

    .video-duration {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .content-card:hover .play-overlay {
      opacity: 1;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-content h3 {
      font-size: 1.2rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      line-height: 1.3;
    }

    .card-description {
      opacity: 0.9;
      margin-bottom: 1rem;
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .card-meta {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .card-meta span {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .subject {
      background: rgba(102, 126, 234, 0.3) !important;
    }

    .level {
      background: rgba(118, 75, 162, 0.3) !important;
    }

    .card-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .card-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      opacity: 0.8;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 4rem 1rem 2rem;
      }

      .search-bar {
        flex-direction: column;
      }

      .filters {
        flex-direction: column;
        align-items: center;
      }

      .filter-select {
        width: 100%;
        max-width: 300px;
      }

      .section-tabs {
        flex-direction: column;
        align-items: center;
      }

      .tab-btn {
        width: 100%;
        max-width: 300px;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  documents: Document[] = [];
  videos: Video[] = [];
  filteredDocuments: Document[] = [];
  filteredVideos: Video[] = [];
  
  searchQuery = '';
  selectedSubject = '';
  selectedLevel = '';
  selectedType = '';
  activeTab = 'documents';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDocuments();
    this.loadVideos();
  }

  loadDocuments() {
    const filters = {
      search: this.searchQuery,
      subject: this.selectedSubject,
      level: this.selectedLevel,
      type: this.selectedType
    };

    this.apiService.getDocuments(filters).subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.filteredDocuments = response.documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  loadVideos() {
    const filters = {
      search: this.searchQuery,
      subject: this.selectedSubject,
      level: this.selectedLevel
    };

    this.apiService.getVideos(filters).subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.filteredVideos = response.videos;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
      }
    });
  }

  onSearch() {
    this.loadDocuments();
    this.loadVideos();
  }

  onFilter() {
    this.loadDocuments();
    this.loadVideos();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  formatViews(views: number): string {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  }
}