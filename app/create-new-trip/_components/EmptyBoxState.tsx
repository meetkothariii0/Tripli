import React from 'react'
import { suggestions } from '@/app/_components/Hero';
import { Plane, Sparkles, Gem } from 'lucide-react';

function EmptyBoxState({ onSelectOption }: any) {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-3xl text-center'>
        Start planning a new trip using <strong className='text-primary'>AI</strong>
      </h2>
      <p className='text-center text-gray-400 mt-2'>
        Get personalized recommendations and insights for your trip, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey.
      </p>
      
      <div className="flex-col justify-center gap-6 mt-4 flex-wrap flex">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(suggestion.title)} // ✅ Corrected this line
            className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary"
          >
            {suggestion.icon}
            <span className="text-lg">{suggestion.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmptyBoxState;
