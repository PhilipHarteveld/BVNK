"use client";

import { AlertTriangle } from "lucide-react";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f9] px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle data-testid="alert-icon" className="text-red-500 w-8 h-8" />
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-2">Payment details expired</h1>
        <p className="text-sm text-gray-600">
          The payment details for your transaction have expired.
        </p>
      </div>
    </div>
  );
}
