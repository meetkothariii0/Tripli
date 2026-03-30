"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, Users, ChevronRight, Hotel, MapPinIcon, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface TripCardProps {
  trip: {
    _id: string;
    _creationTime: number;
    tripId: string;
    tripDetail: {
      origin: string;
      destination: string;
      duration: string;
      budget: string;
      group_size?: string;
      hotels?: any[];
    };
  };
}

function TripCard({ trip }: TripCardProps) {
  // Fetch normalized data from the database
  const hotels = useQuery(api.TripDetail.GetTripHotels, { tripId: trip.tripId }) ?? [];
  const itinerary = useQuery(api.TripDetail.GetTripItinerary, { tripId: trip.tripId }) ?? [];
  const cafes = useQuery(api.TripDetail.GetTripCafes, { tripId: trip.tripId }) ?? [];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const queryData = encodeURIComponent(JSON.stringify(trip.tripDetail));
  const viewDetailsLink = `/trip-details?data=${queryData}&tripId=${trip.tripId}`;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 text-4xl">✈️</div>
        </div>
        <div className="p-4 text-white relative z-10">
          <p className="text-sm opacity-90">From {trip.tripDetail.origin}</p>
          <p className="text-lg font-semibold">To {trip.tripDetail.destination}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Trip Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Duration</p>
              <p className="font-semibold text-gray-800">{trip.tripDetail.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Budget</p>
              <p className="font-semibold text-gray-800">{trip.tripDetail.budget}</p>
            </div>
          </div>
          {trip.tripDetail.group_size && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Group Size</p>
                <p className="font-semibold text-gray-800">{trip.tripDetail.group_size}</p>
              </div>
            </div>
          )}
          {hotels && hotels.length > 0 && (
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Hotels</p>
                <p className="font-semibold text-gray-800">{hotels.length}</p>
              </div>
            </div>
          )}
        </div>

        {/* Hotels Preview */}
        {hotels && hotels.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Hotel className="w-3 h-3" /> Hotels Preview
            </p>
            <div className="space-y-2">
              {hotels.slice(0, 2).map((hotel, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                  <span className="text-gray-700 font-medium">{hotel.hotelName}</span>
                  {hotel.mapLink && (
                    <a
                      href={hotel.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                    >
                      Map
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary Summary */}
        {itinerary && itinerary.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Itinerary Summary
            </p>
            <div className="space-y-1">
              {itinerary.map((day, index) => (
                <div key={index} className="text-xs text-gray-600">
                  <span className="font-medium">{day.dayTitle}</span>
                  {day.activities && day.activities.length > 0 && (
                    <span className="text-gray-500"> • {day.activities.length} activities</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cafes Preview */}
        {cafes && cafes.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Coffee className="w-3 h-3" /> Cafes Preview
            </p>
            <div className="space-y-2">
              {cafes.slice(0, 2).map((cafe, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                  <span className="text-gray-700 font-medium">{cafe.cafeName}</span>
                  {cafe.mapLink && (
                    <a
                      href={cafe.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                    >
                      Map
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created Date */}
        <p className="text-xs text-gray-500 mb-4">
          Created on {formatDate(trip._creationTime)}
        </p>

        {/* View Details Button */}
        <Link href={viewDetailsLink}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-between group/btn">
            <span>View Trip Details</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default TripCard;
