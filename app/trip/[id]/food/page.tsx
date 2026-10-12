"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrip } from "@/context/TripContext";
import { Restaurant } from "@/lib/providers/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  X,
  ExternalLink,
  MapPin,
  Utensils,
  PlusCircle,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";

export default function FoodPage() {
  const { trip, loading, addMealToDay, addActivityToDay } = useTrip();
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeParam = searchParams.get("place");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [fetchingFood, setFetchingFood] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(null);
  const [selectedDayToAdd, setSelectedDayToAdd] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("lunch");

  useEffect(() => {
    if (!trip?.destination) return;
    setFetchingFood(true);

    fetch(`/api/search/food?dest=${encodeURIComponent(trip.destination)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setRestaurants(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch food", err);
        toast.error("Could not load dining recommendations.");
      })
      .finally(() => setFetchingFood(false));
  }, [trip?.destination]);

  useEffect(() => {
    if (!placeParam || !restaurants.length) {
      setSelectedPlace(null);
      return;
    }
    const match = restaurants.find((r) => r.id === placeParam);
    if (match) setSelectedPlace(match);
  }, [placeParam, restaurants]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPlace) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlace]);

  const openDrawer = (r: Restaurant) => {
    const url = new URL(window.location.href);
    url.searchParams.set("place", r.id);
    router.push(url.pathname + url.search);
  };

  const closeDrawer = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("place");
    router.push(url.pathname + url.search);
  };

  const handleAddToDay = (r: Restaurant, dayNum: number, mealType: "breakfast" | "lunch" | "dinner") => {
    addMealToDay(dayNum, mealType, {
      name: r.name,
      address: `${r.cuisine} (${r.priceLevel})`,
      rating: r.rating,
      photo_url: r.images[0],
      google_maps_link: r.mapLink,
      place_id: r.placeId,
      sourceBadge: r.sourceBadge,
      isLive: r.isLive
    });
  };

  if (loading || fetchingFood) {
    return <div className="py-12 text-center text-gray-500">Loading food recommendations...</div>;
  }

  return (
    <div className="pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Culinary Highlights in {trip?.destination}
          </h2>
          <p className="text-sm text-gray-500">
            Verified dining spots, local specialties, and top-rated eateries. Click for details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((place) => (
          <div
            key={place.id}
            onClick={() => openDrawer(place)}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={place.images[0]}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border ${
                      place.isLive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white/90 text-gray-700 border-gray-200 backdrop-blur-xs"
                    }`}
                  >
                    {place.sourceBadge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {place.cuisine}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors mb-1">
                  {place.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="font-bold text-gray-800">{place.priceLevel}</span>
                  <span>•</span>
                  <span>Avg {place.currency} {place.avgCostForTwo} for two</span>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    ★ {place.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({place.reviewCount} reviews)
                  </span>
                  <Link
                    href={`/trip/${trip?.id}/reddit`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ml-auto"
                  >
                    Mentioned on Reddit (2)
                  </Link>
                </div>

                {place.mustTryDishes?.length > 0 && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">Must Try: </span>
                    {place.mustTryDishes.slice(0, 2).join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{place.openingHours}</span>
              <Button size="sm" variant="outline" className="text-xs font-semibold">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Shareable Detail Drawer via ?place=id */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border mb-2 inline-block ${
                    selectedPlace.isLive
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {selectedPlace.sourceBadge}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{selectedPlace.name}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDrawer}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden h-52 w-full border border-gray-200">
              <img
                src={selectedPlace.images[0]}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-4 flex-1 text-sm">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border">
                <div>
                  <div className="text-xs text-gray-500">Cuisine & Tier</div>
                  <div className="font-bold text-gray-900">
                    {selectedPlace.cuisine} ({selectedPlace.priceLevel})
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Rating</div>
                  <div className="font-bold text-amber-600">
                    ★ {selectedPlace.rating} ({selectedPlace.reviewCount} reviews)
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                  Must Try Dishes
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.mustTryDishes.map((dish, i) => (
                    <span
                      key={i}
                      className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-medium"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-gray-200 p-2.5 rounded-xl bg-gray-50">
                  <div className="text-gray-500">Hours</div>
                  <div className="font-semibold text-gray-800 mt-0.5">
                    {selectedPlace.openingHours}
                  </div>
                </div>
                <div className="border border-gray-200 p-2.5 rounded-xl bg-gray-50">
                  <div className="text-gray-500">Best Time</div>
                  <div className="font-semibold text-gray-800 mt-0.5">
                    {selectedPlace.bestTimeToVisit}
                  </div>
                </div>
              </div>

              {/* Add to day X meal action */}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Add to Day schedule as meal:
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={selectedDayToAdd}
                    onChange={(e) => setSelectedDayToAdd(Number(e.target.value))}
                    className="text-xs border border-gray-300 rounded-lg p-2 bg-white font-medium"
                  >
                    {trip?.itinerary.map((d) => (
                      <option key={d.day} value={d.day}>
                        Day {d.day}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as any)}
                    className="text-xs border border-gray-300 rounded-lg p-2 bg-white font-medium"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToDay(selectedPlace, selectedDayToAdd, selectedMealType)}
                  className="w-full gap-1 text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Update Day {selectedDayToAdd} {selectedMealType.toUpperCase()}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    closeDrawer();
                    router.push(`/trip/${trip?.id}/itinerary`);
                  }}
                >
                  View in Itinerary
                </Button>
                <a
                  href={selectedPlace.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-1.5">
                    View on Map <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
              <Button variant="ghost" size="sm" onClick={closeDrawer} className="text-xs text-gray-500">
                Close (Esc)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
