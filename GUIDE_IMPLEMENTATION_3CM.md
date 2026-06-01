# 🚀 Guide d'Implémentation - Charte Graphique 3CM

## 📋 **Vue d'ensemble**

Ce guide explique comment utiliser la charte graphique 3CM dans le projet ABS. Toutes les couleurs, composants et styles sont maintenant alignés sur l'identité visuelle de **3CM - Créons l'avenir ensemble**.

---

## 🎨 **1. Utilisation des Couleurs**

### **Classes Tailwind CSS**

```html
<!-- Couleurs de texte -->
<h1 class="text-primary-600">Titre principal</h1>
<p class="text-3cm-dark">Texte principal</p>
<span class="text-3cm-muted">Texte secondaire</span>

<!-- Couleurs d'arrière-plan -->
<div class="bg-primary-500">Arrière-plan bleu 3CM</div>
<div class="bg-secondary-600">Arrière-plan rouge 3CM</div>
<div class="bg-3cm-gradient">Dégradé principal</div>

<!-- Bordures -->
<div class="border-primary-500">Bordure bleue</div>
<div class="border-secondary-600">Bordure rouge</div>
```

### **Variables SCSS**

```scss
// Importer les variables 3CM
@import 'styles/variables-3cm';

.mon-composant {
    background: $tcm-primary-500;
    color: white;
    border: 1px solid $tcm-primary-600;
    box-shadow: $shadow-3cm;
}
```

### **Service Theme (TypeScript)**

```typescript
import { ThemeService } from './core/services/theme.service';

constructor(private themeService: ThemeService) {}

// Obtenir une couleur
const primaryColor = this.themeService.getPrimaryColor();
const statusColor = this.themeService.getStatusColor('approved');

// Obtenir un dégradé
const gradient = this.themeService.getGradient('primary');
```

---

## 🧩 **2. Composants Prêts à l'Emploi**

### **Boutons 3CM**

```html
<!-- Bouton principal -->
<button class="btn-3cm-primary">
    <mat-icon>add</mat-icon>
    Action Principale
</button>

<!-- Bouton secondaire -->
<button class="btn-3cm-secondary">
    Action Secondaire
</button>

<!-- Bouton contour -->
<button class="btn-3cm-outline">
    Action Tertiaire
</button>
```

### **Cartes 3CM**

```html
<!-- Carte standard -->
<div class="card-3cm">
    <h3 class="text-3cm-dark">Titre</h3>
    <p class="text-3cm-muted">Contenu de la carte</p>
</div>

<!-- Carte statistique -->
<div class="card-3cm-stat">
    <mat-icon class="stat-icon text-primary-500">people</mat-icon>
    <div class="stat-number text-primary-600">1,234</div>
    <div class="stat-label">Participants</div>
</div>

<!-- Carte avec dégradé -->
<div class="card-3cm-gradient">
    <h3 class="card-title">Titre</h3>
    <p class="card-content">Contenu avec arrière-plan dégradé</p>
</div>
```

### **Badges et Statuts**

```html
<!-- Badges -->
<span class="badge-3cm badge-primary">Primaire</span>
<span class="badge-3cm badge-success">Succès</span>
<span class="badge-3cm badge-warning">Avertissement</span>
<span class="badge-3cm badge-danger">Danger</span>

<!-- Statuts -->
<span class="status-approved">Approuvé</span>
<span class="status-pending">En attente</span>
<span class="status-rejected">Rejeté</span>
<span class="status-active">Actif</span>
```

---

## 📐 **3. Layout et Grilles**

### **Container Responsive**

```html
<div class="container-3cm">
    <!-- Contenu centré avec padding responsive -->
</div>
```

### **Grilles Adaptatives**

```html
<!-- 4 colonnes sur desktop, 2 sur tablet, 1 sur mobile -->
<div class="grid-3cm grid-4">
    <div class="card-3cm">Élément 1</div>
    <div class="card-3cm">Élément 2</div>
    <div class="card-3cm">Élément 3</div>
    <div class="card-3cm">Élément 4</div>
</div>

<!-- 3 colonnes responsive -->
<div class="grid-3cm grid-3">
    <!-- Contenu -->
</div>
```

---

