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

interface CreatePredictionRequest {
    raceId: string;
    positions: string[];
    polePositionPrediction: string;
    sprintPolePrediction?: string;
    sprintPositions?: string[];
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

        const data = await response.json();
        
        // Handle the case where API returns null
        if (!data) {
            return null;
        }

        // The API already returns data in the correct format
        return {
            id: data.id,
            raceId: data.raceId,
            userId: data.userId,
            polePosition: data.polePosition,
            raceWinner: data.raceWinner,
            secondPlace: data.secondPlace,
            thirdPlace: data.thirdPlace,
            fourthPlace: data.fourthPlace,
            fifthPlace: data.fifthPlace,
            sprintPole: data.sprintPole,
            sprintWinner: data.sprintWinner,
            totalPoints: data.totalPoints,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    } catch (error) {
        console.error('Error fetching prediction:', error);
        // Don't throw for 404 cases, return null instead
        if (error instanceof Error && error.message.includes('404')) {
            return null;
        }
        throw error;
    }
}

export async function createPrediction(raceId: string, prediction: PredictionForm) {
    try {
        // Transform the data to match the API's expected format
        const positions = [
            prediction.raceWinner,
            prediction.secondPlace,
            prediction.thirdPlace,
            prediction.fourthPlace,
            prediction.fifthPlace,
        ];

        const requestBody: CreatePredictionRequest = {
            raceId,
            positions,
            polePositionPrediction: prediction.polePosition,
        };

        // Add sprint data if present
        if (prediction.sprintPole) {
            requestBody.sprintPolePrediction = prediction.sprintPole;
        }
        if (prediction.sprintWinner) {
            requestBody.sprintPositions = [prediction.sprintWinner];
        }

        const response = await fetch(`${API_BASE_URL}/api/predictions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create prediction: ${error}`);
        }

        const result = await response.json();
        
        // Transform the result back to our expected format
        return {
            id: result.id,
            raceId: result.raceId,
            userId: result.userId,
            polePosition: requestBody.polePositionPrediction,
            raceWinner: positions[0],
            secondPlace: positions[1],
            thirdPlace: positions[2],
            fourthPlace: positions[3],
            fifthPlace: positions[4],
            sprintPole: requestBody.sprintPolePrediction,
            sprintWinner: requestBody.sprintPositions?.[0],
            totalPoints: result.points,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    } catch (error) {
        console.error('Error creating prediction:', error);
        throw error;
    }
}

export async function updatePrediction(raceId: string, prediction: PredictionForm) {
    try {
        // Transform the data to match API expectations
        const positions = [
            prediction.raceWinner,
            prediction.secondPlace,
            prediction.thirdPlace,
            prediction.fourthPlace,
            prediction.fifthPlace,
        ];

        const requestBody: {
            polePositionPrediction: string;
            positions: string[];
            sprintPolePrediction?: string;
            sprintPositions?: string[];
        } = {
            polePositionPrediction: prediction.polePosition,
            positions: positions,
        };

        // Include sprint predictions if available
        if (prediction.sprintPole || prediction.sprintWinner) {
            requestBody.sprintPolePrediction = prediction.sprintPole;
            requestBody.sprintPositions = prediction.sprintWinner ? [prediction.sprintWinner] : [];
        }

        const response = await fetch(`${API_BASE_URL}/api/predictions/${raceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update prediction: ${error}`);
        }

        const result = await response.json();
        
        // Transform the result back to our expected format
        return {
            id: result.id,
            raceId: result.raceId,
            userId: result.userId,
            polePosition: requestBody.polePositionPrediction,
            raceWinner: positions[0],
            secondPlace: positions[1],
            thirdPlace: positions[2],
            fourthPlace: positions[3],
            fifthPlace: positions[4],
            sprintPole: requestBody.sprintPolePrediction,
            sprintWinner: requestBody.sprintPositions?.[0],
            totalPoints: result.points,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    } catch (error) {
        console.error('Error updating prediction:', error);
        throw error;
    }
}
