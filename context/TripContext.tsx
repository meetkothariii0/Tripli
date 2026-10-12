"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { TripPlan, ActivityItem, MealItem, Stay, Restaurant } from "@/lib/providers/types";
import { tripStore } from "@/lib/tripStore";

interface TripContextType {
  trip: TripPlan | null;
  loading: boolean;
  isKept: boolean;
  toggleKept: () => void;
  title: string;
  updateTitle: (newTitle: string) => void;
  addActivityToDay: (dayNum: number, activity: ActivityItem) => void;
  addMealToDay: (dayNum: number, mealType: "breakfast" | "lunch" | "dinner", meal: MealItem) => void;
  addStayToTrip: (stay: Stay) => void;
  updateTrip: (updated: TripPlan) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string | undefined;

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isKept, setIsKept] = useState(false);
  const [title, setTitle] = useState("");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync from tripStore
  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      const loaded = tripStore.get(tripId);
      if (loaded) {
        setTrip(loaded);
        const indexList = tripStore.list();
        const foundMeta = indexList.find((i) => i.id === tripId);
        setIsKept(foundMeta?.kept ?? false);
        setTitle(foundMeta?.title || `${loaded.destination} · ${loaded.durationDays || 3} days`);
        setLoading(false);
        return;
      }

      // If id is missing from storage
      toast.error("Trip not found. Redirecting to My Trips.");
      router.replace("/trips");
    } catch (e) {
      console.error("Failed to load trip from store", e);
      toast.error("Error loading trip.");
      router.replace("/trips");
    } finally {
      setLoading(false);
    }
  }, [tripId, router]);

  // Debounced auto-save (500ms) to tripStore
  const debouncedSave = useCallback((tripToSave: TripPlan, tripTitle?: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      tripStore.save(tripToSave, tripTitle);
    }, 500);
  }, []);

  const updateTrip = useCallback(
    (newTrip: TripPlan) => {
      setTrip(newTrip);
      debouncedSave(newTrip, title || undefined);
    },
    [debouncedSave, title]
  );

  const toggleKept = useCallback(() => {
    if (!trip?.id) return;
    const nextKept = !isKept;
    setIsKept(nextKept);
    tripStore.setKept(trip.id, nextKept);
    toast.success(nextKept ? "Trip marked as Kept!" : "Trip moved to Drafts.");
  }, [trip?.id, isKept]);

  const updateTitle = useCallback(
    (newTitle: string) => {
      if (!trip?.id || !newTitle.trim()) return;
      setTitle(newTitle.trim());
      tripStore.rename(trip.id, newTitle.trim());
      toast.success("Trip renamed!");
    },
    [trip?.id]
  );

  const addActivityToDay = useCallback(
    (dayNum: number, activity: ActivityItem) => {
      if (!trip) return;
      const updatedItinerary = trip.itinerary.map((d) => {
        if (d.day === dayNum) {
          return {
            ...d,
            activities: [...d.activities, activity]
          };
        }
        return d;
      });

      const updatedTrip = { ...trip, itinerary: updatedItinerary };
      updateTrip(updatedTrip);
      toast.success(`Added "${activity.place_name}" to Day ${dayNum}!`);
    },
    [trip, updateTrip]
  );

  const addMealToDay = useCallback(
    (dayNum: number, mealType: "breakfast" | "lunch" | "dinner", meal: MealItem) => {
      if (!trip) return;
      const updatedItinerary = trip.itinerary.map((d) => {
        if (d.day === dayNum) {
          return {
            ...d,
            meals: {
              ...d.meals,
              [mealType]: meal
            }
          };
        }
        return d;
      });

      const updatedTrip = { ...trip, itinerary: updatedItinerary };
      updateTrip(updatedTrip);
      toast.success(`Updated ${mealType} for Day ${dayNum} to "${meal.name}"!`);
    },
    [trip, updateTrip]
  );

  const addStayToTrip = useCallback(
    (stay: Stay) => {
      if (!trip) return;
      const currentStays = trip.stays || [];
      const exists = currentStays.some((s) => s.id === stay.id);
      const updatedStays = exists ? currentStays : [stay, ...currentStays];
      const updatedTrip = { ...trip, stays: updatedStays };
      updateTrip(updatedTrip);
      toast.success(`Saved "${stay.name}" to trip stays!`);
    },
    [trip, updateTrip]
  );

  return (
    <TripContext.Provider
      value={{
        trip,
        loading,
        isKept,
        toggleKept,
        title,
        updateTitle,
        addActivityToDay,
        addMealToDay,
        addStayToTrip,
        updateTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