## ✨ **4. Animations et Transitions**

### **Classes d'Animation**

```html
<!-- Fade in -->
<div class="animate-3cm-fade-in">Contenu qui apparaît</div>

<!-- Slide up -->
<div class="animate-3cm-slide-up">Contenu qui glisse</div>

<!-- Bounce -->
<div class="animate-3cm-bounce">Contenu qui rebondit</div>

<!-- Avec délai -->
<div class="animate-3cm-fade-in" style="animation-delay: 0.2s">
    Contenu avec délai
</div>
```

### **Transitions CSS**

```scss
.mon-element {
    transition: $transition-normal; // 200ms ease-in-out
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-3cm-lg;
    }
}
```

---

## 🎯 **5. Typographie 3CM**

### **Titres avec Style**

```html
<!-- Titre standard -->
<h1 class="heading-3cm text-4xl">Titre Principal</h1>

<!-- Titre avec dégradé -->
<h1 class="heading-3cm heading-gradient text-4xl">
    Titre avec Dégradé 3CM
</h1>

<!-- Hiérarchie des titres -->
<h1 class="heading-3cm text-4xl text-3cm-dark">H1 - 36px</h1>
<h2 class="heading-3cm text-3xl text-primary-600">H2 - 30px</h2>
<h3 class="heading-3cm text-2xl text-3cm-dark">H3 - 24px</h3>
```

### **Texte avec Couleurs**

```html
<p class="text-3cm-dark">Texte principal</p>
<p class="text-3cm-primary">Texte bleu 3CM</p>
<p class="text-3cm-secondary">Texte rouge 3CM</p>
<p class="text-3cm-muted">Texte atténué</p>
```

---

## 🎨 **6. États Vides et Feedback**

### **État Vide**

```html
<div class="empty-state">
    <mat-icon class="empty-icon">inbox</mat-icon>
    <h3 class="empty-title">Aucun élément</h3>
    <p class="empty-description">Description de l'état vide</p>
    <button class="btn-3cm-primary">Action</button>
</div>
```

### **Loading State**

```html
<div class="loading-overlay">
    <mat-spinner class="loading-spinner"></mat-spinner>
</div>
```

---

## 📱 **7. Responsive Design**

### **Classes Utilitaires**

```html
<!-- Masquer sur mobile -->
<div class="hide-mobile">Visible sur desktop seulement</div>

<!-- Masquer sur desktop -->
<div class="hide-desktop">Visible sur mobile seulement</div>

<!-- Grilles responsives automatiques -->
<div class="grid-3cm grid-4">
    <!-- 4 cols desktop, 2 tablet, 1 mobile -->
</div>
```

### **Breakpoints**

```scss
// Mobile first
.mon-composant {
    padding: $spacing-md;
    
    @media (min-width: 768px) {
        // Tablet
        padding: $spacing-lg;
    }
    
    @media (min-width: 1024px) {
        // Desktop
        padding: $spacing-xl;
    }
}
```

---

## 🔧 **8. Personnalisation Angular Material**

### **Thème Automatique**

Le thème 3CM est automatiquement appliqué à tous les composants Material :

```html
<!-- Ces composants utilisent automatiquement les couleurs 3CM -->
<mat-button color="primary">Bouton Material</mat-button>
<mat-card>Carte Material</mat-card>
<mat-form-field>
    <input matInput placeholder="Champ Material">
</mat-form-field>
```

### **Classes Personnalisées**

```html
<!-- Snackbars avec couleurs 3CM -->
<div class="snackbar-success">Message de succès</div>
<div class="snackbar-error">Message d'erreur</div>
<div class="snackbar-info">Message d'information</div>
<div class="snackbar-warning">Message d'avertissement</div>
```

---

## 🎭 **9. Mode Sombre (Optionnel)**

### **Activation**

```typescript
// Dans un composant
constructor(private themeService: ThemeService) {}

toggleDarkMode() {
    this.themeService.toggleTheme();
}
```

### **Styles Adaptatifs**

```scss
.mon-composant {
    background: white;
    color: $tcm-neutral-800;
    
    .dark-theme & {
        background: $tcm-neutral-800;
        color: $tcm-neutral-100;
    }
}
```

---

