// src/services/openf1.ts
/**
 * Service for interacting with the OpenF1 API
 */

const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

/**
 * Fetches data from the OpenF1 API
 * @param endpoint - The API endpoint to fetch from
 * @param params - Query parameters to include in the request
 * @returns The fetched data
 */
async function fetchFromOpenF1<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
    // Convert params object to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    const url = `${OPENF1_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`OpenF1 API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json() as T;
    } catch (error) {
        console.error(`Error fetching from OpenF1 API (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Interface for a driver in the OpenF1 API
 */
export interface OpenF1Driver {
    driver_number: number;
    name_acronym: string;
    full_name: string;
    first_name: string;
    last_name: string;
    broadcast_name: string;
    team_name: string;
    team_colour: string;
    country_code: string;
    headshot_url: string;
    session_key: number;
    meeting_key: number;
}

/**
 * Interface for a session in the OpenF1 API
 */
export interface OpenF1Session {
    session_key: number;
    meeting_key: number;
    session_name: string;
    session_type: string;
    date_start: string;
    date_end: string;
    circuit_key: number;
    circuit_short_name: string;
    country_name: string;
    country_code: string;
    year: number;
    location: string;
    gmt_offset: string;
}

/**
 * Interface for a lap in the OpenF1 API
 */
export interface OpenF1Lap {
    driver_number: number;
    lap_number: number;
    lap_duration: number;
    date_start: string;
    duration_sector_1?: number;
    duration_sector_2?: number;
    duration_sector_3?: number;
    is_pit_out_lap: boolean;
    meeting_key: number;
    session_key: number;
    segments_sector_1?: number[];
    segments_sector_2?: number[];
    segments_sector_3?: number[];
    i1_speed?: number;
    i2_speed?: number;
    st_speed?: number;
}

/**
 * Interface for a race result in the OpenF1 API
 */
export interface OpenF1Position {
    driver_number: number;
    position: number;
    date: string;
    meeting_key: number;
    session_key: number;
}

/**
 * Interface for team radio in the OpenF1 API
 */
export interface OpenF1TeamRadio {
    driver_number: number;
    date: string;
    recording_url: string;
    meeting_key: number;
    session_key: number;
}

/**
 * Interface for a pit stop in the OpenF1 API
 */
export interface OpenF1Pit {
    driver_number: number;
    lap_number: number;
    pit_duration: number;
    date: string;
    meeting_key: number;
    session_key: number;
}

/**
 * Interface for a stint in the OpenF1 API
 */
export interface OpenF1Stint {
    driver_number: number;
    stint_number: number;
    compound: string; // e.g., "SOFT", "MEDIUM", "HARD"
    lap_start: number;
    lap_end: number;
    tyre_age_at_start: number;
    meeting_key: number;
    session_key: number;
}

/**
 * Gets drivers for a specific session
 * @param sessionKey - The session key (can use 'latest' for the current session)
 * @returns List of drivers
 */
export async function getDrivers(sessionKey: string | number = 'latest'): Promise<OpenF1Driver[]> {
    return fetchFromOpenF1<OpenF1Driver[]>('drivers', { session_key: sessionKey });
}

/**
 * Gets all available sessions, optionally filtered by year
 * @param year - The year to filter by
 * @returns List of sessions
 */
export async function getSessions(year?: number): Promise<OpenF1Session[]> {
    const params: Record<string, string | number | boolean> = {};
    if (year) {
        params.year = year;
    }
    return fetchFromOpenF1<OpenF1Session[]>('sessions', params);
}

/**
 * Gets a specific session by key
 * @param sessionKey - The session key
 * @returns The session details
 */
export async function getSession(sessionKey: string | number): Promise<OpenF1Session> {
    const sessions = await fetchFromOpenF1<OpenF1Session[]>('sessions', { session_key: sessionKey });
    if (sessions.length === 0) {
        throw new Error(`No session found with key ${sessionKey}`);
    }
    return sessions[0];
}

/**
 * Gets race results (final positions) for a specific session
 * @param sessionKey - The session key
 * @returns The race results
 */
export async function getRaceResults(sessionKey: string | number): Promise<OpenF1Position[]> {
    // Get the most recent position data for each driver in the race
    const positions = await fetchFromOpenF1<OpenF1Position[]>('position', { session_key: sessionKey });
    
    // Group by driver and get the latest position for each
    const driverMap = new Map<number, OpenF1Position>();
    positions.forEach(pos => {
        const existing = driverMap.get(pos.driver_number);
        if (!existing || new Date(pos.date) > new Date(existing.date)) {
            driverMap.set(pos.driver_number, pos);
        }
    });
    
    // Convert to array and sort by position
    return Array.from(driverMap.values()).sort((a, b) => a.position - b.position);
}

/**
 * Gets lap data for a specific session and driver
 * @param sessionKey - The session key
 * @param driverNumber - The driver number (optional)
 * @returns Lap data
 */
export async function getLaps(sessionKey: string | number, driverNumber?: number): Promise<OpenF1Lap[]> {
    const params: Record<string, string | number | boolean> = { session_key: sessionKey };
    if (driverNumber) {
        params.driver_number = driverNumber;
    }
    return fetchFromOpenF1<OpenF1Lap[]>('laps', params);
}

/**
 * Gets stint data for a specific session
 * @param sessionKey - The session key
 * @param driverNumber - The driver number (optional)
 * @returns Stint data
 */
export async function getStints(sessionKey: string | number, driverNumber?: number): Promise<OpenF1Stint[]> {
    const params: Record<string, string | number | boolean> = { session_key: sessionKey };
    if (driverNumber) {
        params.driver_number = driverNumber;
    }
    return fetchFromOpenF1<OpenF1Stint[]>('stints', params);
}

/**
 * Gets pit stop data for a specific session
 * @param sessionKey - The session key
 * @param driverNumber - The driver number (optional)
 * @returns Pit stop data
 */
export async function getPitStops(sessionKey: string | number, driverNumber?: number): Promise<OpenF1Pit[]> {
    const params: Record<string, string | number | boolean> = { session_key: sessionKey };
    if (driverNumber) {
        params.driver_number = driverNumber;
    }
    return fetchFromOpenF1<OpenF1Pit[]>('pit', params);
}

/**
 * Gets team radio communications for a specific session
 * @param sessionKey - The session key
 * @param driverNumber - The driver number (optional)
 * @returns Team radio data
 */
export async function getTeamRadio(sessionKey: string | number, driverNumber?: number): Promise<OpenF1TeamRadio[]> {
    const params: Record<string, string | number | boolean> = { session_key: sessionKey };
    if (driverNumber) {
        params.driver_number = driverNumber;
    }
    return fetchFromOpenF1<OpenF1TeamRadio[]>('team_radio', params);
}

/**
 * Maps OpenF1 driver data to our internal driver model
 * @param openF1Driver - The OpenF1 driver object
 * @returns Our internal driver model
 */
export function mapOpenF1DriverToInternalDriver(openF1Driver: OpenF1Driver) {
    return {
        number: openF1Driver.driver_number,
        code: openF1Driver.name_acronym,
        firstname: openF1Driver.first_name,
        lastname: openF1Driver.last_name,
        fullname: openF1Driver.full_name,
        nationality: openF1Driver.country_code,
        team: openF1Driver.team_name,
        active: true, // Assume active if in current session
        imageUrl: openF1Driver.headshot_url,
        teamColor: openF1Driver.team_colour,
    };
}

const openF1Service = {
    getDrivers,
    getSessions,
    getSession,
    getRaceResults,
    getLaps,
    getStints,
    getPitStops,
    getTeamRadio,
    mapOpenF1DriverToInternalDriver,
};

export default openF1Service;
