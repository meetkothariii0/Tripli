"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Restaurant = {
  name: string;
  cuisine_type: string;
  price_range: string;
  average_cost_for_two: string;
  must_try_dishes: string[];
  address: string;
  google_maps_link: string;
  rating: number;
  image_url?: string;
};

type Activity = {
  place_name: string;
  place_details: string;
  ticket_pricing?: string;
  time_travel_each_location?: string;
  recommended_duration?: string;
  google_maps_link: string;
  image_url?: string;
};

type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  google_maps_link?: string;
  hotel_image_url?: string;
  rating?: number;
  description?: string;
  amenities?: string[];
  check_in_time?: string;
  check_out_time?: string;
};

type DayPlan = {
  day_title: string;
  activities?: Activity[];
  recommended_transport?: string;
  tips?: string[];
  recommended_restaurants?: {
    breakfast?: Restaurant;
    lunch?: Restaurant;
    dinner?: Restaurant;
    cafes_and_snacks?: Restaurant[];
  };
};

type TripDetails = {
  origin: string;
  destination: string;
  duration: string;
  budget: string;
  group_size?: string;
  interests?: string;
  hotels?: Hotel[];
  restaurants?: {
    [category: string]: Restaurant[];
  };
  famous_food_places?: Restaurant[];
  cafes_and_snacks?: Restaurant[];
  itinerary?: {
    [day: string]: DayPlan;
  };
};

