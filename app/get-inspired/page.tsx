'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogCard from '../_components/BlogCard';

const inspiredBlogs = [
  {
    title: "10 Breathtaking Destinations That Will Transform Your Travel Perspective",
    description: "Discover the world's most inspiring travel destinations that offer unique cultural experiences, stunning landscapes, and unforgettable memories.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    link: "https://www.lonelyplanet.com/articles/best-places-to-visit",
    author: "Lonely Planet",
    date: "2024"
  },
  {
    title: "How Travel Changed My Life: Real Stories from Adventurers",
    description: "Read inspiring travel stories from people who've transformed their lives through meaningful journeys around the globe.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
    link: "https://www.wanderlust.co.uk/",
    author: "Wanderlust Magazine",
    date: "2024"
  },
  {
    title: "Solo Travel Tips: Why Traveling Alone is More Rewarding Than You Think",
    description: "Explore the benefits of solo travel and get practical tips for anyone considering a solo adventure.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
    link: "https://www.nomadicmatt.com/travel-blogs/solo-travel/",
    author: "Nomadic Matt",
    date: "2024"
  },
  {
    title: "Cultural Immersion: How to Travel Like a Local",
    description: "Learn how to experience authentic local culture and connect with people during your travels.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
    link: "https://www.culinarylocal.com/travel-tips/",
    author: "Culinary Travels",
    date: "2024"
  },
  {
    title: "Budget Travel Hacks: Travel More Without Spending More",
    description: "Discover practical tips and tricks to travel on a budget and make your adventure more affordable.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
    link: "https://www.budgetraveller.com/",
    author: "Budget Traveller",
    date: "2024"
  },
];

export default function GetInspired() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Get Inspired</h1>
          </div>
          <p className="text-lg text-green-100 max-w-2xl">
            Explore inspiring travel stories and ideas from around the world. Get motivated for your next adventure!
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inspiredBlogs.map((blog, index) => (
            <BlogCard key={index} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
