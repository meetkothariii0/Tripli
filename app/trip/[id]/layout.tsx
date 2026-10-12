"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { TripProvider, useTrip } from "@/context/TripContext";
import {
  Calendar,
  Home,
  Coffee,
  Plane,
  Star,
  Share2,
  Printer,
  CalendarPlus,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { ShareDialog } from "@/components/ShareDialog";
import { downloadTripCalendar } from "@/lib/calendar";

function TripNavHeader() {
  const { trip, loading, isKept, toggleKept, title } = useTrip();
  const params = useParams();
  const pathname = usePathname();
  const id = params?.id as string;

  const [shareOpen, setShareOpen] = useState(false);

  const tabs = [
    { label: "Itinerary", href: `/trip/${id}/itinerary`, icon: Calendar },
    { label: "Stays", href: `/trip/${id}/stays`, icon: Home },
    { label: "Food", href: `/trip/${id}/food`, icon: Coffee },
    { label: "Transport", href: `/trip/${id}/transport`, icon: Plane },
    { label: "Reddit", href: `/trip/${id}/reddit`, icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-8"></div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadCalendar = () => {
    downloadTripCalendar(trip);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto pt-6 px-4 print:hidden">
        {/* Top Title & Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {title || `${trip.destination} Trip`}
              </h1>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                {trip.duration}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              From {trip.origin} • Budget: {trip.budget} ({trip.spending_style || "Mid-range"}) • {trip.group_size}
            </p>
          </div>

          {/* Action Buttons: Keep/Save, Share, PDF, Calendar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={isKept ? "default" : "outline"}
              size="sm"
              onClick={toggleKept}
              className={`gap-1.5 transition-all cursor-pointer ${
                isKept ? "bg-amber-500 hover:bg-amber-600 text-white font-bold" : "text-gray-700"
              }`}
            >
              <Star className={`w-4 h-4 ${isKept ? "fill-current animate-pulse text-white" : "text-amber-500"}`} />
              <span>{isKept ? "Kept" : "Keep / Save"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareOpen(true)}
              className="gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintPdf}
              className="gap-1.5"
              title="Download PDF via Print"
            >
              <Printer className="w-4 h-4" />
              PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCalendar}
              className="gap-1.5"
              title="Add to Calendar (.ics)"
            >
              <CalendarPlus className="w-4 h-4" />
              Calendar
            </Button>

            <SettingsDrawer />
          </div>
        </div>

        {/* 5 Tabs Navbar with Animated Indicator */}
        <div className="relative border-b border-gray-200">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none" aria-label="Trip Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`group relative inline-flex items-center py-4 px-1 text-sm font-semibold transition-colors shrink-0 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"}`} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <ShareDialog
        trip={trip}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return (
    <TripProvider>
      <div className="min-h-screen bg-slate-50/50 print:bg-white print:p-0">
        <TripNavHeader />
        <main className="max-w-6xl mx-auto py-6 px-4 print:p-0 print:max-w-none">{children}</main>
      </div>
    </TripProvider>
  );
}
