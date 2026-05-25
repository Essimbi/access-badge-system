import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface PreviewUser {
    firstName: string;
    lastName: string;
    role: string;
    organization: string;
    event_title: string;
    category: string;
    photo: string;
    qr_code: string;
}

@Injectable({
    providedIn: 'root'
})
export class BadgePreviewService {
    
    private defaultPreviewUser: PreviewUser = {
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'Participant',
        organization: '3CM Event Solutions',
        event_title: 'Conférence Tech 2026',
        category: 'VIP',
        photo: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff&size=128',
        qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example'
    };

    constructor(private sanitizer: DomSanitizer) {}

    /**
     * Génère un preview HTML sécurisé pour un template de badge
     */
    generatePreview(template: any, customUser?: Partial<PreviewUser>): SafeHtml {
        if (!template.htmlContent) return '';
        
        const user = { ...this.defaultPreviewUser, ...customUser };
        
        // Interpoler toutes les variables
        let interpolated = this.interpolateVariables(template.htmlContent, user);
        
        // Nettoyer le HTML pour l'affichage direct (sans iframe)
        const cleanedHtml = this.cleanHtmlForDirectDisplay(interpolated);
        
        return this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
    }

    /**
     * Génère un preview HTML pour iframe (badge designer)
     */
    generateIframePreview(htmlContent: string, customUser?: Partial<PreviewUser>): string {
        if (!htmlContent) return '';
        
        const user = { ...this.defaultPreviewUser, ...customUser };
        
        // Interpoler toutes les variables
        let interpolated = this.interpolateVariables(htmlContent, user);
        
        // Vérifier si le contenu contient déjà des tags HTML complets
        const hasCompleteHtml = this.hasCompleteHtmlStructure(interpolated);
        
        if (hasCompleteHtml) {
            // Extraire et reconstruire le HTML en préservant les styles
            return this.reconstructHtmlForIframe(interpolated);
        } else {
            // Sinon, l'envelopper dans une structure HTML complète
            return this.wrapInCompleteHtml(interpolated);
        }
    }

    /**
     * Interpoler toutes les variables dans le HTML
     */
    private interpolateVariables(html: string, user: PreviewUser): string {
        return html
            .replace(/{{firstName}}/g, user.firstName)
            .replace(/{{lastName}}/g, user.lastName)
            .replace(/{{participant_name}}/g, `${user.firstName} ${user.lastName}`)
            .replace(/{{role}}/g, user.role)
            .replace(/{{organization}}/g, user.organization)
            .replace(/{{event_title}}/g, user.event_title)
            .replace(/{{category}}/g, user.category)
            .replace(/{{photo}}/g, user.photo)
            .replace(/{{{qr_code}}}/g, user.qr_code)
            .replace(/{{qr_code}}/g, user.qr_code);
    }

    /**
     * Vérifier si le HTML contient une structure complète
     */
    private hasCompleteHtmlStructure(html: string): boolean {
        return /<html[^>]*>/i.test(html) || /<head[^>]*>/i.test(html) || /<body[^>]*>/i.test(html);
    }

    /**
     * Nettoyer le HTML pour affichage direct (sans iframe)
     */
    private cleanHtmlForDirectDisplay(html: string): string {
        if (!this.hasCompleteHtmlStructure(html)) {
            return html; // Retourner le HTML tel quel s'il n'a pas de balises complètes
        }
        
        // Extraire le contenu du body
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            return bodyMatch[1];
        }
        
        // Si pas de body, nettoyer les balises structurelles
        return html
            .replace(/<!DOCTYPE[^>]*>/i, '')
            .replace(/<html[^>]*>/i, '')
            .replace(/<\/html>/i, '')
            .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
            .replace(/<body[^>]*>/i, '')
            .replace(/<\/body>/i, '')
            .trim();
    }

    /**
     * Reconstruire le HTML pour iframe en préservant les styles
     */
    private reconstructHtmlForIframe(html: string): string {
        let extractedStyles = '';
        let bodyContent = '';
        
        // Extraire les styles du head si présent
        const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) {
            const headContent = headMatch[1];
            
            // Extraire toutes les balises <style>
            const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
            if (styleMatches) {
                extractedStyles = styleMatches.join('\n');
            }
            
            // Extraire les liens CSS
            const linkMatches = headContent.match(/<link[^>]*rel=["\']stylesheet["\'][^>]*>/gi);
            if (linkMatches) {
                extractedStyles += '\n' + linkMatches.join('\n');
            }
        }
        
        // Extraire le contenu du body
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            bodyContent = bodyMatch[1];
        } else {
            // Nettoyer le HTML de toutes les balises structurelles
            bodyContent = html
                .replace(/<!DOCTYPE[^>]*>/i, '')
                .replace(/<html[^>]*>/i, '')
                .replace(/<\/html>/i, '')
                .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
                .replace(/<body[^>]*>/i, '')
                .replace(/<\/body>/i, '')
                .trim();
        }
        
        return this.wrapInCompleteHtml(bodyContent, extractedStyles);
    }

    /**
     * Envelopper le contenu dans une structure HTML complète
     */
    private wrapInCompleteHtml(content: string, additionalStyles: string = ''): string {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        /* Styles de base pour l'iframe */
                        body, html { 
                            margin: 0; 
                            padding: 0; 
                            width: 100%; 
                            height: 100%; 
                            overflow: hidden; 
                            font-family: Arial, sans-serif;
                        }
                        * { 
                            box-sizing: border-box; 
                        }
                    </style>
                    ${additionalStyles}
                </head>
                <body>${content}</body>
            </html>
        `;
    }

    /**
     * Préprocesser le HTML pour corriger les problèmes courants
     */
    preprocessHtml(html: string): string {
        if (!html) return html;
        
        let processed = html.trim();
        
        // Détecter si c'est un document HTML complet mal formé
        if (this.hasCompleteHtmlStructure(processed)) {
            console.log('🔧 Détection d\'un document HTML complet, nettoyage en cours...');
            
            // Extraire les styles du head
            let styles = '';
            const headMatch = processed.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
            if (headMatch) {
                const headContent = headMatch[1];
                
                // Extraire les styles
                const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
                if (styleMatches) {
                    styles = styleMatches.map(style => {
                        const match = style.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
                        return match ? match[1] : '';
                    }).join('\n');
                }
            }
            
            // Extraire le contenu du body
            let bodyContent = '';
            const bodyMatch = processed.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                bodyContent = bodyMatch[1];
            } else {
                // Si pas de body, nettoyer tout le HTML
                bodyContent = processed
                    .replace(/<!DOCTYPE[^>]*>/i, '')
                    .replace(/<html[^>]*>/i, '')
                    .replace(/<\/html>/i, '')
                    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
                    .replace(/<body[^>]*>/i, '')
                    .replace(/<\/body>/i, '')
                    .trim();
            }
            
            // Reconstruire un HTML propre pour l'éditeur
            if (styles) {
                processed = `<style>\n${styles}\n</style>\n\n${bodyContent}`;
            } else {
                processed = bodyContent;
            }
            
            console.log('✅ HTML nettoyé avec succès');
        }
        
        return processed;
    }
}