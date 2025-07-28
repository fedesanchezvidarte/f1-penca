"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Select, SelectItem, Button, Divider } from "@heroui/react";
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

    const getAvailableDrivers = () => {
        // Always return all drivers - users should be able to select the same driver
        // for multiple positions (e.g., pole position winner also winning the race)
        return drivers;
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
                        <div className="mb-4">
                            <Select
                                id="pole-position"
                                name="polePosition"
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
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Race Winner */}
                        <div className="mb-4">
                            <Select
                                id="race-winner"
                                name="raceWinner"
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
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* 2nd Place */}
                        <div className="mb-4">
                            <Select
                                id="second-place"
                                name="secondPlace"
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
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* 3rd Place */}
                        <div className="mb-4">
                            <Select
                                id="third-place"
                                name="thirdPlace"
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
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* 4th Place */}
                        <div className="mb-4">
                            <Select
                                id="fourth-place"
                                name="fourthPlace"
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
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* 5th Place */}
                        <div className="mb-4">
                            <Select
                                id="fifth-place"
                                name="fifthPlace"
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
                                {getAvailableDrivers().map((driver) => (
                                    <SelectItem 
                                        key={driver.id}
                                        textValue={`#${driver.number} ${driver.fullname}`}
                                    >
                                        #{driver.number} {driver.fullname}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Sprint Race Predictions */}
                    {race.hasSprint && (
                        <>
                            <Divider />
                            <div>
                                <h4 className="text-lg font-semibold text-foreground mb-4 ml-3">Sprint Race</h4>
                                
                                {/* Sprint Pole */}
                                <div className="mb-4">
                                    <Select
                                        id="sprint-pole"
                                        name="sprintPole"
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
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {/* Sprint Winner */}
                                <div className="mb-4">
                                    <Select
                                        id="sprint-winner"
                                        name="sprintWinner"
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
                                            <SelectItem 
                                                key={driver.id}
                                                textValue={`#${driver.number} ${driver.fullname}`}
                                            >
                                                #{driver.number} {driver.fullname}
                                            </SelectItem>
                                        ))}
                                    </Select>
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
