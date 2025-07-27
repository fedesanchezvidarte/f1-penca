"use client";

import React from "react";
import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="lg" color="primary" />
        </div>
    );
}
