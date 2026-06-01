#!/bin/bash

# Script de démarrage ABS avec thème 3CM
echo "🚀 Démarrage d'ABS avec la charte graphique 3CM..."
echo "📱 Application: Automated Badge System"
echo "🎨 Thème: 3CM Corporate Identity"
echo "🌐 URL: http://localhost:4200"
echo ""

# Nettoyage du cache Angular
echo "🧹 Nettoyage du cache..."
rm -rf .angular/cache

# Démarrage du serveur de développement
echo "🔄 Démarrage du serveur..."
ng serve --host 0.0.0.0 --port 4200 --open