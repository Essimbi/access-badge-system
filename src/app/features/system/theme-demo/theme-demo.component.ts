import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container-3cm py-8">
      <div class="text-center mb-8">
        <h1 class="heading-3cm heading-gradient text-4xl mb-4">
          Charte Graphique 3CM
        </h1>
        <p class="text-3cm-muted text-lg">
          Système de design pour l'application ABS
        </p>
      </div>

      <!-- Couleurs Principales -->
      <mat-card class="card-3cm mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-bold text-3cm-primary">Couleurs Principales</h2>
        </div>
        
        <div class="grid-3cm grid-2 mb-6">
          <!-- Palette Primaire -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Bleu Principal (3CM)</h3>
            <div class="grid grid-cols-5 gap-2">
              <div *ngFor="let shade of primaryShades" 
                   class="text-center p-3 rounded-lg text-white text-sm font-medium"
                   [style.background-color]="themeService.getColor('primary', shade.key)">
                {{ shade.key }}
                <div class="text-xs opacity-90 mt-1">{{ themeService.getColor('primary', shade.key) }}</div>
              </div>
            </div>
          </div>

          <!-- Palette Secondaire -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Rouge Accent (3CM)</h3>
            <div class="grid grid-cols-5 gap-2">
              <div *ngFor="let shade of secondaryShades" 
                   class="text-center p-3 rounded-lg text-white text-sm font-medium"
                   [style.background-color]="themeService.getColor('secondary', shade.key)">
                {{ shade.key }}
                <div class="text-xs opacity-90 mt-1">{{ themeService.getColor('secondary', shade.key) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Couleurs Fonctionnelles -->
        <div class="grid-3cm grid-3">
          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Succès</h3>
            <div class="grid grid-cols-3 gap-2">
              <div *ngFor="let shade of functionalShades" 
                   class="text-center p-3 rounded-lg text-white text-sm font-medium"
                   [style.background-color]="themeService.getColor('success', shade)">
                {{ shade }}
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Avertissement</h3>
            <div class="grid grid-cols-3 gap-2">
              <div *ngFor="let shade of functionalShades" 
                   class="text-center p-3 rounded-lg text-white text-sm font-medium"
                   [style.background-color]="themeService.getColor('warning', shade)">
                {{ shade }}
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Neutres</h3>
            <div class="grid grid-cols-3 gap-2">
              <div *ngFor="let shade of functionalShades" 
                   class="text-center p-3 rounded-lg text-white text-sm font-medium"
                   [style.background-color]="themeService.getColor('neutral', shade)">
                {{ shade }}
              </div>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Dégradés -->
      <mat-card class="card-3cm mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-bold text-3cm-primary">Dégradés 3CM</h2>
        </div>
        
        <div class="grid-3cm grid-3">
          <div class="text-center">
            <div class="h-24 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
                 [style.background]="themeService.getGradient('primary')">
              Primaire
            </div>
            <code class="text-sm text-3cm-muted">gradient-3cm-primary</code>
          </div>

          <div class="text-center">
            <div class="h-24 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
                 [style.background]="themeService.getGradient('secondary')">
              Secondaire
            </div>
            <code class="text-sm text-3cm-muted">gradient-3cm-secondary</code>
          </div>

          <div class="text-center">
            <div class="h-24 rounded-lg mb-4 flex items-center justify-center text-primary-800 font-bold"
                 [style.background]="themeService.getGradient('light')">
              Clair
            </div>
            <code class="text-sm text-3cm-muted">gradient-3cm-light</code>
          </div>
        </div>
      </mat-card>

      <!-- Composants -->
      <mat-card class="card-3cm mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-bold text-3cm-primary">Composants</h2>
        </div>
        
        <div class="grid-3cm grid-2">
          <!-- Boutons -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Boutons</h3>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-4">
                <button class="btn-3cm-primary">Primaire</button>
                <button class="btn-3cm-secondary">Secondaire</button>
                <button class="btn-3cm-outline">Contour</button>
              </div>
              
              <div class="flex flex-wrap gap-4">
                <button mat-raised-button color="primary">Material Primaire</button>
                <button mat-raised-button color="accent">Material Accent</button>
                <button mat-stroked-button color="primary">Material Contour</button>
              </div>
            </div>
          </div>

          <!-- Badges et Statuts -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-3cm-dark">Badges et Statuts</h3>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <span class="badge-3cm badge-primary">Primaire</span>
                <span class="badge-3cm badge-success">Succès</span>
                <span class="badge-3cm badge-warning">Avertissement</span>
                <span class="badge-3cm badge-danger">Danger</span>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <mat-chip class="status-approved">Approuvé</mat-chip>
                <mat-chip class="status-pending">En attente</mat-chip>
                <mat-chip class="status-rejected">Rejeté</mat-chip>
                <mat-chip class="status-active">Actif</mat-chip>
              </div>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Cartes -->
      <mat-card class="card-3cm mb-8">
        <div class="card-header">
          <h2 class="text-2xl font-bold text-3cm-primary">Cartes et Layouts</h2>
        </div>
        
        <div class="grid-3cm grid-3">
          <!-- Carte Statistique -->
          <div class="card-3cm-stat">
            <mat-icon class="stat-icon">people</mat-icon>
            <div class="stat-number">1,234</div>
            <div class="stat-label">Participants</div>
          </div>

          <!-- Carte Gradient -->
          <div class="card-3cm-gradient">
            <h3 class="card-title text-lg font-semibold mb-2">Carte Gradient</h3>
            <p class="card-content">Contenu avec arrière-plan dégradé 3CM</p>
          </div>

          <!-- Carte Standard -->
          <div class="card-3cm">
            <h3 class="text-lg font-semibold mb-2 text-3cm-dark">Carte Standard</h3>
            <p class="text-3cm-muted">Carte avec ombre et bordures arrondies</p>
          </div>
        </div>
      </mat-card>

      <!-- Typographie -->
      <mat-card class="card-3cm">
        <div class="card-header">
          <h2 class="text-2xl font-bold text-3cm-primary">Typographie</h2>
        </div>
        
        <div class="space-y-4">
          <div>
            <h1 class="heading-3cm text-4xl">Titre H1 - 3CM</h1>
            <h2 class="heading-3cm text-3xl">Titre H2 - 3CM</h2>
            <h3 class="heading-3cm text-2xl">Titre H3 - 3CM</h3>
            <h4 class="heading-3cm text-xl">Titre H4 - 3CM</h4>
          </div>
          
          <div>
            <p class="text-3cm-dark text-lg">Texte principal - Couleur foncée</p>
            <p class="text-3cm-primary text-lg">Texte primaire - Bleu 3CM</p>
            <p class="text-3cm-secondary text-lg">Texte secondaire - Rouge 3CM</p>
            <p class="text-3cm-muted text-lg">Texte atténué - Gris métallique</p>
          </div>
          
          <div>
            <h2 class="heading-3cm heading-gradient text-3xl">Titre avec Dégradé 3CM</h2>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
  `]
})
export class ThemeDemoComponent {
  primaryShades = [
    { key: 100 as const },
    { key: 300 as const },
    { key: 500 as const },
    { key: 700 as const },
    { key: 900 as const }
  ];

  secondaryShades = [
    { key: 100 as const },
    { key: 300 as const },
    { key: 500 as const },
    { key: 700 as const },
    { key: 900 as const }
  ];

  functionalShades = [300 as const, 500 as const, 700 as const];

  constructor(public themeService: ThemeService) {}
}