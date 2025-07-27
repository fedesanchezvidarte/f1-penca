const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface Prediction {
    id?: string;
    raceId: string;
    userId: string;
    polePosition: string;
    raceWinner: string;
    secondPlace: string;
    thirdPlace: string;
    fourthPlace: string;
    fifthPlace: string;
    sprintPole?: string;
    sprintWinner?: string;
    totalPoints?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PredictionForm {
    polePosition: string;
    raceWinner: string;
    secondPlace: string;
    thirdPlace: string;
    fourthPlace: string;
    fifthPlace: string;
    sprintPole?: string;
    sprintWinner?: string;
}

export async function getUserPrediction(raceId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predictions/${raceId}`, {
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // No prediction found
            }
            throw new Error(`Failed to fetch prediction: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching prediction:', error);
        throw error;
    }
}

export async function createPrediction(raceId: string, prediction: PredictionForm) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predictions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                raceId,
                ...prediction,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create prediction: ${error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating prediction:', error);
        throw error;
    }
}

export async function updatePrediction(raceId: string, prediction: PredictionForm) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predictions/${raceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(prediction),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update prediction: ${error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating prediction:', error);
        throw error;
    }
}
