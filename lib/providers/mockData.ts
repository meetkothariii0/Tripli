import { Flight, Train, Stay, Restaurant } from "./types";

export const generateMockFlights = (origin: string, dest: string, date: string): Flight[] => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `flight-${i + 1}`,
    airlineName: ["IndiGo", "Air India", "Vistara", "SpiceJet"][i % 4],
    airlineLogo: `https://ui-avatars.com/api/?name=${["IndiGo", "Air", "Vistara", "SpiceJet"][i % 4]}&background=random`,
    departureTime: `${6 + i * 2}:00 AM`,
    arrivalTime: `${8 + i * 2}:30 AM`,
    origin: origin || "Origin",
    destination: dest || "Destination",
    durationMinutes: 150 + i * 15,
    stops: i % 3 === 0 ? 1 : 0,
    price: 4500 + i * 750,
    currency: "INR",
    baggage: "15kg Check-in included",
    badges: i === 0 ? ["Cheapest"] : i === 1 ? ["Fastest"] : [],
    bookingLink: "https://www.google.com/travel/flights",
    sourceBadge: "Sample data",
    isLive: false
  }));
};

export const generateMockTrains = (origin: string, dest: string, date: string): Train[] => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `train-${i + 1}`,
    trainName: ["Rajdhani Express", "Vande Bharat Express", "Shatabdi Express", "Duronto Express", "Garib Rath"][i],
    trainNumber: `${12000 + i * 10}`,
    departureTime: "06:00 AM",
    arrivalTime: "02:00 PM",
    origin: origin || "Origin",
    destination: dest || "Destination",
    durationMinutes: 480 - i * 30,
    classes: [
      { className: "3A", price: 1550, availability: "WL 12" },
      { className: "2A", price: 2450, availability: "AVAILABLE 6" },
      { className: "1A", price: 3800, availability: "AVAILABLE 2" }
    ],
    badges: i === 1 ? ["Fastest"] : i === 0 ? ["Most Popular"] : [],
    bookingLink: "https://www.irctc.co.in",
    sourceBadge: "Sample data",
    isLive: false
  }));
};

export const generateMockStays = (dest: string): Stay[] => {
  const cats: ("Budget" | "Mid-range" | "Luxury")[] = ["Budget", "Mid-range", "Luxury"];
  const city = dest || "Destination";
  const stayNames = [
    `The Heritage Palace ${city}`,
    `${city} Grand Bay Resort`,
    `Zostel Backpacker Hub ${city}`,
    `Royal Orchid Boutique ${city}`,
    `Seaview Vista Villa ${city}`,
    `Tranquil Palms Homestay ${city}`,
    `Radisson Blu Hotel ${city}`,
    `The Oberoi Heritage ${city}`
  ];

  return stayNames.map((name, i) => ({
    id: `stay-${i + 1}`,
    name,
    category: cats[i % 3],
    area: `${city} Central`,
    distanceToCenter: `${1.2 + i * 0.8} km`,
    pricePerNight: 2200 + (i % 3) * 4500,
    totalPrice: (2200 + (i % 3) * 4500) * 3,
    currency: "INR",
    stars: 3 + (i % 3),
    rating: Number((4.1 + (i % 9) * 0.1).toFixed(1)),
    reviewCount: 150 + i * 65,
    images: [
      `https://images.unsplash.com/photo-${1566073771259 + i * 1000}?w=600&auto=format&fit=crop&q=80`,
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80"
    ],
    amenities: ["Free High-speed Wi-Fi", "Swimming Pool", "Complimentary Breakfast", "Air Conditioning", "Spa"],
    checkIn: "14:00",
    checkOut: "11:00",
    cancellationPolicy: "Free cancellation up to 48h before check-in",
    pros: ["Strategic prime location", "Spacious sanitized rooms", "Courteous staff"],
    cons: ["Peak hours check-in wait"],
    bestFor: i % 2 === 0 ? "Couples & Leisure" : "Families & Groups",
    nearbyFood: ["The Fisherman's Cove", "Urban Spices Cafe"],
    nearbyTransport: ["City Metro Station (400m)", "Cab stand right outside"],
    mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`,
    bookingLink: "https://www.booking.com",
    reviewSnippets: [
      { type: "positive", text: "Outstanding hospitality and spotless amenities!" },
      { type: "neutral", text: "Breakfast options were good though dining hall gets busy." }
    ],
    sourceBadge: "Sample data",
    isLive: false,
    placeId: `mock_place_${i + 1}`,
    lat: 15.4989 + i * 0.02,
    lng: 73.8278 + i * 0.02
  }));
};

export const generateMockRestaurants = (dest: string): Restaurant[] => {
  const city = dest || "Destination";
  const types: ("breakfast" | "lunch" | "dinner" | "extra")[] = ["breakfast", "lunch", "dinner", "extra"];
  const cuisines = ["Authentic Local", "Coastal Seafood", "North Indian Delicacies", "Cafe & Continental", "Vegetarian Thali", "Pan Asian"];
  const restaurantNames = [
    `${city} Spice Trail`,
    `Fisherman's Bay & Grill`,
    `Cafe Sol & Patisserie`,
    `The Saffron Courtyard`,
    `Anand Pure Veg Feast`,
    `Sunset Horizon Lounge`
  ];

  return restaurantNames.map((name, i) => ({
    id: `rest-${i + 1}`,
    name,
    type: types[i % 4],
    cuisine: cuisines[i % cuisines.length],
    priceLevel: ["₹", "₹₹", "₹₹₹"][i % 3],
    avgCostForTwo: 600 + i * 350,
    currency: "INR",
    rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
    reviewCount: 320 + i * 85,
    images: [
      `https://images.unsplash.com/photo-${1517248135467 + i * 1000}?w=600&auto=format&fit=crop&q=80`
    ],
    mustTryDishes: ["Chef's Signature Curry", "Crispy Garlic Naan", "Artisanal Dessert", "Handcrafted Cooler"],
    dietaryTags: ["Veg", "Non-veg", "Jain options available"],
    openingHours: "08:00 AM - 11:30 PM",
    bestTimeToVisit: "1:00 PM for lunch or 8:00 PM for dinner",
    reservationNeeded: i % 2 === 0,
    distanceFromRoute: `${0.4 + i * 0.3} km`,
    mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`,
    reviewSnippets: ["Delicious food with rich authentic flavor!", "Warm hospitality and great ambience."],
    sourceBadge: "Sample data",
    isLive: false,
    placeId: `mock_rest_${i + 1}`,
    lat: 15.5000 + i * 0.015,
    lng: 73.8300 + i * 0.015
  }));
};
