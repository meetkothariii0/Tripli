'use client';

import { ArrowLeft, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogCard from '../_components/BlogCard';

const hiddenGemsBlogs = [
  {
    title: "Top 15 Hidden Gems of India Beyond the Tourist Trail",
    description: "Discover lesser-known destinations in India that offer authentic cultural experiences and stunning natural beauty away from the crowds.",
    image: "https://images.unsplash.com/photo-1599182243289-05f2e3c0e2b1?w=500&h=300&fit=crop",
    link: "https://www.incredibleindia.org/",
    author: "Incredible India",
    date: "2024"
  },
  {
    title: "10 Unexplored Destinations in Northeast India",
    description: "Explore the magical Northeast region with its pristine landscapes, unique culture, and hidden waterfalls.",
    image: "https://images.unsplash.com/photo-1596181241476-4dcc3f7df42f?w=500&h=300&fit=crop",
    link: "https://www.thrillophilia.com/northeast-india/",
    author: "Thrillophilia",
    date: "2024"
  },
  {
    title: "Hidden Beaches of India: Secrets from the Indian Coast",
    description: "Find secluded beaches and coastal gems that offer pristine shores and fewer tourists.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
    link: "https://www.indiamike.com/",
    author: "India Mike",
    date: "2024"
  },
  {
    title: "Offbeat Hill Stations in India You Must Visit",
    description: "Skip the crowded hill stations and discover quiet, scenic destinations perfect for a peaceful retreat.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    link: "https://www.bookmyshow.com/travel/offbeat-destinations/",
    author: "Travel Guide",
    date: "2024"
  },
  {
    title: "Underrated Forts and Palaces of India: A Historical Journey",
    description: "Explore ancient forts and palaces that are less visited but equally magnificent and historically important.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&h=300&fit=crop",
    link: "https://www.historicalindia.com/",
    author: "Historical India",
    date: "2024"
  },
];

export default function HiddenGems() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Gem className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Hidden Gems</h1>
          </div>
          <p className="text-lg text-orange-100 max-w-2xl">
            Discover India's best-kept secrets. Explore lesser-known destinations that offer authentic experiences away from the usual tourist crowds.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hiddenGemsBlogs.map((blog, index) => (
            <BlogCard key={index} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
