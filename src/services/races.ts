const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface Race {
    id: string;
    name: string;
    round: number;
    circuit: string;
    date: string;
    season: number;
    status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
    resultsImported: boolean;
    hasSprint: boolean;
    userPoints?: number;
}

export async function getRacesWithUserPoints(season?: number) {
    try {
        const url = season ? `${API_BASE_URL}/api/races/user-points?season=${season}` : `${API_BASE_URL}/api/races/user-points`;
        const response = await fetch(url, {
            cache: 'no-store', // Ensure fresh data
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required');
            }
            throw new Error(`Failed to fetch races: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching races with user points:', error);
        throw error; // Re-throw to let the component handle it
    }
}

export async function getRaceById(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/races/${id}`, {
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch race: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching race:', error);
        throw error;
    }
}
