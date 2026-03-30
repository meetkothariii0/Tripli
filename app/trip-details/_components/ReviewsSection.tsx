'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, Star, Loader } from 'lucide-react';

interface Review {
  title: string;
  content: string;
  author: string;
  date: string;
  rating?: number;
  source: string;
  link?: string;
}

interface ReviewsSectionProps {
  destination: string;
}

export function ReviewsSection({ destination }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?destination=${encodeURIComponent(destination)}`);
        const result = await response.json();

        if (result.success && result.data) {
          setReviews(result.data);
        } else {
          setError('Failed to fetch reviews');
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [destination]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-orange-500">Traveler Reviews & Experiences</h2>
        </div>
        <div className="flex justify-center items-center min-h-40">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-gray-600 dark:text-gray-400">Loading real experiences from travelers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-orange-500">Traveler Reviews & Experiences</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">Unable to load reviews at the moment. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-orange-500">Traveler Reviews & Experiences</h2>
      </div>

      <p className="text-gray-600 mb-6">
        See what other travelers experienced at <strong>{destination}</strong>. Get insights from Reddit communities, travel blogs, and shared experiences.
      </p>

      {reviews.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-900 font-semibold text-lg mb-2">No reviews found yet for {destination}</p>
          <p className="text-blue-800 text-sm mb-4">
            This might mean the destination is newer or less commonly discussed. But don't worry! Here are some ways to find traveler experiences:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left">
            <a
              href={`https://www.reddit.com/r/travel/search?q=${destination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-300 rounded p-3 hover:bg-blue-100 transition duration-300"
            >
              <span className="font-semibold text-blue-900">Reddit r/travel</span>
              <p className="text-gray-600">Search travel discussions</p>
            </a>
            <a
              href={`https://www.reddit.com/r/backpacking/search?q=${destination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-300 rounded p-3 hover:bg-blue-100 transition duration-300"
            >
              <span className="font-semibold text-blue-900">Reddit r/backpacking</span>
              <p className="text-gray-600">Budget travel tips</p>
            </a>
            <a
              href={`https://www.tripadvisor.com/Search?q=${destination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-300 rounded p-3 hover:bg-blue-100 transition duration-300"
            >
              <span className="font-semibold text-blue-900">TripAdvisor</span>
              <p className="text-gray-600">Verified traveler reviews</p>
            </a>
            <a
              href={`https://www.google.com/search?q=${destination}+travel+reviews`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-300 rounded p-3 hover:bg-blue-100 transition duration-300"
            >
              <span className="font-semibold text-blue-900">Google</span>
              <p className="text-gray-600">General travel reviews</p>
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            New experiences and reviews are added regularly. Check back soon! 🌍
          </p>
        </div>
      ) : reviews[0]?.source === 'System' ? (
        // Show the system message (no reviews found)
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <p className="text-amber-900 font-semibold text-lg mb-4">{reviews[0].title}</p>
          <p className="text-amber-800 text-sm mb-6">{reviews[0].content}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={`https://www.reddit.com/r/travel/search?q=${destination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Visit Reddit r/travel
            </a>
            <a
              href={`https://www.reddit.com/r/backpacking/search?q=${destination}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Visit Reddit r/backpacking
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-orange-100"
            >
              {/* Header with source and date */}
              <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{review.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-semibold">{review.author}</span>
                      <span className="text-gray-400">•</span>
                      <span>{review.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                        {review.source}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  {review.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-gray-700">{review.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Review content */}
              <div className="px-6 py-4">
                <p className="text-gray-700 leading-relaxed">{review.content}</p>

                {/* Link to original if available */}
                {review.link && (
                  <a
                    href={review.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-orange-600 hover:text-orange-700 underline text-sm font-medium"
                  >
                    Read full review →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p>
          💡 <strong>Tip:</strong> These reviews are sourced from Reddit travel communities and travel blogs. They reflect real experiences from fellow travelers. 
          Read multiple reviews to get a comprehensive understanding of what to expect!
        </p>
      </div>
    </div>
  );
}
