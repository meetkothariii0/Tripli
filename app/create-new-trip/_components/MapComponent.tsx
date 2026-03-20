import React from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  destination?: string;
}

export default function MapComponent({ destination = "Trip Destination" }: MapComponentProps) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
      {/* Map Placeholder */}
      <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-blue-300">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin size={40} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Map View</h3>
            <p className="text-sm text-gray-500">
              {destination && destination !== "Trip Destination" 
                ? `Map will show: ${destination}` 
                : 'Map will appear here once you select a destination'}
            </p>
          </div>
        </div>
      </div>

      {/* Trip Summary Panel */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          Trip Summary
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Destination:</span> {destination || 'Not selected'}
          </p>
          <p className="text-gray-500 italic">
            Complete your trip details in the chat to see the full itinerary here
          </p>
        </div>
      </div>

      {/* Features Info */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>💡 <strong>Coming Soon:</strong> Interactive map with hotel & restaurant markers</p>
        <p>🗺️ <strong>Next Phase:</strong> Google Maps / Mapbox integration</p>
      </div>
    </div>
  );
}
