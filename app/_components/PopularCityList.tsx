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
  const [isLoading, setLoading] = useState(true);
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
          onLoad={() => setLoading(false)}
          className={cn(
            'w-full h-full object-cover transition duration-500 group-hover:scale-110',
            isLoading ? 'blur-sm' : 'blur-0'
          )}
        />
        {/* Overlay on hover */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300',
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
      src: 'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Delhi',
      description: "Explore the capital's heritage and street food.",
    },
    {
      src: 'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Mumbai',
      description: 'The city of dreams and the Arabian Sea.',
    },
    {
      src: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Bangalore',
      description: 'Tech hub with beautiful gardens.',
    },
    {
      src: 'https://images.pexels.com/photos/4552949/pexels-photo-4552949.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'Kolkata',
      description: 'Culture, art, and colonial charm.',
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

