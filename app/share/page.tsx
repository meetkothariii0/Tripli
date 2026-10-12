"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LZString from "lz-string";
import { TripPlan } from "@/lib/providers/types";
import { tripStore } from "@/lib/tripStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sparkles,
  Download,
  AlertTriangle,
  Calendar,
  Home,
  Coffee,
  Plane,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function SharePage() {
  const router = useRouter();
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "stays" | "food" | "transport">("itinerary");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      setError(true);
      return;
    }

    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(hash);
      if (!decompressed) {
        setError(true);
        return;
      }

      const parsed = JSON.parse(decompressed);
      if (!parsed || !parsed.destination) {
        setError(true);
        return;
      }

      setTrip(parsed);
    } catch (e) {
      console.error("Corrupted shared trip link:", e);
      setError(true);
    }
  }, []);

  const handleSaveToMyTrips = () => {
    if (!trip) return;
    setSaving(true);
    try {
      const newId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const importedTrip: TripPlan = {
        ...trip,
        id: newId,
        createdAt: new Date().toISOString()
      };

      const days = importedTrip.durationDays || importedTrip.itinerary?.length || 3;
      tripStore.save(importedTrip, `${importedTrip.destination} · ${days} day${days > 1 ? "s" : ""}`);
      tripStore.setKept(newId, true);

      toast.success("Trip saved to your trips!");
      router.push(`/trip/${newId}/itinerary`);
    } catch (e) {
      console.error("Failed to save shared trip:", e);
      toast.error("Could not save trip.");
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-gray-200 rounded-3xl text-center shadow-xs">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
        <p className="text-sm text-gray-500 mb-6">
          This share link seems to be incomplete or corrupted. Try requesting an updated link from the sender.
        </p>
        <Link href="/create-new-trip">
          <Button className="w-full gap-2">
            Plan your own trip <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (!trip) {
    return <div className="py-20 text-center text-gray-400">Loading shared trip plan...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
            Shared Itinerary (Read-Only)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{trip.destination} Trip</h1>
          <p className="text-white/80 text-xs mt-1">
            {trip.duration} • Budget: {trip.budget} ({trip.spending_style || "Mid-range"})
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleSaveToMyTrips}
          disabled={saving}
          className="bg-white text-blue-800 hover:bg-blue-50 font-bold gap-2 shrink-0 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          {saving ? "Saving..." : "Save to My Trips"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-6 text-sm font-semibold">
        {(["itinerary", "stays", "food", "transport"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div className="space-y-8">
          {trip.itinerary?.map((day) => (
            <div key={day.day} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Day {day.day}: {day.day_title}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {day.recommended_transport}
                </span>
              </div>

              {day.local_tip && (
                <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-xl mb-4">
                  <strong>Tip: </strong> {day.local_tip}
                </div>
              )}

              <div className="space-y-3">
                {day.activities?.map((act) => (
                  <div key={act.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50 flex flex-col sm:flex-row gap-3">
                    <div className="text-xs font-bold text-gray-500 sm:w-28 shrink-0">
                      {act.start_time} - {act.end_time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900">{act.place_name}</h4>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                          {act.sourceBadge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{act.place_address}</p>
                      <p className="text-xs text-gray-700 mt-1">{act.why_this}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stays Tab */}
      {activeTab === "stays" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trip.stays?.map((stay) => (
            <div key={stay.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <img src={stay.images[0]} alt={stay.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-base text-gray-900 mb-1">{stay.name}</h4>
                <div className="text-xs text-gray-500 mb-2">{stay.area} • {stay.category}</div>
                <div className="font-black text-gray-900 text-base">
                  {stay.currency} {stay.pricePerNight?.toLocaleString()} / night
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food Tab */}
      {activeTab === "food" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trip.restaurants?.map((rest) => (
            <div key={rest.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <img src={rest.images[0]} alt={rest.name} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-base text-gray-900 mb-1">{rest.name}</h4>
                <div className="text-xs text-gray-500 mb-2">{rest.cuisine} • {rest.priceLevel}</div>
                <div className="text-xs text-gray-700">Must try: {rest.mustTryDishes?.slice(0, 2).join(", ")}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transport Tab */}
      {activeTab === "transport" && (
        <div className="space-y-4">
          {trip.flights?.map((flight) => (
            <div key={flight.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={flight.airlineLogo} alt={flight.airlineName} className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{flight.airlineName}</h4>
                  <div className="text-xs text-gray-500">{flight.departureTime} - {flight.arrivalTime}</div>
                </div>
              </div>
              <div className="text-right font-black text-gray-900">
                {flight.currency} {flight.price?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