function TripDetailsContent() {
  const searchParams = useSearchParams();
  const tripData = searchParams.get("data");
  const tripId = searchParams.get("tripId");
  
  const tripDetails: TripDetails | null = tripData
    ? JSON.parse(decodeURIComponent(tripData))
    : null;

  // Fetch normalized data if tripId is available
  const normalizedHotels = useQuery(api.TripDetail.GetTripHotels, tripId ? { tripId } : "skip") ?? [];
  const normalizedItinerary = useQuery(api.TripDetail.GetTripItinerary, tripId ? { tripId } : "skip") ?? [];
  const normalizedCafes = useQuery(api.TripDetail.GetTripCafes, tripId ? { tripId } : "skip") ?? [];

  if (!tripDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">No trip details available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Trip Details</h1>

      {/* Trip Overview */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl flex flex-col gap-2">
            <span className="text-sm text-gray-500">From</span>
            <span className="font-semibold text-lg">{tripDetails.origin}</span>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl flex flex-col gap-2">
            <span className="text-sm text-gray-500">To</span>
            <span className="font-semibold text-lg">{tripDetails.destination}</span>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl flex flex-col gap-2">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="font-semibold text-lg">{tripDetails.duration}</span>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl flex flex-col gap-2">
            <span className="text-sm text-gray-500">Budget</span>
            <span className="font-semibold text-lg">{tripDetails.budget}</span>
          </div>
          {tripDetails.group_size && (
            <div className="p-6 bg-gray-50 rounded-xl flex flex-col gap-2">
              <span className="text-sm text-gray-500">Group Size</span>
              <span className="font-semibold text-lg">{tripDetails.group_size}</span>
            </div>
          )}
        </div>
      </div>

      {/* Daily Itinerary */}
      {tripDetails.itinerary &&
        Object.entries(tripDetails.itinerary).map(([dayNum, dayPlan], idx) => (
          <div key={dayNum} className="bg-linear-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6 shadow-md">
            <h3 className="text-xl font-bold text-orange-600 mb-3">
              Day {idx + 1}: <span className="font-normal">{dayPlan.day_title}</span>
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {(dayPlan.activities ?? []).map((activity, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{activity.place_name}</h4>
                    {activity.image_url ? (
                      <img src={activity.image_url} alt={activity.place_name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{activity.place_details}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {activity.ticket_pricing && <p className="text-gray-600">💰 Ticket: {activity.ticket_pricing}</p>}
                    {activity.recommended_duration && <p className="text-gray-600">⏰ Duration: {activity.recommended_duration}</p>}
                    {activity.time_travel_each_location && <p className="text-gray-600">🚗 Travel Time: {activity.time_travel_each_location}</p>}
                  </div>
                  {activity.google_maps_link && (
                    <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline text-sm mt-2 block">
                      📍 View on Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>

            {dayPlan.recommended_transport && (
              <div className="mt-2 text-sm text-gray-600">🚍 Transport Tip: {dayPlan.recommended_transport}</div>
            )}

            {dayPlan.tips && dayPlan.tips.length > 0 && (
              <div className="mt-2 bg-orange-50 p-3 rounded">
                <p className="font-semibold mb-1">💡 Day Tips:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {dayPlan.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

      {/* Hotels */}
      {(normalizedHotels.length > 0 || (tripDetails?.hotels && tripDetails.hotels.length > 0)) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommended Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {normalizedHotels.length > 0
              ? normalizedHotels.map((hotel: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-400 text-xs">Hotel Image</div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-xl">{hotel.hotelName}</h3>
                      <p className="text-gray-600">{hotel.location}</p>
                      <p className="text-orange-600 font-semibold">${hotel.pricePerNight}/night</p>
                      {hotel.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{hotel.rating}/5</span>
                        </div>
                      )}
                      {hotel.description && (
                        <p className="text-gray-600 text-sm mt-2">{hotel.description}</p>
                      )}
                      {hotel.mapLink && (
                        <a href={hotel.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">📍 View on Google Maps</a>
                      )}
                    </div>
                  </div>
                ))
              : tripDetails?.hotels?.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    {hotel.hotel_image_url ? (
                      <img src={hotel.hotel_image_url} alt={hotel.hotel_name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-xl">{hotel.hotel_name}</h3>
                      <p className="text-gray-600">{hotel.hotel_address}</p>
                      <p className="text-orange-600 font-semibold">{hotel.price_per_night}</p>
                      {hotel.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{hotel.rating}/5</span>
                        </div>
                      )}
                      {hotel.google_maps_link && (
                        <a href={hotel.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">View Hotel on Google Maps</a>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Restaurants */}
      {tripDetails.restaurants && Object.keys(tripDetails.restaurants).length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommended Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(tripDetails.restaurants).flat().map((restaurant, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                {restaurant.image_url ? (
                  <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-xl">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <p className="text-orange-600 font-semibold">{restaurant.price_range}</p>
                  {restaurant.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{restaurant.rating}/5</span>
                    </div>
                  )}
                  {restaurant.google_maps_link && (
                    <a href={restaurant.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">View Restaurant on Google Maps</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Famous Food Places */}
      {tripDetails.famous_food_places && tripDetails.famous_food_places.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Famous Food Places</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripDetails.famous_food_places.map((place, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                {place.image_url ? (
                  <img src={place.image_url} alt={place.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">{place.name}</h4>
                    {place.google_maps_link && (
                      <a href={place.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View on Google Maps</a>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{place.address}</p>
                  <p className="text-gray-600 text-sm">{place.cuisine_type} | {place.price_range}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cafes & Snack Places */}
      {(normalizedCafes.length > 0 || (tripDetails?.cafes_and_snacks && tripDetails.cafes_and_snacks.length > 0)) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Cafes & Snack Places</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {normalizedCafes.length > 0
              ? normalizedCafes.map((cafe: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-gray-400 text-xs">Cafe Image</div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-xl">{cafe.cafeName}</h3>
                      <p className="text-gray-600">{cafe.location}</p>
                      {cafe.cuisine && (
                        <p className="text-orange-600 font-semibold">{cafe.cuisine}</p>
                      )}
                      {cafe.description && (
                        <p className="text-gray-600 text-sm mt-2">{cafe.description}</p>
                      )}
                      {cafe.mapLink && (
                        <a href={cafe.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">☕ View on Google Maps</a>
                      )}
                    </div>
                  </div>
                ))
              : tripDetails?.cafes_and_snacks?.map((cafe, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    {cafe.image_url ? (
                      <img src={cafe.image_url} alt={cafe.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-xl">{cafe.name}</h3>
                      <p className="text-gray-600">{cafe.address}</p>
                      <p className="text-orange-600 font-semibold">{cafe.price_range}</p>
                      {cafe.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{cafe.rating}/5</span>
                        </div>
                      )}
                      {cafe.google_maps_link && (
                        <a href={cafe.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">View Cafe on Google Maps</a>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading trip details...</p></div>}>
      <TripDetailsContent />
    </Suspense>
  );
}
