"use client";

import React, { useState, useEffect } from "react";
import { useTrip } from "@/context/TripContext";
import { Flight, Train } from "@/lib/providers/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Plane,
  Train as TrainIcon,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function TransportPage() {
  const { trip, loading } = useTrip();

  const [activeTab, setActiveTab] = useState<"flights" | "trains">("flights");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (!trip) return;
    setFetchingData(true);

    const origin = trip.origin || "Bengaluru";
    const dest = trip.destination || "Goa";

    Promise.all([
      fetch(`/api/search/flights?origin=${encodeURIComponent(origin)}&dest=${encodeURIComponent(dest)}`)
        .then((res) => res.json())
        .then((d) => (Array.isArray(d.data) ? d.data : [])),
      fetch(`/api/search/trains?origin=${encodeURIComponent(origin)}&dest=${encodeURIComponent(dest)}`)
        .then((res) => res.json())
        .then((d) => (Array.isArray(d.data) ? d.data : []))
    ])
      .then(([flightData, trainData]) => {
        setFlights(flightData);
        setTrains(trainData);
      })
      .catch((err) => {
        console.error("Failed to fetch transport", err);
        toast.error("Could not fetch transit connections.");
      })
      .finally(() => setFetchingData(false));
  }, [trip]);

  if (loading || fetchingData) {
    return <div className="py-12 text-center text-gray-500">Checking transit options...</div>;
  }

  return (
    <div className="pb-16">
      {/* Flexibility banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            Travel Flexibility Insights ({trip?.origin} ➔ {trip?.destination})
          </div>
          <p className="text-xs text-blue-700 mt-0.5">
            Prices displayed for your selected window. You can easily switch between Flights and Trains below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === "flights" ? "default" : "outline"}
            onClick={() => setActiveTab("flights")}
            className="text-xs"
          >
            <Plane className="w-3.5 h-3.5 mr-1" /> Flights
          </Button>
          <Button
            size="sm"
            variant={activeTab === "trains" ? "default" : "outline"}
            onClick={() => setActiveTab("trains")}
            className="text-xs"
          >
            <TrainIcon className="w-3.5 h-3.5 mr-1" /> Trains
          </Button>
        </div>
      </div>

      {activeTab === "flights" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Available Flight Routes</span>
            <span>{flights.length} flights found</span>
          </div>

          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-xs transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={flight.airlineLogo}
                  alt={flight.airlineName}
                  className="w-12 h-12 rounded-full border border-gray-100 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-gray-900">{flight.airlineName}</h3>
                    {/* Source Badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        flight.isLive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {flight.sourceBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-gray-800">
                      {flight.departureTime} – {flight.arrivalTime}
                    </span>
                    <span>•</span>
                    <span>
                      {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m
                    </span>
                    <span>•</span>
                    <span>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</span>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-1">{flight.baggage}</div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-left md:text-right">
                  <div className="text-2xl font-black text-gray-900">
                    {flight.currency} {flight.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400">per passenger</div>
                </div>

                <a
                  href={flight.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-1.5 text-xs font-semibold">
                    Select Flight <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Direct & Express Train Schedules</span>
            <span>{trains.length} trains found</span>
          </div>

          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-xs transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900">{train.trainName}</h3>
                  <span className="text-xs text-gray-400 font-mono">#{train.trainNumber}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      train.isLive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {train.sourceBadge}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="font-semibold text-gray-800">
                    {train.departureTime} – {train.arrivalTime}
                  </span>
                  <span>•</span>
                  <span>
                    {Math.floor(train.durationMinutes / 60)}h {train.durationMinutes % 60}m
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {train.classes.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {c.className}: ₹{c.price} ({c.availability})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <a
                  href={train.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-1.5 text-xs font-semibold">
                    Book on IRCTC <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
