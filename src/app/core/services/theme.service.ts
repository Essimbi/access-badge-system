import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  // Couleurs 3CM
  public readonly colors: ThemeColors = {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',  // Bleu principal 3CM
      600: '#2563EB',  // Bleu moyen 3CM
      700: '#1D4ED8',
      800: '#1E40AF',  // Bleu foncé 3CM
      900: '#1E3A8A',
    },
    secondary: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',  // Corail 3CM
      500: '#EF4444',
      600: '#DC2626',  // Rouge 3CM
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',  // Gris métallique 3CM
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',  // Texte foncé 3CM
      900: '#111827',
    }
  };

  // Dégradés 3CM
  public readonly gradients = {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    secondary: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
    light: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
  };

  // Ombres 3CM
  public readonly shadows = {
    sm: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
    md: '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
    lg: '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
  };

  constructor() {
    // Charger le thème depuis le localStorage
    const savedTheme = localStorage.getItem('abs-theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  /**
   * Active le mode sombre
   */
  enableDarkMode(): void {
    document.body.classList.add('dark-theme');
    this.isDarkModeSubject.next(true);
    localStorage.setItem('abs-theme', 'dark');
  }

  /**
   * Active le mode clair
   */
  enableLightMode(): void {
    document.body.classList.remove('dark-theme');
    this.isDarkModeSubject.next(false);
    localStorage.setItem('abs-theme', 'light');
  }

  /**
   * Bascule entre mode clair et sombre
   */
  toggleTheme(): void {
    if (this.isDarkModeSubject.value) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  /**
   * Obtient une couleur par nom et nuance
   */
  getColor(colorName: keyof ThemeColors, shade: keyof ThemeColors['primary']): string {
    return this.colors[colorName][shade];
  }

  /**
   * Obtient la couleur primaire principale
   */
  getPrimaryColor(): string {
    return this.colors.primary[500];
  }

  /**
   * Obtient la couleur secondaire principale
   */
  getSecondaryColor(): string {
    return this.colors.secondary[600];
  }

  /**
   * Obtient un dégradé par nom
   */
  getGradient(gradientName: keyof typeof this.gradients): string {
    return this.gradients[gradientName];
  }

  /**
   * Obtient une ombre par taille
   */
  getShadow(size: keyof typeof this.shadows): string {
    return this.shadows[size];
  }

  /**
   * Génère les variables CSS pour le thème
   */
  getCSSVariables(): { [key: string]: string } {
    const variables: { [key: string]: string } = {};

    // Couleurs primaires
    Object.entries(this.colors.primary).forEach(([shade, color]) => {
      variables[`--color-primary-${shade}`] = color;
    });

    // Couleurs secondaires
    Object.entries(this.colors.secondary).forEach(([shade, color]) => {
      variables[`--color-secondary-${shade}`] = color;
    });

    // Couleurs de succès
    Object.entries(this.colors.success).forEach(([shade, color]) => {
      variables[`--color-success-${shade}`] = color;
    });

    // Couleurs d'avertissement
    Object.entries(this.colors.warning).forEach(([shade, color]) => {
      variables[`--color-warning-${shade}`] = color;
    });

    // Couleurs neutres
    Object.entries(this.colors.neutral).forEach(([shade, color]) => {
      variables[`--color-neutral-${shade}`] = color;
    });

    // Dégradés
    Object.entries(this.gradients).forEach(([name, gradient]) => {
      variables[`--gradient-${name}`] = gradient;
    });

    // Ombres
    Object.entries(this.shadows).forEach(([size, shadow]) => {
      variables[`--shadow-${size}`] = shadow;
    });

    return variables;
  }

  /**
   * Applique les variables CSS au document
   */
  applyThemeVariables(): void {
    const variables = this.getCSSVariables();
    const root = document.documentElement;

    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Obtient la couleur de statut appropriée
   */
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'success':
        return this.colors.success[500];
      case 'pending':
      case 'warning':
        return this.colors.warning[500];
      case 'rejected':
      case 'error':
      case 'danger':
        return this.colors.secondary[600];
      case 'info':
        return this.colors.primary[500];
      default:
        return this.colors.neutral[500];
    }
  }

  /**
   * Obtient la couleur de fond de statut appropriée
   */
  getStatusBackgroundColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'success':
        return this.colors.success[100];
      case 'pending':
      case 'warning':
        return this.colors.warning[100];
      case 'rejected':
      case 'error':
      case 'danger':
        return this.colors.secondary[100];
      case 'info':
        return this.colors.primary[100];
      default:
        return this.colors.neutral[100];
    }
  }
}