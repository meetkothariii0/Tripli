"use client";

import React, { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '@/app/Provider';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TripCard from './_components/TripCard';

interface Trip {
  _id: string;
  _creationTime: number;
  tripId: string;
  uid: string;
  tripDetail: {
    origin: string;
    destination: string;
    duration: string;
    budget: string;
    group_size?: string;
    hotels?: any[];
    itinerary?: any;
  };
}

function MyTrips() {
  const { isLoaded, isSignedIn } = useUser();
  const { user: userDetails } = useUserDetail();

  console.log('MyTrips - User Details:', userDetails);
  console.log('MyTrips - User ID being used:', userDetails?._id);

  const trips = useQuery(
    api.TripDetail.getUserTrips,
    userDetails?._id ? { uid: userDetails._id } : 'skip'
  ) as Trip[] | undefined;

  console.log('MyTrips - Fetched Trips:', trips);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign in to view your trips</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to access your trip history.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Trips
          </h1>
          <p className="text-gray-600">View and manage all your planned adventures</p>
        </div>

        {/* Empty State */}
        {!trips || trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No trips yet</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Start planning your next adventure! Create a new trip to get started.
            </p>
            <Link href="/create-new-trip">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                Create Your First Trip
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Trips</p>
                    <p className="text-3xl font-bold text-gray-800">{trips.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Destinations</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {new Set(trips.map(t => t.tripDetail.destination)).size}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-purple-600 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Budget Range</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {getMostCommonBudget(trips)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-pink-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>

            {/* Create New Trip Button */}
            <div className="mt-12 text-center">
              <Link href="/create-new-trip">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto">
                  Create New Trip
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getMostCommonBudget(trips: Trip[]): string {
  if (trips.length === 0) return '-';
  
  const budgetMap: { [key: string]: number } = {};
  trips.forEach(trip => {
    const budget = trip.tripDetail.budget;
    budgetMap[budget] = (budgetMap[budget] || 0) + 1;
  });
  
  return Object.keys(budgetMap).reduce((a, b) =>
    budgetMap[a] > budgetMap[b] ? a : b
  );
}

export default MyTrips;
