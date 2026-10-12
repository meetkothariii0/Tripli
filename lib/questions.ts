export type QuestionType = "single" | "multi" | "date-range" | "number" | "slider" | "text";

export interface QuestionOption {
  label: string;
  value: string;
  emoji?: string;
  helperText?: string;
}

export interface QuestionConfig {
  id: string;
  label: string;
  type: QuestionType;
  options: QuestionOption[];
  allowCustom?: boolean;
  skippable?: boolean;
  hasStepper?: boolean;
}

export const QUESTIONS: QuestionConfig[] = [
  {
    id: "origin",
    label: "Where are you starting from?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Bengaluru", value: "Bengaluru", emoji: "🏙️" },
      { label: "Mumbai", value: "Mumbai", emoji: "🌊" },
      { label: "Delhi", value: "Delhi", emoji: "🏛️" },
      { label: "Hyderabad", value: "Hyderabad", emoji: "💎" },
      { label: "Chennai", value: "Chennai", emoji: "🏖️" },
      { label: "Kolkata", value: "Kolkata", emoji: "🎨" },
      { label: "Pune", value: "Pune", emoji: "⛰️" },
    ],
  },
  {
    id: "destination",
    label: "Where do you want to go?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Suggest for me", value: "Suggest for me", emoji: "✨", helperText: "Surprise me with best picks" },
      { label: "Goa", value: "Goa", emoji: "🏖️" },
      { label: "Manali", value: "Manali", emoji: "🏔️" },
      { label: "Kerala", value: "Kerala", emoji: "🌴" },
      { label: "Jaipur", value: "Jaipur", emoji: "🏰" },
      { label: "Bali", value: "Bali", emoji: "🌺" },
      { label: "Dubai", value: "Dubai", emoji: "🏙️" },
      { label: "Thailand", value: "Thailand", emoji: "🐘" },
      { label: "Maldives", value: "Maldives", emoji: "🪸" },
    ],
  },
  {
    id: "dates",
    label: "When are you travelling?",
    type: "date-range",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "This weekend", value: "This weekend", emoji: "⚡" },
      { label: "Next month", value: "Next month", emoji: "🗓️" },
      { label: "Flexible", value: "Flexible", emoji: "🌈" },
    ],
  },
  {
    id: "trip_length",
    label: "How long is your trip?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "2 Days", value: "2", emoji: "⚡" },
      { label: "3 Days", value: "3", emoji: "🎯" },
      { label: "4 Days", value: "4", emoji: "✨" },
      { label: "5 Days", value: "5", emoji: "🌟" },
      { label: "7 Days", value: "7", emoji: "🏖️" },
      { label: "10 Days", value: "10", emoji: "🗺️" },
      { label: "14 Days", value: "14", emoji: "🌍" },
    ],
  },
  {
    id: "travelers",
    label: "Who is travelling with you?",
    type: "single",
    allowCustom: true,
    skippable: false,
    hasStepper: true,
    options: [
      { label: "Solo", value: "Solo", emoji: "🎒" },
      { label: "Couple", value: "Couple", emoji: "💑" },
      { label: "Family with kids", value: "Family with kids", emoji: "👨‍👩‍👧‍👦" },
      { label: "Friends group", value: "Friends group", emoji: "👥" },
    ],
  },
  {
    id: "total_budget",
    label: "What is your total trip budget? (whole group, INR)",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Under ₹30k", value: "Under ₹30,000", emoji: "🪙" },
      { label: "₹30k - ₹80k", value: "₹30,000 - ₹80,000", emoji: "💵" },
      { label: "₹80k - ₹2L", value: "₹80,000 - ₹2,00,000", emoji: "💳" },
      { label: "₹2L - ₹5L", value: "₹2,00,000 - ₹5,00,000", emoji: "💰" },
      { label: "Over ₹5L", value: "Over ₹5,00,000", emoji: "💎" },
    ],
  },
  {
    id: "spending_style",
    label: "What is your spending style?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Budget / Backpacker", value: "Budget/Backpacker", emoji: "🎒", helperText: "Hostels, local food, public transport" },
      { label: "Mid-range", value: "Mid-range", emoji: "🏨", helperText: "Comfortable 3-star hotels, mix of cabs & cafes" },
      { label: "Premium", value: "Premium", emoji: "🍸", helperText: "4-star hotels, private cabs, great dining" },
      { label: "Luxury", value: "Luxury", emoji: "👑", helperText: "5-star resorts, private transfers, fine dining" },
    ],
  },
  {
    id: "travel_style",
    label: "What is your travel style?",
    type: "multi",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Relaxed", value: "Relaxed", emoji: "🧘" },
      { label: "Adventure", value: "Adventure", emoji: "🧗" },
      { label: "Culture & heritage", value: "Culture and heritage", emoji: "🏛️" },
      { label: "Food", value: "Food", emoji: "🍜" },
      { label: "Nature", value: "Nature", emoji: "🌲" },
      { label: "Nightlife", value: "Nightlife", emoji: "🎉" },
      { label: "Shopping", value: "Shopping", emoji: "🛍️" },
      { label: "Spiritual", value: "Spiritual", emoji: "🕉️" },
      { label: "Photography", value: "Photography", emoji: "📸" },
    ],
  },
  {
    id: "stay_type",
    label: "Preferred stay type?",
    type: "multi",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Hostel", value: "Hostel", emoji: "🛏️" },
      { label: "Budget hotel", value: "Budget hotel", emoji: "🏨" },
      { label: "3-4★ hotel", value: "3-4★ hotel", emoji: "🏢" },
      { label: "5★ resort", value: "5★ resort", emoji: "🏰" },
      { label: "Homestay", value: "Homestay", emoji: "🏡" },
      { label: "Villa / Airbnb", value: "Villa/Airbnb", emoji: "🏠" },
    ],
  },
  {
    id: "food_pref",
    label: "Food preference?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Veg", value: "Veg", emoji: "🥗" },
      { label: "Non-veg", value: "Non-veg", emoji: "🍗" },
      { label: "Vegan", value: "Vegan", emoji: "🌱" },
      { label: "Jain", value: "Jain", emoji: "🍲" },
      { label: "Halal", value: "Halal", emoji: "🥩" },
      { label: "No preference", value: "No preference", emoji: "🍽️" },
    ],
  },
  {
    id: "transport",
    label: "Preferred transport?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Flight", value: "Flight", emoji: "✈️" },
      { label: "Train", value: "Train", emoji: "🚆" },
      { label: "Bus", value: "Bus", emoji: "🚌" },
      { label: "Self-drive", value: "Self-drive", emoji: "🚗" },
      { label: "Cheapest available", value: "Cheapest available", emoji: "🏷️" },
      { label: "Fastest available", value: "Fastest available", emoji: "⚡" },
    ],
  },
  {
    id: "pace",
    label: "Trip pace?",
    type: "single",
    allowCustom: true,
    skippable: false,
    options: [
      { label: "Relaxed", value: "Relaxed", emoji: "☕", helperText: "2-3 easy activities per day, lots of downtime" },
      { label: "Balanced", value: "Balanced", emoji: "⚖️", helperText: "4-5 activities per day, comfortable pacing" },
      { label: "Packed", value: "Packed", emoji: "🏃", helperText: "6+ activities per day, see everything possible" },
    ],
  },
  {
    id: "must_haves",
    label: "Any must-haves for this trip?",
    type: "multi",
    allowCustom: true,
    skippable: true,
    options: [
      { label: "Beaches", value: "Beaches", emoji: "🏖️" },
      { label: "Trekking", value: "Trekking", emoji: "🥾" },
      { label: "Temples", value: "Temples", emoji: "🛕" },
      { label: "Wildlife", value: "Wildlife", emoji: "🐅" },
      { label: "Local markets", value: "Local markets", emoji: "🏮" },
      { label: "Water sports", value: "Water sports", emoji: "🏄" },
      { label: "Kid-friendly", value: "Kid-friendly", emoji: "🎠" },
      { label: "Pet-friendly", value: "Pet-friendly", emoji: "🐾" },
    ],
  },
];
