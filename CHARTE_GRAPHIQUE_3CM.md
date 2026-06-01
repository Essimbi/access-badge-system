# 🎨 Charte Graphique 3CM - Système ABS

## 📋 **Vue d'ensemble**

Cette charte graphique définit l'identité visuelle du système ABS (Antigravity Badge System) en respectant l'image de marque de **3CM - Créons l'avenir ensemble**.

---

## 🎯 **Couleurs Principales**

### **Palette Primaire - Bleu 3CM**
Inspirée du logo 3CM, cette palette utilise les nuances de bleu comme couleur principale.

```scss
$tcm-primary-50: #EFF6FF;   // Très clair
$tcm-primary-100: #DBEAFE;  // Clair
$tcm-primary-200: #BFDBFE;  // 
$tcm-primary-300: #93C5FD;  // 
$tcm-primary-400: #60A5FA;  // 
$tcm-primary-500: #3B82F6;  // ⭐ Bleu principal 3CM
$tcm-primary-600: #2563EB;  // ⭐ Bleu moyen 3CM
$tcm-primary-700: #1D4ED8;  // 
$tcm-primary-800: #1E40AF;  // ⭐ Bleu foncé 3CM
$tcm-primary-900: #1E3A8A;  // Très foncé
```

### **Palette Secondaire - Rouge/Corail 3CM**
Couleur d'accent extraite du logo 3CM.

```scss
$tcm-accent-50: #FEF2F2;    // Très clair
$tcm-accent-100: #FEE2E2;   // Clair
$tcm-accent-200: #FECACA;   // 
$tcm-accent-300: #FCA5A5;   // 
$tcm-accent-400: #F87171;   // ⭐ Corail 3CM
$tcm-accent-500: #EF4444;   // 
$tcm-accent-600: #DC2626;   // ⭐ Rouge 3CM
$tcm-accent-700: #B91C1C;   // 
$tcm-accent-800: #991B1B;   // 
$tcm-accent-900: #7F1D1D;   // Très foncé
```

### **Couleurs Neutres - Gris Métallique 3CM**
Couleurs de texte et d'arrière-plan inspirées du logo.

```scss
$tcm-neutral-50: #F9FAFB;   // Arrière-plan très clair
$tcm-neutral-100: #F3F4F6;  // Arrière-plan clair
$tcm-neutral-200: #E5E7EB;  // Bordures claires
$tcm-neutral-300: #D1D5DB;  // Bordures
$tcm-neutral-400: #9CA3AF;  // Texte désactivé
$tcm-neutral-500: #6B7280;  // ⭐ Gris métallique 3CM
$tcm-neutral-600: #4B5563;  // Texte secondaire
$tcm-neutral-700: #374151;  // Texte principal
$tcm-neutral-800: #1F2937;  // ⭐ Texte foncé 3CM
$tcm-neutral-900: #111827;  // Texte très foncé
```

---

## 🌈 **Couleurs Fonctionnelles**

### **Succès (Vert)**
```scss
$tcm-success-500: #10B981;  // Vert principal
$tcm-success-100: #D1FAE5;  // Arrière-plan clair
$tcm-success-800: #065F46;  // Texte foncé
```

### **Avertissement (Orange)**
```scss
$tcm-warning-500: #F59E0B;  // Orange principal
$tcm-warning-100: #FEF3C7;  // Arrière-plan clair
$tcm-warning-800: #92400E;  // Texte foncé
```

---

## 🎨 **Dégradés 3CM**

### **Dégradé Principal**
```css
background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
```
**Usage :** Boutons principaux, en-têtes, éléments d'action

### **Dégradé Accent**
```css
background: linear-gradient(135deg, #F87171 0%, #DC2626 100%);
```
**Usage :** Boutons secondaires, alertes, éléments d'attention

### **Dégradé Clair**
```css
background: linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%);
```
**Usage :** Arrière-plans subtils, zones de contenu

---

## 🔤 **Typographie**

### **Police Principale**
```scss
font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
```

### **Hiérarchie des Titres**
- **H1** : `text-4xl` (36px) - Couleur `#1F2937` ou dégradé
- **H2** : `text-3xl` (30px) - Couleur `#2563EB`
- **H3** : `text-2xl` (24px) - Couleur `#374151`
- **H4** : `text-xl` (20px) - Couleur `#4B5563`

### **Corps de Texte**
- **Principal** : `text-base` (16px) - Couleur `#1F2937`
- **Secondaire** : `text-sm` (14px) - Couleur `#6B7280`
- **Petit** : `text-xs` (12px) - Couleur `#9CA3AF`

---

## 📦 **Composants**

### **Boutons**

#### **Bouton Principal**
```html
<button class="btn-3cm-primary">Action Principale</button>
```
- Arrière-plan : Dégradé bleu 3CM
- Texte : Blanc
- Ombre : `shadow-3cm`

#### **Bouton Secondaire**
```html
<button class="btn-3cm-secondary">Action Secondaire</button>
```
- Arrière-plan : Dégradé rouge 3CM
- Texte : Blanc

