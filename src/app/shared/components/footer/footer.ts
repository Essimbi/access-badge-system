import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appVersion = '1.0.0';
  buildDate = '2024-06-01';

  /**
   * Ouvre les informations de version
   */
  openVersionInfo(): void {
    // Logique pour afficher les détails de version
    console.log('Version info clicked');
  }

  /**
   * Ouvre les informations légales
   */
  openLegalInfo(): void {
    // Logique pour afficher les mentions légales
    console.log('Legal info clicked');
  }
}