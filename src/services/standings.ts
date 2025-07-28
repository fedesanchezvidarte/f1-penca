const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getStandings() {
    try {
        // Add cache busting parameter to ensure fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/api/standings?t=${timestamp}`, {
            cache: 'no-store', // Ensure fresh data
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
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
