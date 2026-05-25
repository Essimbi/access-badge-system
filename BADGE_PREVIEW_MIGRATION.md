# Migration du Système de Preview des Badges

## 🎯 Objectif

Harmoniser les 3 systèmes de preview des badges pour assurer une cohérence parfaite entre :
1. **Badge Designer** (création/édition)
2. **Badge List** (mini-preview dans le tableau)
3. **Preview Dialog** (popup depuis la liste)

## 🔧 Changements Apportés

### **Nouveau Service Unifié**

**Fichier** : `src/app/core/services/badge-preview.service.ts`

Ce service centralise toute la logique de preview et offre :
- **Gestion uniforme** des documents HTML complets
- **Interpolation complète** de toutes les variables
- **Préservation des styles** CSS
- **Nettoyage automatique** du HTML mal formé

### **Variables Supportées**

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{firstName}}` | Prénom du participant | Jean |
| `{{lastName}}` | Nom du participant | Dupont |
| `{{participant_name}}` | Nom complet | Jean Dupont |
| `{{role}}` | Rôle du participant | Participant |
| `{{organization}}` | Organisation | 3CM Event Solutions |
| `{{event_title}}` | Titre de l'événement | Conférence Tech 2026 |
| `{{category}}` | Catégorie du badge | VIP |
| `{{photo}}` | Photo du participant | `<img src="...">` |
| `{{qr_code}}` | Code QR | `<div>...</div>` |
| `{{{qr_code}}}` | Code QR (non échappé) | `<div>...</div>` |

### **Méthodes du Service**

#### `generatePreview(template, customUser?): SafeHtml`
- **Usage** : Badge List, Preview Dialog
- **Retour** : HTML sécurisé pour affichage direct
- **Fonctionnalités** : Extraction du body, préservation des styles

#### `generateIframePreview(htmlContent, customUser?): string`
- **Usage** : Badge Designer
- **Retour** : Document HTML complet pour iframe
- **Fonctionnalités** : Reconstruction complète avec DOCTYPE

#### `preprocessHtml(html): string`
- **Usage** : Nettoyage automatique
- **Retour** : HTML nettoyé
- **Fonctionnalités** : Correction des documents HTML mal formés

## 📋 Composants Modifiés

### **1. BadgeDesignerComponent**

**Avant** :
```typescript
// Logique de preview complexe et dupliquée
private updateHtmlPreview() {
  // 50+ lignes de code
}
```

**Après** :
```typescript
// Utilisation du service unifié
private updateHtmlPreview() {
  const finalHtml = this.badgePreviewService.generateIframePreview(
    this.badgeSettings.htmlContent,
    this.previewUser
  );
  // Logique simplifiée
}
```

### **2. BadgeListComponent**

**Avant** :
```typescript
// Extraction manuelle du body
getSafePreview(template) {
  // Logique dupliquée et incomplète
  return this.extractBodyContent(html);
}
```

**Après** :
```typescript
// Service unifié
getSafePreview(template) {
  return this.badgePreviewService.generatePreview(template);
}
```

### **3. BadgePreviewDialogComponent**

**Avant** :
```typescript
// Variables limitées et logique dupliquée
ngOnInit() {
  let interpolated = template.htmlContent
    .replace(/{{firstName}}/g, 'Jean')
    .replace(/{{lastName}}/g, 'Dupont')
    // Variables manquantes...
}
```

**Après** :
```typescript
// Service unifié avec toutes les variables
ngOnInit() {
  this.safeHtml = this.badgePreviewService.generatePreview(
    this.data.template,
    { firstName: 'Jean', lastName: 'Dupont' }
  );
}
```

## 🎨 Nouvelles Fonctionnalités

### **Bouton de Nettoyage HTML**

Dans le Badge Designer, un nouveau bouton 🧹 permet de :
- **Détecter** les documents HTML complets
- **Extraire** le contenu du body
- **Préserver** les styles du head
- **Nettoyer** les balises structurelles

### **Gestion des Documents HTML Complets**

Le système gère maintenant parfaitement :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <style>
        body { background: linear-gradient(...); }
    </style>
</head>
<body>
    <div class="badge">{{participant_name}}</div>
</body>
</html>
```

## 🔄 Migration Automatique

### **Chargement des Templates**

Lors du chargement d'un template existant :
1. **Détection automatique** des problèmes HTML
2. **Nettoyage transparent** si nécessaire
3. **Préservation** des styles et du contenu
4. **Notification** à l'utilisateur si correction

### **Compatibilité Ascendante**

- ✅ **Templates simples** : Fonctionnent sans modification
- ✅ **Templates avec styles** : Styles préservés
- ✅ **Documents complets** : Nettoyage automatique
- ✅ **Variables existantes** : Toutes supportées

## 🧪 Tests de Validation

### **Templates Testés**

1. **Template Simple** : `<div>{{participant_name}}</div>`
2. **Template avec Styles** : `<style>...</style><div>...</div>`
3. **Document HTML Complet** : `<!DOCTYPE html>...`
4. **Template Mal Formé** : Balises mélangées

### **Scénarios de Test**

- ✅ **Badge Designer** : Preview en temps réel
- ✅ **Badge List** : Mini-preview dans le tableau
- ✅ **Preview Dialog** : Popup de prévisualisation
- ✅ **Variables** : Interpolation complète
- ✅ **Styles** : Préservation CSS
- ✅ **Nettoyage** : Correction automatique

## 📊 Avantages

### **Pour les Développeurs**
- **Code unifié** : Une seule logique de preview
- **Maintenance simplifiée** : Modifications centralisées
- **Tests facilités** : Service isolé et testable

### **Pour les Utilisateurs**
- **Cohérence visuelle** : Même rendu partout
- **Fonctionnalités avancées** : Toutes les variables disponibles
- **Correction automatique** : HTML nettoyé transparemment

### **Pour le Système**
- **Performance** : Logique optimisée
- **Sécurité** : Sanitization centralisée
- **Évolutivité** : Ajout facile de nouvelles fonctionnalités

## 🚀 Utilisation

### **Créer un Preview**

```typescript
// Dans un composant
constructor(private badgePreviewService: BadgePreviewService) {}

// Générer un preview
const preview = this.badgePreviewService.generatePreview(template, {
  firstName: 'Marie',
  lastName: 'Martin',
  category: 'Exposant'
});
```

### **Nettoyer du HTML**

```typescript
// Nettoyer un template
const cleanHtml = this.badgePreviewService.preprocessHtml(dirtyHtml);
```

### **Preview pour Iframe**

```typescript
// Pour le badge designer
const iframeHtml = this.badgePreviewService.generateIframePreview(
  htmlContent,
  previewUser
);
```

## 🎯 Résultat Final

**Avant** : 3 systèmes différents avec logiques dupliquées et incohérences
**Après** : 1 service unifié avec preview cohérent partout

Les utilisateurs bénéficient maintenant d'une expérience parfaitement cohérente, que ce soit dans le designer, la liste ou le popup de prévisualisation ! ✨