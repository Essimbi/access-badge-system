import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
    {
        id: 1,
        email: 'superadmin@test.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        email: 'admin@test.com',
        firstName: 'Alice',
        lastName: 'Admin',
        role: 'admin',
        organization_id: 1,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        email: 'control@test.com',
        firstName: 'Benoit',
        lastName: 'Controleur',
        role: 'controller',
        organization_id: 1,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        email: 'user@test.com',
        firstName: 'Jean',
        lastName: 'Particulier',
        role: 'participant',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const MOCK_ORGANIZATIONS: Organization[] = [
    {
        id: 1,
        name: '3CM Event Solutions',
        description: 'Expert en gestion d\'accès et billetterie pour événements de grande envergure.',
        email: 'contact@3cm.com',
        phone: '+225 0102030405',
        address: 'Abidjan, Côte d\'Ivoire',
        logoUrl: 'https://via.placeholder.com/150',
        adminUserId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventCount: 5,
        is_active: true
    },
    {
        id: 2,
        name: 'Global Tech Expo',
        description: 'Organisation de salons technologiques Internationaux.',
        email: 'info@globex.com',
        phone: '+225 0506070809',
        address: 'Bassam, Côte d\'Ivoire',
        adminUserId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventCount: 2,
        is_active: true
    }
];

export const MOCK_STATS = {
    dashboard: {
        totalOrganizations: 12,
        totalEvents: 45,
        totalParticipants: 1200,
        activeBadges: 850
    },
    organization: {
        id: 1,
        totalEvents: 5,
        activeEnrollments: 124,
        totalParticipants: 450,
        checkinsLast24h: 35
    }
};

export const MOCK_EVENTS = [
    {
        id: 1,
        title: 'Conférence Innovation 2026',
        description: 'Un événement musical unique au cœur de la ville.',
        date: new Date('2026-03-15T09:00:00'),
        endDate: new Date('2026-03-15T18:00:00'),
        location: 'Palais de la Culture',
        status: 'upcoming',
        type: 'Conference',
        organization_id: 1,
        participantLimit: 500
    },
    {
        id: 2,
        title: 'Workshop Angular 18',
        description: 'Rencontrez les professionnels de demain.',
        date: new Date('2026-02-20T10:00:00'),
        endDate: new Date('2026-02-20T16:00:00'),
        location: 'Hôtel Ivoire',
        status: 'ongoing',
        type: 'Workshop',
        organization_id: 1,
        participantLimit: 50
    },
    {
        id: 3,
        title: 'Sommet Tech Africa',
        description: 'Le rendez-vous des leaders technologiques.',
        date: new Date('2026-01-10T09:00:00'),
        endDate: new Date('2026-01-12T17:00:00'),
        location: 'Abidjan, CIV',
        status: 'completed',
        type: 'Summit',
        organization_id: 2,
        participantLimit: 1000
    }
];

export const MOCK_ENROLLMENTS = [
    { id: 1, userId: 2, userName: 'John Doe', eventId: 1, eventTitle: 'Conférence Innovation 2026', registeredAt: new Date('2026-01-15'), status: 'confirmed' },
    { id: 2, userId: 3, userName: 'Alice Smith', eventId: 1, eventTitle: 'Conférence Innovation 2026', registeredAt: new Date('2026-01-16'), status: 'pending' },
    { id: 3, userId: 2, userName: 'John Doe', eventId: 2, eventTitle: 'Workshop Angular 18', registeredAt: new Date('2026-01-10'), status: 'confirmed' }
];

export const MOCK_GATES = [
    { id: 1, name: 'GATE-001', location: 'Entrée Principale', type: 'Scanner Fixe', organizationName: '3CM Event Solutions', is_active: true, organizationId: 1 },
    { id: 2, name: 'GATE-002', location: 'Zone VIP', type: 'Scanner Fixe', organizationName: '3CM Event Solutions', is_active: true, organizationId: 1 },
    { id: 3, name: 'MOBILE-045', location: 'Parking A', type: 'Mobile App', organizationName: 'Global Tech Expo', is_active: false, organizationId: 2 }
];

export const MOCK_BADGE_CATEGORIES = [
    { id: 1, name: 'VIP', color: '#ffd700', description: 'Accès toutes zones', organizationId: 1 },
    { id: 2, name: 'Exposant', color: '#2ecc71', description: 'Accès zone stand', organizationId: 1 },
    { id: 3, name: 'Visiteur', color: '#3498db', description: 'Accès zone publique', organizationId: 1 },
    { id: 4, name: 'Staff', color: '#ef4444', description: 'Accès service', organizationId: 2 }
];

export const MOCK_BADGE_TEMPLATES = [
    {
        id: 1,
        templateName: 'Template VIP Standard',
        categoryId: 1,
        width: 60,
        height: 85,
        borderRadius: 8,
        primaryColor: '#ffd700',
        htmlContent: '',
        designMode: 'visual',
        organizationId: 1
    },
    {
        id: 2,
        templateName: 'Pass Exposant HTML',
        categoryId: 2,
        width: 60,
        height: 85,
        borderRadius: 4,
        primaryColor: '#2ecc71',
        htmlContent: '<div style="background: #2ecc71; color: white; padding: 20px;"><h1>{{firstName}}</h1><p>Exposant</p></div>',
        designMode: 'html',
        organizationId: 1
    }
];
