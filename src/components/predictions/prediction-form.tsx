"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Select, SelectItem, Button, Divider, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Race } from "@/services/races";
import { Driver } from "@/services/drivers";
import { Prediction, PredictionForm, createPrediction, updatePrediction } from "@/services/predictions";

interface PredictionFormProps {
    race: Race;
    drivers: Driver[];
    prediction: Prediction | null;
    onPredictionUpdate: (prediction: Prediction) => void;
}

interface FormData {
    polePosition: string;
    fastestLap: string;
    raceWinner: string;
    secondPlace: string;
    thirdPlace: string;
    fourthPlace: string;
    fifthPlace: string;
    sprintPole?: string;
    sprintWinner?: string;
    sprintSecond?: string;
    sprintThird?: string;
}

export default function PredictionFormComponent({ race, drivers, prediction, onPredictionUpdate }: PredictionFormProps) {
    // Crown icon (lucide crown variant)
    const CrownIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
            <path d="M5 21h14"/>
        </svg>
    );
    // ------- Results + highlighting state -------
    type DriverPosition = { position: number; driverId: string };
    interface RaceResults {
        polePosition?: string | null;
        fastestLap?: string | null;
        raceResult?: DriverPosition[] | null;
        sprintPolePosition?: string | null;
        sprintResult?: DriverPosition[] | null;
    }

    const [results, setResults] = useState<RaceResults | null>(null);

    const [formData, setFormData] = useState<FormData>({
        polePosition: '',
        fastestLap: '',
        raceWinner: '',
        secondPlace: '',
        thirdPlace: '',
        fourthPlace: '',
        fifthPlace: '',
        sprintPole: '',
        sprintWinner: '',
        sprintSecond: '',
        sprintThird: '',
    });
    
    const [originalFormData, setOriginalFormData] = useState<FormData>({
        polePosition: '',
        fastestLap: '',
        raceWinner: '',
        secondPlace: '',
        thirdPlace: '',
        fourthPlace: '',
        fifthPlace: '',
        sprintPole: '',
        sprintWinner: '',
        sprintSecond: '',
        sprintThird: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch race results when available to enable accuracy highlighting
    useEffect(() => {
        let cancelled = false;
        async function fetchResults() {
            if (!(race.status === 'COMPLETED' || race.resultsImported)) {
                setResults(null);
                return;
            }
            try {
                const res = await fetch(`/api/races/${race.id}/results`, {
                    cache: 'no-store',
                    credentials: 'include',
                });
                if (!res.ok) {
                    // If 404, results not found; just do nothing
                    setResults(null);
                    return;
                }
                const data = await res.json();
                if (cancelled) return;
                const mapped: RaceResults = {
                    polePosition: data.polePosition ?? null,
                    fastestLap: data.fastestLap ?? null,
                    raceResult: Array.isArray(data.raceResult) ? data.raceResult : null,
                    sprintPolePosition: data.sprintPolePosition ?? null,
                    sprintResult: Array.isArray(data.sprintResult) ? data.sprintResult : null,
                };
                setResults(mapped);
            } catch {
                // Non-blocking: ignore
                setResults(null);
            } finally {
                // no-op
            }
        }
        fetchResults();
        return () => { cancelled = true; };
    }, [race.id, race.status, race.resultsImported]);

    // Load existing prediction data
    useEffect(() => {
        if (prediction) {
            const newFormData = {
                polePosition: prediction.polePosition || '',
                fastestLap: prediction.fastestLap || '',
                raceWinner: prediction.raceWinner || '',
                secondPlace: prediction.secondPlace || '',
                thirdPlace: prediction.thirdPlace || '',
                fourthPlace: prediction.fourthPlace || '',
                fifthPlace: prediction.fifthPlace || '',
                sprintPole: prediction.sprintPole || '',
                sprintWinner: prediction.sprintWinner || '',
                sprintSecond: prediction.sprintSecond || '',
                sprintThird: prediction.sprintThird || '',
            };
            setFormData(newFormData);
            setOriginalFormData(newFormData);
        } else {
            // Reset to empty state if no prediction
            const emptyFormData = {
                polePosition: '',
                fastestLap: '',
                raceWinner: '',
                secondPlace: '',
                thirdPlace: '',
                fourthPlace: '',
                fifthPlace: '',
                sprintPole: '',
                sprintWinner: '',
                sprintSecond: '',
                sprintThird: '',
            };
            setFormData(emptyFormData);
            setOriginalFormData(emptyFormData);
        }
    }, [prediction]);

    const handleSelectChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isFormValid = () => {
        // All main race fields are always required
        const requiredFields = ['polePosition', 'fastestLap', 'raceWinner', 'secondPlace', 'thirdPlace', 'fourthPlace', 'fifthPlace'];
        const allMainRaceFieldsFilled = requiredFields.every(field => formData[field as keyof FormData] !== '');
        
        // For sprint weekends, ALL sprint fields are also required
        if (race.hasSprint) {
            const sprintFieldsFilled = formData.sprintPole !== '' && 
                                     formData.sprintWinner !== '' &&
                                     formData.sprintSecond !== '' &&
                                     formData.sprintThird !== '';
            return allMainRaceFieldsFilled && sprintFieldsFilled;
        }
        
        // For regular weekends, only main race fields are required
        return allMainRaceFieldsFilled;
    };

    const getAvailableDrivers = () => {
        // Always return all drivers - users should be able to select the same driver
        // for multiple positions (e.g., pole position winner also winning the race)
        return drivers;
    };

    const hasFormChanged = () => {
        return JSON.stringify(formData) !== JSON.stringify(originalFormData);
    };

    const getButtonText = () => {
        if (race.status === 'COMPLETED') {
            return 'Prediction Closed';
        }
        
        if (race.status === 'LIVE') {
            return 'Prediction Closed';
        }

        if (prediction) {
            return hasFormChanged() ? 'Save Changes' : 'Prediction Complete';
        }

        return 'Create Prediction';
    };

    const getButtonColor = (): "primary" | "success" | "secondary" | "default" => {
        if (race.status === 'COMPLETED' || race.status === 'LIVE') {
            return 'default';
        }

        if (prediction) {
            return hasFormChanged() ? 'primary' : 'secondary';
        }

        return 'success';
    };

    const isButtonDisabled = () => {
        if (race.status === 'COMPLETED' || race.status === 'LIVE') {
            return true;
        }

        if (!isFormValid()) {
            return true;
        }

        if (prediction && !hasFormChanged()) {
            return true;
        }

        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setError('Please fill all required fields');
            
            // Show validation error toast
            addToast({
                title: "Validation Error",
                description: race.hasSprint 
                    ? "Please fill in all required prediction fields for both main race and sprint race."
                    : "Please fill in all required main race prediction fields.",
                color: "warning",
                variant: "flat",
                radius: "lg",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const predictionData: PredictionForm = {
                polePosition: formData.polePosition,
                fastestLap: formData.fastestLap,
                raceWinner: formData.raceWinner,
                secondPlace: formData.secondPlace,
                thirdPlace: formData.thirdPlace,
                fourthPlace: formData.fourthPlace,
                fifthPlace: formData.fifthPlace,
            };

            if (race.hasSprint) {
                predictionData.sprintPole = formData.sprintPole;
                predictionData.sprintWinner = formData.sprintWinner;
                predictionData.sprintSecond = formData.sprintSecond;
                predictionData.sprintThird = formData.sprintThird;
            }

            let result;
            if (prediction) {
                result = await updatePrediction(race.id, predictionData);
            } else {
                result = await createPrediction(race.id, predictionData);
            }

            // Update parent component
            onPredictionUpdate(result);
            
            // Update original form data to reflect the new saved state
            setOriginalFormData({ ...formData });
            
            // Show success toast
            addToast({
                title: prediction ? "Prediction Updated!" : "Prediction Created!",
                description: prediction 
                    ? "Your prediction has been updated successfully." 
                    : "Your prediction has been saved successfully.",
                color: "success",
                variant: "flat",
                radius: "lg",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save prediction';
            setError(errorMessage);
            
            // Show error toast
            addToast({
                title: "Prediction Failed",
                description: errorMessage,
                color: "danger",
                variant: "flat",
                radius: "lg",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = race.status === 'COMPLETED' || race.status === 'LIVE';

    // ------- Accuracy evaluation helpers -------
    type Accuracy = 'exact' | 'partial' | 'none' | 'unknown';

    const inTopN = (driverId: string, list: DriverPosition[] | null | undefined, n: number) => {
        if (!driverId || !list || list.length === 0) return false;
        return list.slice(0, n).some((d) => d.driverId === driverId);
    };

    const isExactAtIndex = (driverId: string, list: DriverPosition[] | null | undefined, index: number) => {
        if (!driverId || !list || list.length <= index) return false;
        return list[index]?.driverId === driverId;
    };

    function getAccuracy(field: keyof FormData): Accuracy {
        // Only highlight when we have final results
        if (!(race.status === 'COMPLETED') || !results) return 'unknown';

        const v = formData[field] || '';
        if (!v) return 'none';

        switch (field) {
            case 'polePosition':
                if (results.polePosition && v === results.polePosition) return 'exact';
                return 'none';
            case 'fastestLap':
                if (results.fastestLap && v === results.fastestLap) return 'exact';
                return 'none';
            case 'raceWinner':
                return isExactAtIndex(v, results.raceResult, 0) ? 'exact' : 'none';
            case 'secondPlace': {
                if (isExactAtIndex(v, results.raceResult, 1)) return 'exact';
                // Partial if on podium but wrong position
                return inTopN(v, results.raceResult, 3) ? 'partial' : 'none';
            }
            case 'thirdPlace': {
                if (isExactAtIndex(v, results.raceResult, 2)) return 'exact';
                // Partial if on podium but wrong position
                return inTopN(v, results.raceResult, 3) ? 'partial' : 'none';
            }
            case 'fourthPlace': {
                if (isExactAtIndex(v, results.raceResult, 3)) return 'exact';
                // Partial if inside top 5 but wrong position
                return inTopN(v, results.raceResult, 5) ? 'partial' : 'none';
            }
            case 'fifthPlace': {
                if (isExactAtIndex(v, results.raceResult, 4)) return 'exact';
                // Partial if inside top 5 but wrong position
                return inTopN(v, results.raceResult, 5) ? 'partial' : 'none';
            }
            case 'sprintPole': {
                if (!race.hasSprint) return 'unknown';
                if (results.sprintPolePosition && v === results.sprintPolePosition) return 'exact';
                return 'none';
            }
            case 'sprintWinner': {
                if (!race.hasSprint) return 'unknown';
                return isExactAtIndex(v, results.sprintResult, 0) ? 'exact' : 'none';
            }
            case 'sprintSecond': {
                if (!race.hasSprint) return 'unknown';
                if (isExactAtIndex(v, results.sprintResult, 1)) return 'exact';
                // Partial if on sprint podium but wrong position
                return inTopN(v, results.sprintResult, 3) ? 'partial' : 'none';
            }
            case 'sprintThird': {
                if (!race.hasSprint) return 'unknown';
                if (isExactAtIndex(v, results.sprintResult, 2)) return 'exact';
                // Partial if on sprint podium but wrong position
                return inTopN(v, results.sprintResult, 3) ? 'partial' : 'none';
            }
            default:
                return 'none';
        }
    }

    function getSelectVisuals(field: keyof FormData): { color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"; variant?: "flat" | "bordered" | "faded" | "underlined" } {
        const acc = getAccuracy(field);
        if (acc === 'exact') return { color: 'success', variant: 'faded' };
        if (acc === 'partial') return { color: 'warning', variant: 'faded' };
        return {};
    }

    const isCompleted = race.status === 'COMPLETED' && !!results;

    // ------- Points calculation per field -------
    function getPoints(field: keyof FormData): number {
        if (!isCompleted || !results) return 0;
        const v = formData[field];
        if (!v) return 0;

        const onPodium = (driverId: string) => inTopN(driverId, results.raceResult, 3);
        const inTop5 = (driverId: string) => inTopN(driverId, results.raceResult, 5);
        const sprintOnPodium = (driverId: string) => inTopN(driverId, results.sprintResult, 3);

        switch (field) {
            // Regular weekend
            case 'polePosition':
                return results.polePosition && v === results.polePosition ? 10 : 0;
            case 'fastestLap':
                return results.fastestLap && v === results.fastestLap ? 1 : 0;
            case 'raceWinner':
                return isExactAtIndex(v, results.raceResult, 0) ? 15 : 0;
            case 'secondPlace':
                if (isExactAtIndex(v, results.raceResult, 1)) return 10;
                return onPodium(v) ? 5 : 0;
            case 'thirdPlace':
                if (isExactAtIndex(v, results.raceResult, 2)) return 8;
                return onPodium(v) ? 3 : 0;
            case 'fourthPlace':
                if (isExactAtIndex(v, results.raceResult, 3)) return 5; // exact in top5
                return inTop5(v) ? 1 : 0; // partial in top5
            case 'fifthPlace':
                if (isExactAtIndex(v, results.raceResult, 4)) return 5; // exact in top5
                return inTop5(v) ? 1 : 0; // partial in top5
            // Sprint weekend
            case 'sprintPole':
                if (!race.hasSprint) return 0;
                return results.sprintPolePosition && v === results.sprintPolePosition ? 5 : 0;
            case 'sprintWinner':
                if (!race.hasSprint) return 0;
                return isExactAtIndex(v, results.sprintResult, 0) ? 8 : 0;
            case 'sprintSecond':
                if (!race.hasSprint) return 0;
                if (isExactAtIndex(v, results.sprintResult, 1)) return 5;
                return sprintOnPodium(v) ? 3 : 0;
            case 'sprintThird':
                if (!race.hasSprint) return 0;
                if (isExactAtIndex(v, results.sprintResult, 2)) return 3;
                return sprintOnPodium(v) ? 1 : 0;
            default:
                return 0;
        }
    }

    // ------- Bonus calculations -------
    const hasPerfectPodium = React.useMemo(() => {
        if (!isCompleted || !results || !results.raceResult) return false;
        const picks = [formData.raceWinner, formData.secondPlace, formData.thirdPlace];
        if (picks.some((p) => !p)) return false;
        return [0, 1, 2].every((i) => results.raceResult![i]?.driverId === picks[i]);
    }, [isCompleted, results, formData.raceWinner, formData.secondPlace, formData.thirdPlace]);

    const hasPerfectTop5 = React.useMemo(() => {
        if (!isCompleted || !results || !results.raceResult) return false;
        const picks = [
            formData.raceWinner,
            formData.secondPlace,
            formData.thirdPlace,
            formData.fourthPlace,
            formData.fifthPlace,
        ];
        if (picks.some((p) => !p)) return false;
        return [0, 1, 2, 3, 4].every((i) => results.raceResult![i]?.driverId === picks[i]);
    }, [
        isCompleted,
        results,
        formData.raceWinner,
        formData.secondPlace,
        formData.thirdPlace,
        formData.fourthPlace,
        formData.fifthPlace,
    ]);

    const hasPerfectSprintPodium = React.useMemo(() => {
        if (!isCompleted || !race.hasSprint || !results || !results.sprintResult) return false;
        const picks = [formData.sprintWinner, formData.sprintSecond, formData.sprintThird];
        if (picks.some((p) => !p)) return false;
        return [0, 1, 2].every((i) => results.sprintResult![i]?.driverId === picks[i]);
    }, [isCompleted, race.hasSprint, results, formData.sprintWinner, formData.sprintSecond, formData.sprintThird]);

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full card-racing-translucent">
                <CardBody className="space-y-6">
                    {error && (
                        <div className="text-danger text-sm p-3 bg-danger/10 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Main Race Predictions */}
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mt-2 mb-4 ml-3">Main Race</h4>
                        
                        {/* Pole Position */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="pole-position"
                                name="polePosition"
                                label="Pole Position"
                                placeholder="Select driver for pole position"
                                {...getSelectVisuals('polePosition')}
                                className="flex-1"
                                selectedKeys={formData.polePosition ? [formData.polePosition] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('polePosition', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {drivers.map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Pole points"
                                    label="Pts"
                                    value={String(getPoints('polePosition'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* Fastest Lap */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="fastest-lap"
                                name="fastestLap"
                                label="Fastest Lap"
                                placeholder="Select driver for fastest lap"
                                {...getSelectVisuals('fastestLap')}
                                className="flex-1"
                                selectedKeys={formData.fastestLap ? [formData.fastestLap] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('fastestLap', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {drivers.map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Fastest lap points"
                                    label="Pts"
                                    value={String(getPoints('fastestLap'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* Race Winner */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="race-winner"
                                name="raceWinner"
                                label="Race Winner"
                                placeholder="Select race winner"
                                {...getSelectVisuals('raceWinner')}
                                className="flex-1"
                                selectedKeys={formData.raceWinner ? [formData.raceWinner] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('raceWinner', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Race winner points"
                                    label="Pts"
                                    value={String(getPoints('raceWinner'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* 2nd Place */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="second-place"
                                name="secondPlace"
                                label="2nd Place"
                                placeholder="Select 2nd place finisher"
                                {...getSelectVisuals('secondPlace')}
                                className="flex-1"
                                selectedKeys={formData.secondPlace ? [formData.secondPlace] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('secondPlace', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Second place points"
                                    label="Pts"
                                    value={String(getPoints('secondPlace'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* 3rd Place */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="third-place"
                                name="thirdPlace"
                                label="3rd Place"
                                placeholder="Select 3rd place finisher"
                                {...getSelectVisuals('thirdPlace')}
                                className="flex-1"
                                selectedKeys={formData.thirdPlace ? [formData.thirdPlace] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('thirdPlace', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Third place points"
                                    label="Pts"
                                    value={String(getPoints('thirdPlace'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* 4th Place */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="fourth-place"
                                name="fourthPlace"
                                label="4th Place"
                                placeholder="Select 4th place finisher"
                                {...getSelectVisuals('fourthPlace')}
                                className="flex-1"
                                selectedKeys={formData.fourthPlace ? [formData.fourthPlace] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('fourthPlace', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Fourth place points"
                                    label="Pts"
                                    value={String(getPoints('fourthPlace'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>

                        {/* 5th Place */}
                        <div className="mb-4 flex items-end gap-3">
                            <Select
                                id="fifth-place"
                                name="fifthPlace"
                                label="5th Place"
                                placeholder="Select 5th place finisher"
                                {...getSelectVisuals('fifthPlace')}
                                className="flex-1"
                                selectedKeys={formData.fifthPlace ? [formData.fifthPlace] : []}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleSelectChange('fifthPlace', selectedKey || '');
                                }}
                                isRequired
                                isDisabled={isDisabled}
                            >
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                            {isCompleted && (
                                <Input
                                    aria-label="Fifth place points"
                                    label="Pts"
                                    value={String(getPoints('fifthPlace'))}
                                    isReadOnly
                                    isDisabled
                                    variant="faded"
                                    className="w-14"
                                />
                            )}
                        </div>
                    </div>

                    {/* Sprint Race Predictions */}
                    {race.hasSprint && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-lg font-semibold text-foreground mb-4 ml-3">Sprint Race</h4>
                                
                                {/* Sprint Pole */}
                                <div className="mb-4 flex items-end gap-3">
                                    <Select
                                        id="sprint-pole"
                                        name="sprintPole"
                                        label="Sprint Pole Position"
                                        placeholder="Select driver for sprint pole"
                                        {...getSelectVisuals('sprintPole')}
                                        className="flex-1"
                                        selectedKeys={formData.sprintPole ? [formData.sprintPole] : []}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleSelectChange('sprintPole', selectedKey || '');
                                        }}
                                        isRequired={race.hasSprint}
                                        isDisabled={isDisabled}
                                    >
                                        {drivers.map((driver) => (
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {isCompleted && (
                                        <Input
                                            aria-label="Sprint pole points"
                                            label="Pts"
                                            value={String(getPoints('sprintPole'))}
                                            isReadOnly
                                            isDisabled
                                            variant="faded"
                                            className="w-14"
                                        />
                                    )}
                                </div>

                                {/* Sprint Winner */}
                                <div className="mb-4 flex items-end gap-3">
                                    <Select
                                        id="sprint-winner"
                                        name="sprintWinner"
                                        label="Sprint Winner"
                                        placeholder="Select sprint winner"
                                        {...getSelectVisuals('sprintWinner')}
                                        className="flex-1"
                                        selectedKeys={formData.sprintWinner ? [formData.sprintWinner] : []}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleSelectChange('sprintWinner', selectedKey || '');
                                        }}
                                        isRequired={race.hasSprint}
                                        isDisabled={isDisabled}
                                    >
                                        {drivers.map((driver) => (
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {isCompleted && (
                                        <Input
                                            aria-label="Sprint winner points"
                                            label="Pts"
                                            value={String(getPoints('sprintWinner'))}
                                            isReadOnly
                                            isDisabled
                                            variant="faded"
                                            className="w-14"
                                        />
                                    )}
                                </div>

                                {/* Sprint 2nd Place */}
                                <div className="mb-4 flex items-end gap-3">
                                    <Select
                                        id="sprint-second"
                                        name="sprintSecond"
                                        label="Sprint 2nd Place"
                                        placeholder="Select sprint 2nd place finisher"
                                        {...getSelectVisuals('sprintSecond')}
                                        className="flex-1"
                                        selectedKeys={formData.sprintSecond ? [formData.sprintSecond] : []}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleSelectChange('sprintSecond', selectedKey || '');
                                        }}
                                        isRequired={race.hasSprint}
                                        isDisabled={isDisabled}
                                    >
                                        {getAvailableDrivers().map((driver) => (
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {isCompleted && (
                                        <Input
                                            aria-label="Sprint 2nd points"
                                            label="Pts"
                                            value={String(getPoints('sprintSecond'))}
                                            isReadOnly
                                            isDisabled
                                            variant="faded"
                                            className="w-14"
                                        />
                                    )}
                                </div>

                                {/* Sprint 3rd Place */}
                                <div className="mb-4 flex items-end gap-3">
                                    <Select
                                        id="sprint-third"
                                        name="sprintThird"
                                        label="Sprint 3rd Place"
                                        placeholder="Select sprint 3rd place finisher"
                                        {...getSelectVisuals('sprintThird')}
                                        className="flex-1"
                                        selectedKeys={formData.sprintThird ? [formData.sprintThird] : []}
                                        onSelectionChange={(keys) => {
                                            const selectedKey = Array.from(keys)[0] as string;
                                            handleSelectChange('sprintThird', selectedKey || '');
                                        }}
                                        isRequired={race.hasSprint}
                                        isDisabled={isDisabled}
                                    >
                                        {getAvailableDrivers().map((driver) => (
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {isCompleted && (
                                        <Input
                                            aria-label="Sprint 3rd points"
                                            label="Pts"
                                            value={String(getPoints('sprintThird'))}
                                            isReadOnly
                                            isDisabled
                                            variant="faded"
                                            className="w-14"
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Bonuses */}
                    {isCompleted && (
                        <>
                            <Divider />
                            <div className="flex items-center justify-center gap-2 py-1 flex-wrap text-foreground-600">
                                <Button
                                    size="sm"
                                    radius="full"
                                    variant="flat"
                                    color={hasPerfectPodium ? 'success' : 'default'}
                                    aria-label="Perfect podium"
                                    endContent={<CrownIcon />}
                                    className="h-8"
                                >
                                    +10 Podium
                                </Button>
                                <Button
                                    size="sm"
                                    radius="full"
                                    variant="flat"
                                    color={hasPerfectTop5 ? 'success' : 'default'}
                                    aria-label="Perfect top 5"
                                    endContent={<CrownIcon />}
                                    className="h-8"
                                >
                                    +10 Top 5
                                </Button>
                                {race.hasSprint && (
                                    <Button
                                        size="sm"
                                        radius="full"
                                        variant="flat"
                                        color={hasPerfectSprintPodium ? 'success' : 'default'}
                                        aria-label="Perfect sprint podium"
                                        endContent={<CrownIcon />}
                                        className="h-8"
                                    >
                                        +5 Sprint Podium
                                    </Button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    {!isDisabled && (
                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                color={getButtonColor()}
                                size="lg"
                                isLoading={loading}
                                isDisabled={isButtonDisabled()}
                                className="font-semibold w-full max-w-md"
                            >
                                {getButtonText()}
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </form>
    );
}
