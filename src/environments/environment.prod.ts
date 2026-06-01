export const environment = {
    production: true,
    apiUrl: 'https://api.abs.3cm.com/api', // URL de production à adapter
    
    // Branding 3CM
    branding: {
        companyName: '3CM',
        companyFullName: '3CM - Créons l\'avenir ensemble',
        appName: 'ABS - Antigravity Badge System',
        appVersion: '1.0.0',
        logoUrl: '/assets/images/3cm-logo.png',
        faviconUrl: '/assets/images/3cm-favicon.ico',
        
        // Couleurs principales
        colors: {
            primary: '#2563EB',      // Bleu principal 3CM
            secondary: '#DC2626',    // Rouge accent 3CM
            success: '#10B981',      // Vert succès
            warning: '#F59E0B',      // Orange avertissement
            neutral: '#6B7280'       // Gris métallique 3CM
        },
        
        // Métadonnées
        meta: {
            description: 'Système de gestion de badges d\'événements par 3CM',
            keywords: 'badges, événements, 3CM, gestion, accès',
            author: '3CM - Créons l\'avenir ensemble'
        }
    }
};