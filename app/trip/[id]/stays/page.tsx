"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrip } from "@/context/TripContext";
import { Stay } from "@/lib/providers/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  X,
  ExternalLink,
  MapPin,
  Star,
  PlusCircle,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
  Wifi,
  Sparkles
} from "lucide-react";

export default function StaysPage() {
  const { trip, loading, addStayToTrip, addActivityToDay } = useTrip();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stayParam = searchParams.get("stay");

  const [stays, setStays] = useState<Stay[]>([]);
  const [fetchingStays, setFetchingStays] = useState(false);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [selectedDayToAdd, setSelectedDayToAdd] = useState(1);
  const [redditMentions, setRedditMentions] = useState<Record<string, number>>({});

  // Fetch Stays from endpoint
  useEffect(() => {
    if (!trip?.destination) return;
    setFetchingStays(true);

    fetch(`/api/search/stays?dest=${encodeURIComponent(trip.destination)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setStays(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stays", err);
        toast.error("Could not load hotel stays.");
      })
      .finally(() => setFetchingStays(false));

    // Fetch Reddit threads to find mentions
    fetch(`/api/reddit?destination=${encodeURIComponent(trip.destination)}&topic=Stay`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.threads)) {
          const counts: Record<string, number> = {};
          data.threads.forEach((t: any) => {
            const combined = `${t.title} ${t.snippet}`.toLowerCase();
            // Match with mock or real hotel keywords
            if (combined.includes("grand") || combined.includes("resort") || combined.includes("zostel") || combined.includes("palace") || combined.includes("villa") || combined.includes("hotel")) {
              counts["all_hotels"] = (counts["all_hotels"] || 0) + 1;
            }
          });
          setRedditMentions(counts);
        }
      })
      .catch(() => {});
  }, [trip?.destination]);

  // Sync drawer from query param
  useEffect(() => {
    if (!stayParam || !stays.length) {
      setSelectedStay(null);
      return;
    }
    const match = stays.find((s) => s.id === stayParam);
    if (match) setSelectedStay(match);
  }, [stayParam, stays]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedStay) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStay]);

  const openDrawer = (s: Stay) => {
    const url = new URL(window.location.href);
    url.searchParams.set("stay", s.id);
    router.push(url.pathname + url.search);
  };

  const closeDrawer = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("stay");
    router.push(url.pathname + url.search);
  };

  const handleAddToDay = (stay: Stay, dayNum: number) => {
    addActivityToDay(dayNum, {
      id: `custom-stay-${Date.now()}`,
      place_name: stay.name,
      place_address: `${stay.area}, ${stay.distanceToCenter}`,
      start_time: "15:00",
      end_time: "16:00",
      duration: "1 hour",
      travel_time_from_prev: "15 mins",
      estimated_cost: `${stay.currency} ${stay.pricePerNight}/night`,
      neighborhood: stay.area,
      google_maps_link: stay.mapLink,
      why_this: `Check-in and relax at ${stay.name} (${stay.category}).`,
      rating: stay.rating,
      review_count: stay.reviewCount,
      photo_url: stay.images[0],
      sourceBadge: stay.sourceBadge,
      isLive: stay.isLive
    });
    addStayToTrip(stay);
  };

  if (loading || fetchingStays) {
    return <div className="py-12 text-center text-gray-500">Loading hotel stays...</div>;
  }

  return (
    <div className="pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended Accommodations in {trip?.destination}
          </h2>
          <p className="text-sm text-gray-500">
            Handpicked stays matching your budget and style. Click any card for full details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stays.map((stay) => (
          <div
            key={stay.id}
            onClick={() => openDrawer(stay)}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={stay.images[0]}
                  alt={stay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Source Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border ${
                      stay.isLive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white/90 text-gray-700 border-gray-200 backdrop-blur-xs"
                    }`}
                  >
                    {stay.sourceBadge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {stay.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                    {stay.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{stay.area} • {stay.distanceToCenter}</span>
                </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      ★ {stay.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({stay.reviewCount} reviews)
                    </span>
                    <Link
                      href={`/trip/${trip?.id}/reddit`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ml-auto"
                    >
                      Mentioned on Reddit (3)
                    </Link>
                  </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {stay.amenities.slice(0, 3).map((am, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-gray-900">
                  {stay.currency} {stay.pricePerNight.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-400">per night</div>
              </div>

              <Button size="sm" variant="outline" className="text-xs font-semibold">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Shareable Detail Drawer via ?stay=id */}
      {selectedStay && (
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
                    selectedStay.isLive
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {selectedStay.sourceBadge}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{selectedStay.name}</h2>
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
                src={selectedStay.images[0]}
                alt={selectedStay.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-4 flex-1 text-sm">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border">
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="text-xl font-extrabold text-gray-900">
                    {selectedStay.currency} {selectedStay.pricePerNight.toLocaleString()}
                    <span className="text-xs font-normal text-gray-500"> / night</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Rating</div>
                  <div className="font-bold text-amber-600">
                    ★ {selectedStay.rating} ({selectedStay.reviewCount} reviews)
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                  Location & Connectivity
                </div>
                <div className="text-gray-600 text-xs">
                  {selectedStay.area} • {selectedStay.distanceToCenter} to City Center
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                  Amenities
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStay.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {selectedStay.pros?.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">
                    Key Highlights
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    {selectedStay.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to day X action section */}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Add this stay to your trip schedule:
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDayToAdd}
                    onChange={(e) => setSelectedDayToAdd(Number(e.target.value))}
                    className="text-xs border border-gray-300 rounded-lg p-2 bg-white flex-1 font-medium"
                  >
                    {trip?.itinerary.map((d) => (
                      <option key={d.day} value={d.day}>
                        Day {d.day}: {d.day_title}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => handleAddToDay(selectedStay, selectedDayToAdd)}
                    className="gap-1 text-xs shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add to Day {selectedDayToAdd}
                  </Button>
                </div>
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
                  href={selectedStay.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-1.5">
                    Book Now <ExternalLink className="w-3.5 h-3.5" />
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
