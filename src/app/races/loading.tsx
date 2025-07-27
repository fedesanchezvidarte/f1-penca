"use client";

import { Card, CardBody } from "@heroui/react";

export default function RacesLoading() {
    return (
        <div className="container mx-auto px-4 py-8 text-foreground">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Races</h1>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto races-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Card key={index} className="w-full h-32 bg-content1 border border-divider">
                            <CardBody className="p-4 flex flex-row justify-between items-start h-full">
                                {/* Left side skeleton */}
                                <div className="flex flex-col justify-between h-full flex-1">
                                    <div>
                                        <div className="h-3 w-16 bg-default-200 animate-pulse rounded mb-2"></div>
                                        <div className="h-4 w-32 bg-default-200 animate-pulse rounded"></div>
                                    </div>
                                    <div className="h-3 w-20 bg-default-200 animate-pulse rounded"></div>
                                </div>

                                {/* Right side skeleton */}
                                <div className="flex flex-col items-center justify-between h-full ml-4">
                                    <div className="flex flex-col items-center justify-center bg-content2 rounded-lg px-3 py-2 min-w-[60px]">
                                        <div className="h-3 w-12 bg-default-200 animate-pulse rounded mb-1"></div>
                                        <div className="h-6 w-8 bg-default-200 animate-pulse rounded"></div>
                                    </div>
                                    <div className="h-6 w-16 bg-default-200 animate-pulse rounded mt-2"></div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