#### **Bouton Contour**
```html
<button class="btn-3cm-outline">Action Tertiaire</button>
```
- Bordure : Bleu 3CM
- Texte : Bleu 3CM
- Hover : Arrière-plan bleu

### **Cartes**

#### **Carte Standard**
```html
<div class="card-3cm">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>
```

#### **Carte Statistique**
```html
<div class="card-3cm-stat">
  <mat-icon class="stat-icon">people</mat-icon>
  <div class="stat-number">1,234</div>
  <div class="stat-label">Participants</div>
</div>
```

#### **Carte Gradient**
```html
<div class="card-3cm-gradient">
  <h3 class="card-title">Titre</h3>
  <p class="card-content">Contenu</p>
</div>
```

### **Badges et Statuts**

#### **Badges**
```html
<span class="badge-3cm badge-primary">Primaire</span>
<span class="badge-3cm badge-success">Succès</span>
<span class="badge-3cm badge-warning">Avertissement</span>
<span class="badge-3cm badge-danger">Danger</span>
```

#### **Statuts**
```html
<span class="status-approved">Approuvé</span>
<span class="status-pending">En attente</span>
<span class="status-rejected">Rejeté</span>
<span class="status-active">Actif</span>
```

---

## 🎭 **Ombres et Effets**

### **Ombres 3CM**
```scss
// Petite ombre
box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 
            0 2px 4px -1px rgba(59, 130, 246, 0.06);

// Ombre moyenne
box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1), 
            0 4px 6px -2px rgba(59, 130, 246, 0.05);

// Grande ombre
box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1), 
            0 10px 10px -5px rgba(59, 130, 246, 0.04);
```

### **Transitions**
```scss
transition: 200ms ease-in-out; // Standard
transition: 150ms ease-in-out; // Rapide
transition: 300ms ease-in-out; // Lente
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile** : `< 768px`
- **Tablet** : `768px - 1024px`
- **Desktop** : `> 1024px`

### **Grilles Responsives**
```html
<!-- 4 colonnes sur desktop, 2 sur tablet, 1 sur mobile -->
<div class="grid-3cm grid-4">
  <!-- Contenu -->
</div>
```

---

## 🎯 **Usage par Contexte**

### **Dashboard**
- **Arrière-plan** : `#F9FAFB` (neutral-50)
- **Cartes** : Blanc avec `shadow-3cm`
- **Boutons principaux** : Dégradé bleu 3CM
- **Statistiques** : Couleurs selon le type de données

### **Formulaires**
- **Champs** : Bordure `#D1D5DB`, focus `#2563EB`
- **Labels** : `#374151`
- **Erreurs** : `#DC2626`
- **Succès** : `#10B981`

### **Navigation**
- **Sidebar** : Blanc avec `shadow-3cm`
- **Items actifs** : Dégradé bleu 3CM
- **Items hover** : `#EFF6FF`

### **Tableaux**
- **En-têtes** : Dégradé clair 3CM
- **Lignes alternées** : `#F9FAFB`
- **Hover** : `#EFF6FF`

---

## 🔧 **Implémentation Technique**

### **Tailwind CSS**
Les couleurs sont configurées dans `tailwind.config.js` :
```javascript
colors: {
  primary: { /* palette bleu 3CM */ },
  secondary: { /* palette rouge 3CM */ },
  // ...
}
```

### **SCSS Variables**
Disponibles dans `_variables-3cm.scss` :
```scss
@import 'styles/variables-3cm';
```

### **Angular Material**
Thème personnalisé dans `_material-theme-3cm.scss` :
```scss
@import 'styles/material-theme-3cm';
```

### **Service Theme**
Service Angular pour gérer les couleurs :
```typescript
import { ThemeService } from './core/services/theme.service';
```

---

## 📋 **Checklist d'Application**

### **✅ Couleurs**
- [ ] Palette primaire (bleu 3CM) utilisée pour les actions principales
- [ ] Palette secondaire (rouge 3CM) pour les accents et alertes
- [ ] Couleurs neutres pour les textes et arrière-plans
- [ ] Couleurs fonctionnelles pour les statuts

### **✅ Typographie**
- [ ] Police Inter/Roboto utilisée
- [ ] Hiérarchie des titres respectée
- [ ] Couleurs de texte appropriées

### **✅ Composants**
- [ ] Boutons avec dégradés 3CM
- [ ] Cartes avec ombres personnalisées
- [ ] Badges et statuts colorés
- [ ] Formulaires avec focus bleu 3CM

### **✅ Layout**
- [ ] Grilles responsives
- [ ] Espacements cohérents
- [ ] Ombres et effets appliqués

---

## 🎨 **Ressources**

### **Fichiers de Style**
- `src/styles/_variables-3cm.scss` - Variables SCSS
- `src/styles/_material-theme-3cm.scss` - Thème Material
- `src/styles/_utilities-3cm.scss` - Classes utilitaires
- `src/styles.scss` - Styles principaux

### **Services**
- `src/app/core/services/theme.service.ts` - Service de thème

### **Composant de Démonstration**
- `src/app/features/system/theme-demo/` - Démonstration de la charte

---

**© 2024 3CM - Créons l'avenir ensemble**  
*Charte graphique pour le système ABS (Antigravity Badge System)*