const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getStandings() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/standings`, {
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch standings: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching standings:', error);
        throw error; // Re-throw to let the component handle it
    }
}
