'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // classnames helper

export function Carousel({ items }: { items: React.ReactNode[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="min-w-full">
            {item}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              'w-3 h-3 rounded-full',
              current === index ? 'bg-primary' : 'bg-gray-300'
            )}
          ></button>
        ))}
      </div>
    </div>
  );
}

type CardProps = {
  card: {
    src: string;
    title: string;
    description: string;
  };
  index: number;
  layout?: boolean;
};

export function Card({ card, index }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 city-card cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={card.src}
          alt={card.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className={cn(
          'absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent transition-opacity duration-300',
          isHovered ? 'opacity-60' : 'opacity-0'
        )}></div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 transition-colors duration-300">{card.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
      </div>
    </div>
  );
}

export default function PopularCityList() {
  const cards = [
    {
      src: 'https://www.knowledgeglow.com/wp-content/uploads/2022/01/When-And-Why-Was-India-Gate-Built-1-1024x439.jpg',
      title: 'Delhi',
      description: "Explore India's capital with the iconic India Gate.",
    },
    {
      src: 'https://i.pinimg.com/originals/d3/01/d1/d301d1977f9204899fab5d6a22d757e0.png',
      title: 'Mumbai',
      description: 'Experience the city of dreams with the stunning Sea Link.',
    },
    {
      src: 'https://tse4.mm.bing.net/th/id/OIP.pSDtCeFJeCMEFwrekjac-wHaEK?pid=Api&P=0&h=180',
      title: 'Bangalore',
      description: 'Discover the IT hub with charming cafes and gardens.',
    },
    {
      src: 'https://tse1.mm.bing.net/th/id/OIP.QYpibO_JZz_29XHJoTA23wHaDt?pid=Api&P=0&h=180',
      title: 'Kolkata',
      description: "Feel the city of joy with the historic Howrah Bridge.",
    },
  ];

  const cardItems = cards.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Popular Cities</h2>
      <Carousel items={cardItems} />
    </div>
  );
}

