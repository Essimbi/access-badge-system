import { User } from "./user.model";

export interface Organization {
    id: number;
    name: string;
    description: string;
    email: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    primaryColor?: string;
    adminUser?: User;
    adminUserId?: number;
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
    adminUserId?: number;
}

