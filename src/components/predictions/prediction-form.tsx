"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Select, SelectItem, Button, Divider } from "@heroui/react";
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
    raceWinner: string;
    secondPlace: string;
    thirdPlace: string;
    fourthPlace: string;
    fifthPlace: string;
    sprintPole?: string;
    sprintWinner?: string;
}

const SCORING_INFO = {
    polePosition: { correct: 10, partial: null },
    raceWinner: { correct: 15, partial: null },
    secondPlace: { correct: 10, partial: 5 },
    thirdPlace: { correct: 8, partial: 3 },
    topFive: { correct: 5, partial: 1 },
    sprintPole: { correct: 5, partial: null },
    sprintWinner: { correct: 8, partial: null },
};

export default function PredictionFormComponent({ race, drivers, prediction, onPredictionUpdate }: PredictionFormProps) {
    const [formData, setFormData] = useState<FormData>({
        polePosition: '',
        raceWinner: '',
        secondPlace: '',
        thirdPlace: '',
        fourthPlace: '',
        fifthPlace: '',
        sprintPole: '',
        sprintWinner: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load existing prediction data
    useEffect(() => {
        if (prediction) {
            setFormData({
                polePosition: prediction.polePosition || '',
                raceWinner: prediction.raceWinner || '',
                secondPlace: prediction.secondPlace || '',
                thirdPlace: prediction.thirdPlace || '',
                fourthPlace: prediction.fourthPlace || '',
                fifthPlace: prediction.fifthPlace || '',
                sprintPole: prediction.sprintPole || '',
                sprintWinner: prediction.sprintWinner || '',
            });
        }
    }, [prediction]);

    const handleSelectChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isFormValid = () => {
        const requiredFields = ['polePosition', 'raceWinner', 'secondPlace', 'thirdPlace', 'fourthPlace', 'fifthPlace'];
        const raceFields = requiredFields.every(field => formData[field as keyof FormData] !== '');
        
        if (race.hasSprint) {
            return raceFields && formData.sprintPole !== '' && formData.sprintWinner !== '';
        }
        
        return raceFields;
    };

    const getAvailableDrivers = (currentField: keyof FormData) => {
        const selectedDrivers = Object.entries(formData)
            .filter(([key, value]) => key !== currentField && value !== '')
            .map(([, value]) => value);
            
        return drivers.filter(driver => !selectedDrivers.includes(driver.id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const predictionData: PredictionForm = {
                polePosition: formData.polePosition,
                raceWinner: formData.raceWinner,
                secondPlace: formData.secondPlace,
                thirdPlace: formData.thirdPlace,
                fourthPlace: formData.fourthPlace,
                fifthPlace: formData.fifthPlace,
            };

            if (race.hasSprint) {
                predictionData.sprintPole = formData.sprintPole;
                predictionData.sprintWinner = formData.sprintWinner;
            }

            let result;
            if (prediction) {
                result = await updatePrediction(race.id, predictionData);
            } else {
                result = await createPrediction(race.id, predictionData);
            }

            // Update parent component
            onPredictionUpdate(result);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save prediction');
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = race.status === 'COMPLETED' || race.status === 'LIVE';

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full card-racing-translucent">
                <CardHeader>
                    <h3 className="text-xl font-bold text-foreground">
                        {prediction ? 'Edit Your Prediction' : 'Make Your Prediction'}
                    </h3>
                </CardHeader>
                <CardBody className="space-y-6">
                    {error && (
                        <div className="text-danger text-sm p-3 bg-danger/10 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Main Race Predictions */}
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-4">Main Race</h4>
                        
                        {/* Pole Position */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="Pole Position"
                                    placeholder="Select driver for pole position"
                                    selectedKeys={formData.polePosition ? [formData.polePosition] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('polePosition', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {drivers.map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.polePosition.correct} pts</strong> if correct</p>
                            </div>
                        </div>

                        {/* Race Winner */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="Race Winner"
                                    placeholder="Select race winner"
                                    selectedKeys={formData.raceWinner ? [formData.raceWinner] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('raceWinner', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {getAvailableDrivers('raceWinner').map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.raceWinner.correct} pts</strong> if correct</p>
                            </div>
                        </div>

                        {/* 2nd Place */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="2nd Place"
                                    placeholder="Select 2nd place finisher"
                                    selectedKeys={formData.secondPlace ? [formData.secondPlace] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('secondPlace', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {getAvailableDrivers('secondPlace').map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.secondPlace.correct} pts</strong> if correct</p>
                                <p><strong>{SCORING_INFO.secondPlace.partial} pts</strong> if on podium</p>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="3rd Place"
                                    placeholder="Select 3rd place finisher"
                                    selectedKeys={formData.thirdPlace ? [formData.thirdPlace] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('thirdPlace', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {getAvailableDrivers('thirdPlace').map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.thirdPlace.correct} pts</strong> if correct</p>
                                <p><strong>{SCORING_INFO.thirdPlace.partial} pts</strong> if on podium</p>
                            </div>
                        </div>

                        {/* 4th Place */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="4th Place"
                                    placeholder="Select 4th place finisher"
                                    selectedKeys={formData.fourthPlace ? [formData.fourthPlace] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('fourthPlace', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {getAvailableDrivers('fourthPlace').map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.topFive.correct} pts</strong> if correct position</p>
                                <p><strong>{SCORING_INFO.topFive.partial} pts</strong> if in top 5</p>
                            </div>
                        </div>

                        {/* 5th Place */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <Select
                                    label="5th Place"
                                    placeholder="Select 5th place finisher"
                                    selectedKeys={formData.fifthPlace ? [formData.fifthPlace] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        handleSelectChange('fifthPlace', selectedKey || '');
                                    }}
                                    isRequired
                                    isDisabled={isDisabled}
                                >
                                    {getAvailableDrivers('fifthPlace').map((driver) => (
                                        <SelectItem key={driver.id}>
                                            #{driver.number} {driver.fullname}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="text-sm text-default-600 flex flex-col justify-center">
                                <p><strong>{SCORING_INFO.topFive.correct} pts</strong> if correct position</p>
                                <p><strong>{SCORING_INFO.topFive.partial} pts</strong> if in top 5</p>
                            </div>
                        </div>
                    </div>

                    {/* Sprint Race Predictions */}
                    {race.hasSprint && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-lg font-semibold text-foreground mb-4">Sprint Race</h4>
                                
                                {/* Sprint Pole */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="md:col-span-2">
                                        <Select
                                            label="Sprint Pole Position"
                                            placeholder="Select driver for sprint pole"
                                            selectedKeys={formData.sprintPole ? [formData.sprintPole] : []}
                                            onSelectionChange={(keys) => {
                                                const selectedKey = Array.from(keys)[0] as string;
                                                handleSelectChange('sprintPole', selectedKey || '');
                                            }}
                                            isRequired
                                            isDisabled={isDisabled}
                                        >
                                            {drivers.map((driver) => (
                                                <SelectItem key={driver.id}>
                                                    #{driver.number} {driver.fullname}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="text-sm text-default-600 flex flex-col justify-center">
                                        <p><strong>{SCORING_INFO.sprintPole.correct} pts</strong> if correct</p>
                                    </div>
                                </div>

                                {/* Sprint Winner */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="md:col-span-2">
                                        <Select
                                            label="Sprint Winner"
                                            placeholder="Select sprint winner"
                                            selectedKeys={formData.sprintWinner ? [formData.sprintWinner] : []}
                                            onSelectionChange={(keys) => {
                                                const selectedKey = Array.from(keys)[0] as string;
                                                handleSelectChange('sprintWinner', selectedKey || '');
                                            }}
                                            isRequired
                                            isDisabled={isDisabled}
                                        >
                                            {drivers.map((driver) => (
                                                <SelectItem key={driver.id}>
                                                    #{driver.number} {driver.fullname}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="text-sm text-default-600 flex flex-col justify-center">
                                        <p><strong>{SCORING_INFO.sprintWinner.correct} pts</strong> if correct</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    {!isDisabled && (
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                isLoading={loading}
                                isDisabled={!isFormValid()}
                                className="font-semibold px-8"
                            >
                                {prediction ? 'Save Changes' : 'Create Prediction'}
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </form>
    );
}