## 📋 **10. Checklist d'Implémentation**

### **Pour Chaque Nouveau Composant**

- [ ] **Couleurs** : Utiliser la palette 3CM (primary, secondary, neutral)
- [ ] **Typographie** : Appliquer les classes `heading-3cm` et `text-3cm-*`
- [ ] **Espacement** : Utiliser les variables `$spacing-*` ou classes Tailwind
- [ ] **Ombres** : Appliquer `shadow-3cm` ou `box-shadow: $shadow-3cm`
- [ ] **Transitions** : Ajouter `transition: $transition-normal`
- [ ] **Responsive** : Tester sur mobile, tablet, desktop
- [ ] **Accessibilité** : Vérifier les contrastes et la navigation clavier

### **Pour les Formulaires**

- [ ] **Focus** : Couleur `$tcm-primary-500`
- [ ] **Erreurs** : Couleur `$tcm-accent-600` (rouge 3CM)
- [ ] **Succès** : Couleur `$tcm-success-500`
- [ ] **Labels** : Couleur `$tcm-neutral-700`

### **Pour les Tableaux**

- [ ] **En-têtes** : Arrière-plan `$gradient-3cm-light`
- [ ] **Hover** : Arrière-plan `$tcm-primary-50`
- [ ] **Bordures** : Couleur `$tcm-neutral-200`

---

## 🚀 **11. Exemples Complets**

### **Dashboard Card**

```html
<div class="card-3cm animate-3cm-fade-in">
    <div class="card-header">
        <h3 class="heading-3cm text-xl text-3cm-dark">Statistiques</h3>
    </div>
    
    <div class="grid-3cm grid-2">
        <div class="card-3cm-stat">
            <mat-icon class="stat-icon text-primary-500">people</mat-icon>
            <div class="stat-number text-primary-600">1,234</div>
            <div class="stat-label">Utilisateurs</div>
        </div>
        
        <div class="card-3cm-stat">
            <mat-icon class="stat-icon text-success-500">event</mat-icon>
            <div class="stat-number text-success-600">56</div>
            <div class="stat-label">Événements</div>
        </div>
    </div>
    
    <div class="flex gap-4 mt-6">
        <button class="btn-3cm-primary">
            <mat-icon>add</mat-icon>
            Nouveau
        </button>
        <button class="btn-3cm-outline">
            Voir tout
        </button>
    </div>
</div>
```

### **Liste avec Actions**

```html
<div class="card-3cm">
    <div class="card-header">
        <h3 class="heading-3cm text-xl">Événements</h3>
        <button class="btn-3cm-primary">
            <mat-icon>add</mat-icon>
            Créer
        </button>
    </div>
    
    <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-3cm-neutral rounded-lg hover:bg-primary-50 transition-colors">
            <div>
                <h4 class="font-semibold text-3cm-dark">Conférence Tech 2024</h4>
                <p class="text-3cm-muted text-sm">15 Mars 2024</p>
            </div>
            <div class="flex gap-2">
                <span class="status-active">Actif</span>
                <button class="btn-3cm-outline text-sm">Modifier</button>
            </div>
        </div>
    </div>
</div>
```

---

## 📚 **12. Ressources et Documentation**

### **Fichiers de Référence**

- `src/styles/_variables-3cm.scss` - Variables SCSS
- `src/styles/_utilities-3cm.scss` - Classes utilitaires
- `src/styles/_material-theme-3cm.scss` - Thème Material
- `src/app/core/services/theme.service.ts` - Service de thème
- `CHARTE_GRAPHIQUE_3CM.md` - Documentation complète

### **Composant de Démonstration**

```typescript
// Voir toutes les couleurs et composants en action
import { ThemeDemoComponent } from './features/system/theme-demo/theme-demo.component';
```

### **Variables CSS Disponibles**

```css
/* Couleurs principales */
--color-primary-500: #3B82F6;
--color-secondary-600: #DC2626;

/* Dégradés */
--gradient-primary: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);

/* Ombres */
--shadow-sm: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
```

---

**🎨 La charte graphique 3CM est maintenant prête à être utilisée dans tout le projet ABS !**

*Pour toute question ou suggestion d'amélioration, consultez la documentation complète ou le composant de démonstration.*