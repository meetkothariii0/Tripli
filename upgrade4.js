const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
};

write('app/trip-details/page.tsx', `
"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Map, Calendar, Plane, Coffee, Home, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function TripDetails() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  
  const [tripData, setTripData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app we'd fetch the trip by ID from Convex here.
    // For now we mock it if it's not found in localStorage.
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    setTripData(savedTrips.find((t: any) => t.id === tripId) || {
      origin: "New York",
      destination: "Paris",
      duration: "5 days",
      budget: "$5000",
      itinerary: []
    });
  }, [tripId]);

  if (!tripData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{tripData.destination} Trip</h1>
          <p className="text-gray-500">{tripData.duration} • {tripData.budget}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Saved to favorites!")}><Heart className="w-4 h-4 mr-2" /> Save</Button>
          <Button variant="outline" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
          }}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
        </div>
      </div>

      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="itinerary"><Calendar className="w-4 h-4 mr-2" /> Itinerary</TabsTrigger>
          <TabsTrigger value="stays"><Home className="w-4 h-4 mr-2" /> Stays</TabsTrigger>
          <TabsTrigger value="food"><Coffee className="w-4 h-4 mr-2" /> Food</TabsTrigger>
          <TabsTrigger value="transport"><Plane className="w-4 h-4 mr-2" /> Transport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary">
          <div className="space-y-6">
            {tripData.itinerary?.length ? tripData.itinerary.map((day: any, i: number) => (
              <div key={i} className="border p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Day {day.day}: {day.day_title}</h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">Local Tip: {day.local_tip}</p>
                <div className="space-y-4">
                  {day.activities?.map((act: any, j: number) => (
                    <div key={j} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-24 flex-shrink-0 text-sm font-bold text-gray-600">
                        {act.start_time} - {act.end_time}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{act.place_name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{act.place_address}</p>
                        <p className="text-gray-700 text-sm">{act.why_this}</p>
                        <div className="flex gap-4 mt-3">
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">Cost: {act.estimated_cost}</span>
                          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">Time: {act.duration}</span>
                          <a href={act.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">Maps <ChevronRight className="w-3 h-3"/></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )) : <p>No itinerary generated yet.</p>}
          </div>
        </TabsContent>
        
        <TabsContent value="stays">
          <StaysTab dest={tripData.destination} />
        </TabsContent>
        
        <TabsContent value="food">
          <FoodTab dest={tripData.destination} />
        </TabsContent>
        
        <TabsContent value="transport">
          <TransportTab origin={tripData.origin} dest={tripData.destination} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StaysTab({ dest }: { dest: string }) {
  const [stays, setStays] = useState([]);
  useEffect(() => {
    fetch(\`/api/search/stays?dest=\${dest}\`).then(res => res.json()).then(data => setStays(data.data));
  }, [dest]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stays.map((stay: any) => (
        <div key={stay.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
          <img src={stay.images[0]} alt={stay.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{stay.name}</h3>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">{stay.category}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{stay.area} • {stay.distanceToCenter}</p>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-2xl font-bold">{stay.currency} {stay.pricePerNight}</p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
              <Button onClick={() => window.open(stay.bookingLink, '_blank')}>Book Now</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FoodTab({ dest }: { dest: string }) {
  const [food, setFood] = useState([]);
  useEffect(() => {
    fetch(\`/api/search/food?dest=\${dest}\`).then(res => res.json()).then(data => setFood(data.data));
  }, [dest]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {food.map((item: any) => (
        <div key={item.id} className="border rounded-xl overflow-hidden shadow-sm">
          <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.cuisine} • {item.priceLevel}</p>
            <p className="text-sm mb-4"><strong>Must try:</strong> {item.mustTryDishes.join(', ')}</p>
            <Button variant="outline" className="w-full" onClick={() => window.open(item.mapLink, '_blank')}>View on Map</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransportTab({ origin, dest }: { origin: string, dest: string }) {
  const [flights, setFlights] = useState([]);
  useEffect(() => {
    fetch(\`/api/search/flights?origin=\${origin}&dest=\${dest}\`).then(res => res.json()).then(data => setFlights(data.data));
  }, [origin, dest]);

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold">Date Flexibility</h3>
          <p className="text-sm">Showing prices for +/- 3 days around your selected dates.</p>
        </div>
        <Button variant="outline">Compare Trains</Button>
      </div>
      <div className="space-y-4">
        {flights.map((flight: any) => (
          <div key={flight.id} className="border p-4 rounded-xl flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <img src={flight.airlineLogo} alt={flight.airlineName} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-bold">{flight.airlineName}</h4>
                <p className="text-sm text-gray-500">{flight.departureTime} - {flight.arrivalTime} • {Math.floor(flight.durationMinutes/60)}h {flight.durationMinutes%60}m</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold mb-2">{flight.currency} {flight.price}</p>
              <Button onClick={() => window.open(flight.bookingLink, '_blank')}>Select Flight</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);
console.log('Trip Details Page Generated!');
