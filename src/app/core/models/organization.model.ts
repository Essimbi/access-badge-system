import { User } from "./user.model";

export interface Organization {
    id: string | number;
    name: string;
    description: string;
    email: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    adminUser?: User;
    adminUserId?: string | number;
    createdAt: Date;
    updatedAt: Date;
    eventCount?: number;
    is_active: boolean;
}

export interface OrganizationCreateRequest {
    name: string;
    description: string;
    email: string;
    phone?: string;
    address?: string;
    adminUserId?: string | number;
}

