const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface Driver {
    id: string;
    name: string;
    number: number;
    team: string;
    isActive: boolean;
    fullname: string;
}

export async function getActiveDrivers(season?: number) {
    try {
        const url = season ? `${API_BASE_URL}/api/drivers?season=${season}` : `${API_BASE_URL}/api/drivers`;
        const response = await fetch(url, {
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch drivers: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
}
