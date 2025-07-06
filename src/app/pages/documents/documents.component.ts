import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  standalone: true,
  template: `
    <div class="documents-container">
      <div class="content-wrapper">
        <h1 class="page-title">Documents</h1>
        
        <div class="documents-grid">
          <div class="document-category">
            <div class="category-icon">📖</div>
            <h3>Cours</h3>
            <p>Accédez à tous nos cours structurés par matière et niveau</p>
            <button class="category-btn">Explorer les cours</button>
          </div>
          
          <div class="document-category">
            <div class="category-icon">✏️</div>
            <h3>Exercices</h3>
            <p>Pratiquez avec nos exercices corrigés et détaillés</p>
            <button class="category-btn">Voir les exercices</button>
          </div>
          
          <div class="document-category">
            <div class="category-icon">📋</div>
            <h3>Fiches</h3>
            <p>Consultez nos fiches de révision synthétiques</p>
            <button class="category-btn">Télécharger les fiches</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-container {
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

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .document-category {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .document-category:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .category-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .document-category h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .document-category p {
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .category-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .category-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .documents-container {
        padding: 4rem 1rem 2rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .documents-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentsComponent {}