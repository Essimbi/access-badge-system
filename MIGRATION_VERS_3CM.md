# 🔄 Guide de Migration vers la Charte Graphique 3CM

## 📋 **Vue d'ensemble**

Ce guide vous aide à migrer les composants existants vers la nouvelle charte graphique 3CM. Suivez ces étapes pour assurer une transition cohérente.

---

## 🎯 **1. Remplacement des Couleurs**

### **Anciennes Classes → Nouvelles Classes 3CM**

```html
<!-- AVANT (couleurs génériques) -->
<div class="text-blue-600">Texte bleu</div>
<div class="bg-blue-500">Arrière-plan bleu</div>
<div class="border-blue-500">Bordure bleue</div>

<!-- APRÈS (couleurs 3CM) -->
<div class="text-primary-600">Texte bleu 3CM</div>
<div class="bg-primary-500">Arrière-plan bleu 3CM</div>
<div class="border-primary-500">Bordure bleue 3CM</div>
```

### **Tableau de Correspondance**

| Ancienne Couleur | Nouvelle Couleur 3CM | Usage |
|------------------|---------------------|-------|
| `blue-500` | `primary-500` | Actions principales |
| `blue-600` | `primary-600` | Texte principal |
| `red-500` | `secondary-600` | Alertes, erreurs |
| `orange-500` | `warning-500` | Avertissements |
| `green-500` | `success-500` | Succès, validation |
| `gray-500` | `neutral-500` | Texte secondaire |
| `gray-800` | `neutral-800` | Texte principal |

---

## 🧩 **2. Migration des Composants**

### **Boutons**

```html
<!-- AVANT -->
<button mat-raised-button color="primary">Action</button>
<button class="bg-blue-500 text-white px-4 py-2 rounded">Action</button>

<!-- APRÈS -->
<button class="btn-3cm-primary">Action</button>
<button mat-raised-button color="primary">Action</button> <!-- Déjà compatible -->
```

### **Cartes**

```html
<!-- AVANT -->
<mat-card class="shadow-lg">
    <mat-card-content>
        <h3 class="text-xl font-bold text-gray-800">Titre</h3>
        <p class="text-gray-600">Contenu</p>
    </mat-card-content>
</mat-card>

<!-- APRÈS -->
<div class="card-3cm">
    <h3 class="heading-3cm text-xl text-3cm-dark">Titre</h3>
    <p class="text-3cm-muted">Contenu</p>
</div>
```

### **Statistiques**

```html
<!-- AVANT -->
<mat-card class="stat-card bg-gradient-to-br from-blue-50 to-blue-100">
    <mat-card-content class="p-4">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-semibold text-blue-600">Événements</p>
                <h2 class="text-3xl font-black text-blue-900">{{ count }}</h2>
            </div>
            <mat-icon class="text-5xl text-blue-300">event</mat-icon>
        </div>
    </mat-card-content>
</mat-card>

<!-- APRÈS -->
<div class="card-3cm-stat">
    <mat-icon class="stat-icon text-primary-500">event</mat-icon>
    <div class="stat-number text-primary-600">{{ count }}</div>
    <div class="stat-label">Événements</div>
</div>
```

---

## 🎨 **3. Migration des Styles SCSS**

### **Variables**

```scss
// AVANT
.mon-composant {
    background: #2196f3;
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// APRÈS
@import 'styles/variables-3cm';

.mon-composant {
    background: $tcm-primary-500;
    color: white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-3cm;
}
```

### **Dégradés**

```scss
// AVANT
.gradient-bg {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

// APRÈS
.gradient-bg {
    background: $gradient-3cm-primary;
    // ou
    @extend .bg-3cm-gradient;
}
```

---

## 📐 **4. Migration du Layout**

### **Containers**

```html
<!-- AVANT -->
<div class="max-w-6xl mx-auto px-6">
    <!-- Contenu -->
</div>

<!-- APRÈS -->
<div class="container-3cm">
    <!-- Contenu -->
</div>
```

### **Grilles**

```html
<!-- AVANT -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Éléments -->
</div>

<!-- APRÈS -->
<div class="grid-3cm grid-4">
    <!-- Éléments -->
</div>
```

---

## ✨ **5. Migration des Animations**

### **Transitions**

```scss
// AVANT
.element {
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
    }
}

// APRÈS
.element {
    transition: $transition-normal;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-3cm-lg;
    }
}
```

### **Classes d'Animation**

```html
<!-- AVANT -->
<div class="fade-in">Contenu</div>

<!-- APRÈS -->
<div class="animate-3cm-fade-in">Contenu</div>
```

