"use client";

import React from 'react';

interface TripTypeUiProps {
  onSelectedOption: (value: string) => void;
}

const tripTypes = [
  {
    type: 'Adventure',
    icon: '🏃‍♂️',
    description: 'Thrilling activities and outdoor experiences'
  },
  {
    type: 'Sightseeing',
    icon: '🏛️',
    description: 'Explore landmarks and tourist attractions'
  },
  {
    type: 'Cultural',
    icon: '🏺',
    description: 'Immerse in local traditions and heritage'
  },
  {
    type: 'Relaxation',
    icon: '🌅',
    description: 'Peaceful and rejuvenating experiences'
  },
  {
    type: 'Shopping',
    icon: '🛍️',
    description: 'Explore markets and shopping districts'
  },
  {
    type: 'Food Tour',
    icon: '🍽️',
    description: 'Discover local cuisines and restaurants'
  }
];

const TripTypeUi: React.FC<TripTypeUiProps> = ({ onSelectedOption }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {tripTypes.map((trip) => (
        <button
          key={trip.type}
          onClick={() => onSelectedOption(trip.type)}
          className="flex flex-col items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <span className="text-4xl mb-2">{trip.icon}</span>
          <span className="font-semibold mb-1">{trip.type}</span>
          <span className="text-sm text-gray-600 text-center">{trip.description}</span>
        </button>
      ))}
    </div>
  );
};

export default TripTypeUi;
