export interface Event {
    id: number;
    title: string;
    description: string;
    date: Date;
    endDate?: Date;
    location: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    type: string;
    organization_id: number;
    participantLimit?: number;
    imageUrl?: string;
}
