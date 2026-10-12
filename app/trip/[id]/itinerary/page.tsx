"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrip } from "@/context/TripContext";
import { ActivityItem, DayItinerary } from "@/lib/providers/types";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Compass,
  ChevronRight,
  X,
  ExternalLink,
  Utensils,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

function ItineraryPageInner() {
  const { trip, loading } = useTrip();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityParam = searchParams.get("activity");

  const [activeDay, setActiveDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // Sync selected activity drawer from URL query param
  useEffect(() => {
    if (!trip || !activityParam) {
      setSelectedActivity(null);
      return;
    }

    for (const day of trip.itinerary) {
      const match = day.activities.find((a) => a.id === activityParam);
      if (match) {
        setSelectedActivity(match);
        return;
      }
    }
  }, [trip, activityParam]);

  // Handle Esc key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedActivity) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedActivity]);

  // Scroll spy for sticky day chips
  useEffect(() => {
    if (!trip?.itinerary?.length) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (const day of trip.itinerary) {
        const el = document.getElementById(`day-${day.day}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveDay(day.day);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trip]);

  const openDrawer = (act: ActivityItem) => {
    const url = new URL(window.location.href);
    url.searchParams.set("activity", act.id);
    router.push(url.pathname + url.search);
  };

  const closeDrawer = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("activity");
    router.push(url.pathname + url.search);
  };

  const scrollToDay = (dayNum: number) => {
    const el = document.getElementById(`day-${dayNum}`);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveDay(dayNum);
    }
  };

  const scrollToCard = (actId: string) => {
    const el = document.getElementById(`act-card-${actId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading itinerary...</div>;
  }

  if (!trip || !trip.itinerary?.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        No itinerary available for this trip.
      </div>
    );
  }

  // All activities for pins overview
  const allActivities: ActivityItem[] = trip.itinerary.flatMap((d) => d.activities);

  return (
    <div className="relative pb-16">
      {/* Sticky Day Selector Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md py-3 border-b border-gray-200 mb-8 shadow-xs -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-2">
            Days:
          </span>
          {trip.itinerary.map((d) => {
            const isCurrent = activeDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => scrollToDay(d.day)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Day {d.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Itinerary Days List */}
        <div className="lg:col-span-2 space-y-10">
          {trip.itinerary.map((dayPlan: DayItinerary) => (
            <section
              key={dayPlan.day}
              id={`day-${dayPlan.day}`}
              className="scroll-mt-36 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 mb-6 gap-2">
                <div>
                  <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
                    Day {dayPlan.day}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{dayPlan.day_title}</h2>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-700">Transport: </span>
                  {dayPlan.recommended_transport}
                </div>
              </div>

              {/* Local Tip Box */}
              {dayPlan.local_tip && (
                <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Local Insider Tip: </span>
                    {dayPlan.local_tip}
                  </div>
                </div>
              )}

              {/* Day Activities */}
              <div className="space-y-4">
                {dayPlan.activities.map((act: ActivityItem, idx: number) => {
                  const isSelected = selectedActivity?.id === act.id;

                  return (
                    <div
                      key={act.id}
                      id={`act-card-${act.id}`}
                      onClick={() => openDrawer(act)}
                      className={`group border rounded-xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-xs bg-white"
                      }`}
                    >
                      {/* Time slot badge */}
                      <div className="sm:w-28 shrink-0 flex sm:flex-col justify-between sm:justify-start gap-1">
                        <div className="flex items-center text-xs font-bold text-gray-700">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {act.start_time} - {act.end_time}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium">
                          {act.duration}
                        </div>
                        {idx > 0 && (
                          <div className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">
                            +{act.travel_time_from_prev} travel
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">
                            {act.place_name}
                          </h3>

                          {/* Source Badge */}
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${
                              act.isLive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {act.sourceBadge}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {act.place_address}
                        </p>

                        <p className="text-xs text-gray-700 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {act.why_this}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                          {act.rating && (
                            <span className="font-bold text-amber-600">
                              ★ {act.rating} {act.review_count ? `(${act.review_count})` : ""}
                            </span>
                          )}
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            Cost: {act.estimated_cost}
                          </span>
                          <span className="text-primary text-[11px] font-semibold flex items-center group-hover:underline ml-auto">
                            Details & Map <ChevronRight className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day Meals Section */}
              {dayPlan.meals && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                    <Utensils className="w-3.5 h-3.5 text-primary" />
                    Recommended Dining for Day {dayPlan.day}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
                      const meal = dayPlan.meals[mealKey];
                      if (!meal) return null;
                      return (
                        <div
                          key={mealKey}
                          className="bg-gray-50/70 border border-gray-200 rounded-xl p-3 flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                              {mealKey}
                            </span>
                            <div className="font-bold text-sm text-gray-900 mt-0.5">
                              {meal.name}
                            </div>
                            <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                              {meal.address}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 text-[10px]">
                            <span className="text-gray-500">
                              {meal.sourceBadge || "Sample data"}
                            </span>
                            {meal.google_maps_link && (
                              <a
                                href={meal.google_maps_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-0.5"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Interactive Map & Pins Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-gray-900">Destination Map Pins</h3>
              </div>
              <span className="text-xs text-gray-500">
                {allActivities.length} resolved stops
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Stops ordered by coordinates nearest-neighbour to avoid zig-zagging. Click any pin to jump to its card.
            </p>

            {/* Visual Pin List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {allActivities.map((act) => {
                const isSelected = selectedActivity?.id === act.id;

                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      scrollToCard(act.id);
                      openDrawer(act);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-[1.01]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          isSelected ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs truncate">{act.place_name}</span>
                    </div>

                    <span className="text-[10px] text-gray-500 shrink-0 ml-1">
                      {act.estimated_cost}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  trip.destination
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 text-xs text-primary font-semibold hover:underline"
              >
                Open {trip.destination} in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer (query param ?activity=id) */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border mb-2 inline-block ${
                    selectedActivity.isLive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {selectedActivity.sourceBadge}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedActivity.place_name}
                </h2>
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

            {selectedActivity.photo_url && (
              <div className="mt-4 rounded-xl overflow-hidden h-48 w-full border border-gray-200">
                <img
                  src={selectedActivity.photo_url}
                  alt={selectedActivity.place_name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 space-y-4 flex-1 text-sm">
              <div>
                <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                  Address
                </div>
                <div className="text-gray-600">{selectedActivity.place_address}</div>
              </div>

              <div>
                <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                  Why Visit
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-gray-800">
                  {selectedActivity.why_this}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 p-3 rounded-xl bg-gray-50">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-bold text-gray-800 mt-0.5">
                    {selectedActivity.duration}
                  </div>
                </div>
                <div className="border border-gray-200 p-3 rounded-xl bg-gray-50">
                  <div className="text-xs text-gray-500">Estimated Cost</div>
                  <div className="font-bold text-gray-800 mt-0.5">
                    {selectedActivity.estimated_cost}
                  </div>
                </div>
              </div>

              {selectedActivity.rating && (
                <div className="border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Google Rating</span>
                  <span className="font-bold text-amber-600">
                    ★ {selectedActivity.rating} (
                    {selectedActivity.review_count || "verified"} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDrawer}
              >
                Close (Esc)
              </Button>
              <a
                href={selectedActivity.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View on Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading itinerary...</div>}>
      <ItineraryPageInner />
    </Suspense>
  );
}
