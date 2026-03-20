'use client';

import { ArrowLeft, Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogCard from '../_components/BlogCard';

const adventureBlogs = [
  {
    title: "20 Thrilling Adventure Activities to Try While Traveling",
    description: "From rock climbing to parasailing, discover the best adventure activities that will give you an adrenaline rush across popular travel destinations.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    link: "https://www.adventurejunkie.com/",
    author: "Adventure Junkie",
    date: "2024"
  },
  {
    title: "Surfing Destinations in India: Ride the Waves",
    description: "Discover the best places for surfing in India including Mulki, Gokarna, and more hidden gem beach spots.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop",
    link: "https://www.surfguide.com/india/",
    author: "Surf Guide",
    date: "2024"
  },
  {
    title: "Trekking Trails That Will Change Your Perspective",
    description: "Explore some of the most scenic trekking routes in India with detailed guides, difficulty levels, and best seasons.",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=300&fit=crop",
    link: "https://www.traildino.com/",
    author: "Trail Dino",
    date: "2024"
  },
  {
    title: "Wildlife Tourism: Ethical Adventures with Wildlife Encounters",
    description: "Experience wildlife in their natural habitat with responsible and ethical tourism practices across India's national parks.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=300&fit=crop",
    link: "https://www.worldwildlife.org/",
    author: "World Wildlife Fund",
    date: "2024"
  },
  {
    title: "Rock Climbing and Mountaineering: Conquer the Heights",
    description: "Get trained in rock climbing and mountaineering in India with expert guides and challenging peaks.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    link: "https://www.climbingschool.com/",
    author: "Adventure Sports",
    date: "2024"
  },
];

export default function AdventureIdeas() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-linear-to-r from-yellow-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Mountain className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Adventure Ideas</h1>
          </div>
          <p className="text-lg text-yellow-100 max-w-2xl">
            Get inspired by thrilling adventure activities and experiences. From surfing to trekking, find your next adventure!
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventureBlogs.map((blog, index) => (
            <BlogCard key={index} {...blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
