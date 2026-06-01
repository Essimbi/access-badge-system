/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // Palette 3CM - Couleurs principales
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
                // Couleurs d'accent 3CM
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
                // Couleurs fonctionnelles
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
                danger: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                    900: '#7F1D1D',
                },
                info: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },
                // Couleurs neutres 3CM
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
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                '3cm': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
                '3cm-lg': '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
                '3cm-xl': '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
            },
            backgroundImage: {
                'gradient-3cm': 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                'gradient-3cm-accent': 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
                'gradient-3cm-light': 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
            }
        },
    },
    plugins: [],
}
