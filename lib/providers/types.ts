export type ProviderStatusType = "connected" | "sample";

export interface ProviderInfo {
  name: string;
  key: string;
  status: ProviderStatusType;
  envKey: string;
  sourceBadge: string;
}

export interface Flight {
  id: string;
  airlineName: string;
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  durationMinutes: number;
  stops: number;
  price: number;
  currency: string;
  baggage: string;
  badges: string[];
  bookingLink: string;
  sourceBadge: string;
  isLive: boolean;
}

export interface Train {
  id: string;
  trainName: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  durationMinutes: number;
  classes: {
    className: string;
    price: number;
    availability: string;
  }[];
  badges: string[];
  bookingLink: string;
  sourceBadge: string;
  isLive: boolean;
}

export interface Stay {
  id: string;
  name: string;
  category: "Budget" | "Mid-range" | "Luxury";
  area: string;
  distanceToCenter: string;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  stars: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  nearbyFood: string[];
  nearbyTransport: string[];
  mapLink: string;
  bookingLink: string;
  reviewSnippets: { type: "positive" | "neutral" | "critical"; text: string }[];
  sourceBadge: string;
  isLive: boolean;
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "extra";
  cuisine: string;
  priceLevel: string;
  avgCostForTwo: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  mustTryDishes: string[];
  dietaryTags: string[];
  openingHours: string;
  bestTimeToVisit: string;
  reservationNeeded: boolean;
  distanceFromRoute: string;
  mapLink: string;
  reviewSnippets: string[];
  sourceBadge: string;
  isLive: boolean;
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface ResolvedPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: string[];
  lat: number;
  lng: number;
  cityMatch: boolean;
  google_maps_link: string;
  sourceBadge: string;
  isLive: boolean;
}

export interface ActivityItem {
  id: string;
  place_name: string;
  place_address: string;
  start_time: string;
  end_time: string;
  duration: string;
  travel_time_from_prev: string;
  estimated_cost: string;
  neighborhood: string;
  google_maps_link: string;
  why_this: string;
  rating?: number;
  review_count?: number;
  photo_url?: string;
  place_id?: string;
  lat?: number;
  lng?: number;
  sourceBadge: string;
  isLive: boolean;
}

export interface MealItem {
  name: string;
  address: string;
  rating?: number;
  photo_url?: string;
  google_maps_link?: string;
  place_id?: string;
  sourceBadge?: string;
  isLive?: boolean;
}

export interface DayItinerary {
  day: number;
  day_title: string;
  activities: ActivityItem[];
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
  };
  local_tip: string;
  recommended_transport: string;
}

export interface TripPlan {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  durationDays: number;
  dates?: string;
  budget: string;
  spending_style?: string;
  group_size: string;
  trip_type: string;
  travel_style?: string[];
  interests?: string;
  stay_type?: string[];
  food_pref?: string;
  pace?: string;
  must_haves?: string[];
  itinerary: DayItinerary[];
  stays?: Stay[];
  restaurants?: Restaurant[];
  flights?: Flight[];
  trains?: Train[];
  createdAt: string;
}
