"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinOff, ArrowLeft } from "lucide-react";

export default function TripNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
      <p className="text-gray-500 max-w-md mb-6 text-sm">
        We couldn&apos;t find this trip itinerary. It may have expired or was removed.
      </p>
      <Link href="/create-new-trip">
        <Button className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Plan a New Trip
        </Button>
      </Link>
    </div>
  );
}
