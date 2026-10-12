"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tripStore, TripIndexItem } from "@/lib/tripStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  Trash2,
  Copy,
  Share2,
  Edit2,
  ExternalLink,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock
} from "lucide-react";

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripIndexItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "kept">("kept");

  // Inline rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // Delete confirm dialog
  const [deleteConfirmTrip, setDeleteConfirmTrip] = useState<TripIndexItem | null>(null);

  // Clear drafts confirm dialog
  const [clearDraftsConfirmOpen, setClearDraftsConfirmOpen] = useState(false);

  const loadTrips = () => {
    const list = tripStore.list();
    setTrips(list);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleToggleKept = (id: string, currentKept: boolean) => {
    tripStore.setKept(id, !currentKept);
    loadTrips();
    toast.success(!currentKept ? "Pinned as Kept!" : "Moved to Drafts.");
  };

  const handleStartRename = (trip: TripIndexItem) => {
    setRenamingId(trip.id);
    setNewTitle(trip.title);
  };

  const handleSaveRename = (id: string) => {
    if (newTitle.trim()) {
      tripStore.rename(id, newTitle.trim());
      loadTrips();
      toast.success("Trip renamed!");
    }
    setRenamingId(null);
  };

  const handleDuplicate = (id: string) => {
    const dup = tripStore.duplicate(id);
    if (dup) {
      loadTrips();
      toast.success("Trip duplicated!");
    }
  };

  const handleDelete = (trip: TripIndexItem) => {
    const { removedItem, tripData } = tripStore.remove(trip.id);
    loadTrips();
    setDeleteConfirmTrip(null);

    // 6s undo toast
    toast(`Deleted "${trip.title}"`, {
      duration: 6000,
      action: {
        label: "Undo",
        onClick: () => {
          if (tripData) {
            tripStore.save(tripData, removedItem?.title);
            if (removedItem?.kept) tripStore.setKept(tripData.id, true);
            loadTrips();
            toast.success("Trip restored!");
          }
        }
      }
    });
  };

  const handleClearDrafts = () => {
    const count = tripStore.clearDrafts();
    loadTrips();
    setClearDraftsConfirmOpen(false);
    toast.success(`Cleared ${count} draft trip${count === 1 ? "" : "s"}.`);
  };

  // Filter and sort
  const filtered = trips.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "kept") {
      if (a.kept && !b.kept) return -1;
      if (!a.kept && b.kept) return 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const draftCount = trips.filter((t) => !t.kept).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              My Trips
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {trips.length} Saved
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage your itineraries, pin your favorites, and share adventures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {draftCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDraftsConfirmOpen(true)}
              className="text-xs text-gray-600 hover:text-red-600"
            >
              Clear Drafts ({draftCount})
            </Button>
          )}

          <Link href="/create-new-trip">
            <Button className="gap-2 shadow-xs">
              <Plus className="w-4 h-4" />
              Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      {trips.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-8 bg-gray-50 border border-gray-200 p-3 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search destination or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="text-gray-500 font-medium">Sort by:</span>
            <Button
              variant={sortBy === "kept" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("kept")}
              className="h-8 text-xs"
            >
              Kept First
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="h-8 text-xs"
            >
              Recent
            </Button>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips saved yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Generate customized AI travel plans with resolved real-world attractions, hotels, and flight options.
          </p>
          <Link href="/create-new-trip">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Plan your first trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((trip) => {
            const timeAgo = formatDistanceToNow(new Date(trip.updatedAt), { addSuffix: true });

            return (
              <div
                key={trip.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Cover image & badges */}
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={trip.coverImage}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Kept or Draft Badge */}
                    <div className="absolute top-3 left-3 flex gap-2 items-center">
                      {trip.kept ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          <Star className="w-3 h-3 fill-current" /> Kept
                        </span>
                      ) : (
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Star Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleKept(trip.id, trip.kept)}
                      aria-label="Toggle Keep"
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                        trip.kept
                          ? "bg-amber-400 text-white"
                          : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${trip.kept ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    {/* Inline Rename or Title */}
                    {renamingId === trip.id ? (
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(trip.id);
                          }}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          className="h-8 text-xs shrink-0"
                          onClick={() => handleSaveRename(trip.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {trip.title}
                        </h2>
                        <button
                          type="button"
                          onClick={() => handleStartRename(trip)}
                          className="text-gray-400 hover:text-gray-700 p-1"
                          aria-label="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{trip.destination}</span>
                      <span>•</span>
                      <span>{trip.days} days</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-t border-gray-100">
                      <div>
                        <div className="text-gray-400 text-[10px] uppercase font-semibold">
                          Estimated Cost
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{trip.totalCost}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-[10px] uppercase font-semibold flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" /> Updated
                        </div>
                        <div className="text-gray-500 text-xs">{timeAgo}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(trip.id)}
                      title="Duplicate Trip"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmTrip(trip)}
                      title="Delete Trip"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/trip/${trip.id}/itinerary`}>
                    <Button size="sm" className="text-xs font-semibold gap-1.5">
                      Open Trip <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setDeleteConfirmTrip(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl z-10">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg text-gray-900">Delete Trip?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>&quot;{deleteConfirmTrip.title}&quot;</strong>? You will have 6 seconds to undo this action.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmTrip(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(deleteConfirmTrip)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Drafts Confirmation Dialog */}
      {clearDraftsConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setClearDraftsConfirmOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl z-10">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg text-gray-900">Clear Draft Trips?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will remove all <strong>{draftCount}</strong> unpinned draft trips. All trips marked as <strong>Kept (Starred)</strong> will be preserved.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClearDraftsConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearDrafts}
              >
                Clear All Drafts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
