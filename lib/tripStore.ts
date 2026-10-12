import { z } from "zod";
import { TripPlan } from "./providers/types";

export const TripIndexItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  destination: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  days: z.number(),
  totalCost: z.string(),
  coverImage: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  kept: z.boolean().default(false)
});

export type TripIndexItem = z.infer<typeof TripIndexItemSchema>;

const INDEX_KEY = "tripli:index";
const TRIP_KEY_PREFIX = "tripli:trip:";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function calculateTripTotalCost(trip: TripPlan): string {
  let total = 0;
  const numDays = trip.durationDays || trip.itinerary?.length || 1;

  if (trip.stays && trip.stays.length > 0) {
    total += (trip.stays[0].pricePerNight || 2500) * numDays;
  }
  if (trip.flights && trip.flights.length > 0) {
    total += trip.flights[0].price || 4500;
  }

  // Activity costs
  trip.itinerary?.forEach((d) => {
    d.activities?.forEach((a) => {
      const match = a.estimated_cost?.match(/\d+/g);
      if (match) total += parseInt(match.join(""), 10);
    });
  });

  return total > 0 ? `₹${total.toLocaleString("en-IN")}` : trip.budget || "₹35,000";
}

export function generateAutoTitle(destination: string, days: number): string {
  return `${destination} · ${days} day${days > 1 ? "s" : ""}`;
}

export const tripStore = {
  list(): TripIndexItem[] {
    if (!isBrowser()) return [];
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const validated: TripIndexItem[] = [];
      for (const item of parsed) {
        const res = TripIndexItemSchema.safeParse(item);
        if (res.success) {
          validated.push(res.data);
        }
      }
      return validated;
    } catch (e) {
      console.error("tripStore.list error:", e);
      return [];
    }
  },

  get(id: string): TripPlan | null {
    if (!isBrowser()) return null;
    try {
      const raw = localStorage.getItem(`${TRIP_KEY_PREFIX}${id}`);
      if (!raw) {
        // Fallback check on old key
        const legacy = localStorage.getItem(`trip_${id}`);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          tripStore.save(parsed);
          return parsed;
        }
        return null;
      }
      return JSON.parse(raw) as TripPlan;
    } catch (e) {
      console.error("tripStore.get error:", e);
      return null;
    }
  },

  save(trip: TripPlan, manualTitle?: string): TripIndexItem | null {
    if (!isBrowser() || !trip?.id) return null;
    try {
      const days = trip.durationDays || trip.itinerary?.length || 1;
      const title = manualTitle || generateAutoTitle(trip.destination, days);
      const totalCost = calculateTripTotalCost(trip);
      const coverImage =
        trip.stays?.[0]?.images?.[0] ||
        trip.itinerary?.[0]?.activities?.[0]?.photo_url ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80";

      const currentList = this.list();
      const existing = currentList.find((item) => item.id === trip.id);

      const indexItem: TripIndexItem = {
        id: trip.id,
        title: existing?.title || title,
        destination: trip.destination,
        startDate: trip.dates?.split("to")?.[0]?.replace("From", "")?.trim(),
        endDate: trip.dates?.split("to")?.[1]?.trim(),
        days,
        totalCost,
        coverImage,
        createdAt: existing?.createdAt || trip.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        kept: existing?.kept ?? false
      };

      // Save trip JSON
      localStorage.setItem(`${TRIP_KEY_PREFIX}${trip.id}`, JSON.stringify(trip));
      // Save legacy mirror key so existing components don't break
      localStorage.setItem(`trip_${trip.id}`, JSON.stringify(trip));

      // Update Index
      const updatedList = [indexItem, ...currentList.filter((item) => item.id !== trip.id)];
      localStorage.setItem(INDEX_KEY, JSON.stringify(updatedList));

      return indexItem;
    } catch (e) {
      console.error("tripStore.save error:", e);
      return null;
    }
  },

  remove(id: string): { removedItem: TripIndexItem | null; tripData: TripPlan | null } {
    if (!isBrowser()) return { removedItem: null, tripData: null };
    try {
      const currentList = this.list();
      const itemToRemove = currentList.find((item) => item.id === id) || null;
      const tripData = this.get(id);

      const updatedList = currentList.filter((item) => item.id !== id);
      localStorage.setItem(INDEX_KEY, JSON.stringify(updatedList));
      localStorage.removeItem(`${TRIP_KEY_PREFIX}${id}`);
      localStorage.removeItem(`trip_${id}`);

      return { removedItem: itemToRemove, tripData };
    } catch (e) {
      console.error("tripStore.remove error:", e);
      return { removedItem: null, tripData: null };
    }
  },

  rename(id: string, newTitle: string): boolean {
    if (!isBrowser() || !newTitle.trim()) return false;
    try {
      const currentList = this.list();
      const target = currentList.find((item) => item.id === id);
      if (!target) return false;

      target.title = newTitle.trim();
      target.updatedAt = new Date().toISOString();

      localStorage.setItem(INDEX_KEY, JSON.stringify(currentList));
      return true;
    } catch (e) {
      console.error("tripStore.rename error:", e);
      return false;
    }
  },

  duplicate(id: string): TripPlan | null {
    if (!isBrowser()) return null;
    try {
      const original = this.get(id);
      if (!original) return null;

      const newId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const duplicatedTrip: TripPlan = {
        ...original,
        id: newId,
        createdAt: new Date().toISOString()
      };

      const originalIndex = this.list().find((item) => item.id === id);
      const newTitle = originalIndex ? `${originalIndex.title} (Copy)` : `${original.destination} (Copy)`;

      this.save(duplicatedTrip, newTitle);
      return duplicatedTrip;
    } catch (e) {
      console.error("tripStore.duplicate error:", e);
      return null;
    }
  },

  setKept(id: string, kept: boolean): boolean {
    if (!isBrowser()) return false;
    try {
      const currentList = this.list();
      const target = currentList.find((item) => item.id === id);
      if (!target) return false;

      target.kept = kept;
      target.updatedAt = new Date().toISOString();

      localStorage.setItem(INDEX_KEY, JSON.stringify(currentList));
      return true;
    } catch (e) {
      console.error("tripStore.setKept error:", e);
      return false;
    }
  },

  clearDrafts(): number {
    if (!isBrowser()) return 0;
    try {
      const currentList = this.list();
      const drafts = currentList.filter((item) => !item.kept);
      for (const draft of drafts) {
        localStorage.removeItem(`${TRIP_KEY_PREFIX}${draft.id}`);
        localStorage.removeItem(`trip_${draft.id}`);
      }
      const keptList = currentList.filter((item) => item.kept);
      localStorage.setItem(INDEX_KEY, JSON.stringify(keptList));
      return drafts.length;
    } catch (e) {
      console.error("tripStore.clearDrafts error:", e);
      return 0;
    }
  }
};