---

## 🎯 **6. Migration de la Typographie**

### **Titres**

```html
<!-- AVANT -->
<h1 class="text-4xl font-extrabold text-slate-900">Titre</h1>
<h2 class="text-2xl font-bold text-blue-600">Sous-titre</h2>

<!-- APRÈS -->
<h1 class="heading-3cm text-4xl text-3cm-dark">Titre</h1>
<h2 class="heading-3cm text-2xl text-primary-600">Sous-titre</h2>
```

### **Texte avec Dégradé**

```html
<!-- AVANT -->
<h1 class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
    Titre Gradient
</h1>

<!-- APRÈS -->
<h1 class="heading-3cm heading-gradient text-4xl">
    Titre Gradient 3CM
</h1>
```

---

## 🏷️ **7. Migration des Badges et Statuts**

### **Badges**

```html
<!-- AVANT -->
<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
    Badge
</span>

<!-- APRÈS -->
<span class="badge-3cm badge-primary">Badge</span>
```

### **Statuts**

```html
<!-- AVANT -->
<mat-chip class="bg-green-100 text-green-800">Approuvé</mat-chip>
<mat-chip class="bg-orange-100 text-orange-800">En attente</mat-chip>
<mat-chip class="bg-red-100 text-red-800">Rejeté</mat-chip>

<!-- APRÈS -->
<span class="status-approved">Approuvé</span>
<span class="status-pending">En attente</span>
<span class="status-rejected">Rejeté</span>
```

---

## 🔧 **8. Migration des Services**

### **Notifications**

```typescript
// AVANT
this.notificationService.success('Message');

// APRÈS (déjà compatible, mais avec nouvelles couleurs)
this.notificationService.success('Message'); // Utilise automatiquement les couleurs 3CM
```

### **Thème**

```typescript
// NOUVEAU - Service de thème 3CM
import { ThemeService } from './core/services/theme.service';

constructor(private themeService: ThemeService) {}

// Obtenir des couleurs
const primaryColor = this.themeService.getPrimaryColor();
const statusColor = this.themeService.getStatusColor('approved');
```

---

## 📱 **9. Migration Responsive**

### **Classes Utilitaires**

```html
<!-- AVANT -->
<div class="hidden md:block">Desktop seulement</div>
<div class="block md:hidden">Mobile seulement</div>

<!-- APRÈS -->
<div class="hide-mobile">Desktop seulement</div>
<div class="hide-desktop">Mobile seulement</div>
```

---

## 🎭 **10. Migration Angular Material**

### **Thème Automatique**

Le nouveau thème 3CM est automatiquement appliqué. Aucune migration nécessaire pour :

- `mat-button`
- `mat-card`
- `mat-form-field`
- `mat-table`
- `mat-tab-group`
- etc.

### **Personnalisations Spécifiques**

```scss
// AVANT
.mat-raised-button.mat-primary {
    background: #2196f3;
}

// APRÈS (automatique avec le nouveau thème)
// Ou pour des personnalisations spécifiques :
.mat-raised-button.mat-primary {
    background: $gradient-3cm-primary;
}
```

---

## 📋 **11. Checklist de Migration**

### **Par Composant**

- [ ] **Couleurs** : Remplacer par la palette 3CM
- [ ] **Classes CSS** : Utiliser les nouvelles classes utilitaires
- [ ] **Variables SCSS** : Importer et utiliser `variables-3cm`
- [ ] **Animations** : Appliquer les nouvelles classes d'animation
- [ ] **Typographie** : Utiliser `heading-3cm` et `text-3cm-*`
- [ ] **Layout** : Migrer vers `container-3cm` et `grid-3cm`
- [ ] **Responsive** : Tester sur tous les breakpoints

### **Tests de Validation**

- [ ] **Contraste** : Vérifier l'accessibilité des couleurs
- [ ] **Cohérence** : Tous les composants utilisent la même palette
- [ ] **Performance** : Pas de régression de performance
- [ ] **Responsive** : Fonctionne sur mobile, tablet, desktop
- [ ] **Thème sombre** : Compatible avec le mode sombre (si activé)

---

## 🚀 **12. Script de Migration Automatique**

### **Rechercher et Remplacer (Regex)**

