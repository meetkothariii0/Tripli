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

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
      <img
        src={card.src}
        alt={card.title}
        onLoad={() => setLoading(false)}
        className={cn(
          'h-64 w-full object-cover transition duration-300',
          isLoading ? 'blur-sm' : 'blur-0'
        )}
      />
      <div className="p-4">
        <h3 className="font-bold text-xl text-neutral-800 dark:text-neutral-100">{card.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
      </div>
    </div>
  );
}

export default function PopularCityList() {
  const cards = [
    {
      src: 'https://source.unsplash.com/800x600/?delhi',
      title: 'Delhi',
      description: 'Explore the capital’s heritage and street food.',
    },
    {
      src: 'https://source.unsplash.com/800x600/?mumbai',
      title: 'Mumbai',
      description: 'The city of dreams and the Arabian Sea.',
    },
    {
      src: 'https://source.unsplash.com/800x600/?bangalore',
      title: 'Bangalore',
      description: 'Tech hub with beautiful gardens.',
    },
    {
      src: 'https://source.unsplash.com/800x600/?kolkata',
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

