"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LegacyTripDetailsRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id") || searchParams.get("tripId");

  useEffect(() => {
    if (tripId) {
      router.replace(`/trip/${tripId}/itinerary`);
    } else {
      router.replace("/create-new-trip");
    }
  }, [tripId, router]);

  return (
    <div className="py-20 text-center text-gray-500">
      Redirecting to trip itinerary...
    </div>
  );
}

export default function LegacyTripDetailsRedirect() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <LegacyTripDetailsRedirectInner />
    </Suspense>
  );
}