```bash
# Remplacer les classes de couleur bleue
find . -name "*.html" -exec sed -i 's/text-blue-600/text-primary-600/g' {} \;
find . -name "*.html" -exec sed -i 's/bg-blue-500/bg-primary-500/g' {} \;
find . -name "*.html" -exec sed -i 's/border-blue-500/border-primary-500/g' {} \;

# Remplacer les classes de couleur rouge
find . -name "*.html" -exec sed -i 's/text-red-600/text-secondary-600/g' {} \;
find . -name "*.html" -exec sed -i 's/bg-red-500/bg-secondary-600/g' {} \;

# Remplacer les classes de couleur grise
find . -name "*.html" -exec sed -i 's/text-gray-600/text-3cm-muted/g' {} \;
find . -name "*.html" -exec sed -i 's/text-gray-800/text-3cm-dark/g' {} \;
```

### **Script Node.js pour Migration Avancée**

```javascript
// migration-3cm.js
const fs = require('fs');
const path = require('path');

const colorMappings = {
    'text-blue-600': 'text-primary-600',
    'bg-blue-500': 'bg-primary-500',
    'text-red-600': 'text-secondary-600',
    'bg-red-500': 'bg-secondary-600',
    'text-gray-600': 'text-3cm-muted',
    'text-gray-800': 'text-3cm-dark'
};

function migrateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    Object.entries(colorMappings).forEach(([old, new_]) => {
        content = content.replace(new RegExp(old, 'g'), new_);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Migrated: ${filePath}`);
}

// Utilisation
// node migration-3cm.js
```

---

## 📚 **13. Ressources de Migration**

### **Avant/Après - Exemples Complets**

#### **Dashboard Card - Avant**
```html
<mat-card class="stat-card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
    <mat-card-content class="p-4">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-semibold text-blue-600 uppercase">Événements</p>
                <h2 class="text-3xl font-black text-blue-900">{{ count }}</h2>
            </div>
            <mat-icon class="text-5xl text-blue-300">event</mat-icon>
        </div>
    </mat-card-content>
</mat-card>
```

#### **Dashboard Card - Après**
```html
<div class="card-3cm-stat animate-3cm-fade-in">
    <mat-icon class="stat-icon text-primary-500">event</mat-icon>
    <div class="stat-number text-primary-600">{{ count }}</div>
    <div class="stat-label">Événements</div>
</div>
```

### **Outils de Validation**

```typescript
// Composant de validation des couleurs
@Component({
    template: `
        <div class="p-4">
            <h2>Validation des Couleurs 3CM</h2>
            <div class="grid-3cm grid-4">
                <div class="card-3cm text-center">
                    <div class="w-16 h-16 bg-primary-500 mx-auto mb-2"></div>
                    <p>Primary 500</p>
                </div>
                <!-- Autres couleurs... -->
            </div>
        </div>
    `
})
export class ColorValidationComponent {}
```

---

## ⚠️ **14. Points d'Attention**

### **Erreurs Communes**

1. **Mélange d'anciennes et nouvelles couleurs**
   ```html
   <!-- ❌ ÉVITER -->
   <div class="bg-primary-500 text-blue-600">Incohérent</div>
   
   <!-- ✅ CORRECT -->
   <div class="bg-primary-500 text-white">Cohérent</div>
   ```

2. **Oubli des imports SCSS**
   ```scss
   // ❌ ÉVITER
   .component { background: #3B82F6; }
   
   // ✅ CORRECT
   @import 'styles/variables-3cm';
   .component { background: $tcm-primary-500; }
   ```

3. **Non-respect du responsive**
   ```html
   <!-- ❌ ÉVITER -->
   <div class="grid grid-cols-4">Non responsive</div>
   
   <!-- ✅ CORRECT -->
   <div class="grid-3cm grid-4">Responsive automatique</div>
   ```

### **Tests de Régression**

- Vérifier que tous les composants s'affichent correctement
- Tester la navigation et les interactions
- Valider l'accessibilité (contrastes, navigation clavier)
- Vérifier la cohérence visuelle sur toutes les pages

---

## 🎉 **15. Validation Finale**

### **Critères de Réussite**

- [ ] **Cohérence** : Toutes les couleurs respectent la palette 3CM
- [ ] **Performance** : Aucune régression de performance
- [ ] **Accessibilité** : Contrastes conformes WCAG 2.1
- [ ] **Responsive** : Fonctionne sur tous les appareils
- [ ] **Maintenance** : Code plus maintenable avec les variables centralisées

### **Démo Finale**

Utilisez le composant `ThemeDemoComponent` pour valider que tous les éléments sont correctement migrés :

```typescript
// Ouvrir la démo dans le header
this.openThemeDemo();
```

---

**🎨 Votre migration vers la charte graphique 3CM est maintenant terminée !**

*L'application ABS reflète désormais parfaitement l'identité visuelle de 3CM - Créons l'avenir ensemble.*