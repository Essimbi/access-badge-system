export interface User {
    id: string | number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'super_admin' | 'admin' | 'controller' | 'participant';
    organization_id?: number;
    organization?: any;
    phone?: string;
    preferences?: any;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfileResponse {
    user: User;
    organization?: any;
}
