"use client";

import React, { useState, useEffect } from "react";
import { useTrip } from "@/context/TripContext";
import { RedditThread, RedditSummary } from "@/lib/providers/redditTypes";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  Sparkles,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Calendar,
  Layers,
  Heart
} from "lucide-react";

const TOPICS = [
  "All",
  "Stay",
  "Food",
  "Safety and scams",
  "Hidden gems",
  "Itinerary",
  "Budget"
];

export default function RedditReviewsPage() {
  const { trip, loading: tripLoading } = useTrip();

  const [threads, setThreads] = useState<RedditThread[]>([]);
  const [summary, setSummary] = useState<RedditSummary | null>(null);
  const [activeSource, setActiveSource] = useState<string>("sample");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortBy, setSortBy] = useState<"top" | "newest" | "comments">("top");

  const fetchDiscussions = async (topic = selectedTopic) => {
    if (!trip?.destination) return;
    setLoading(true);
    setError(false);

    try {
      const url = `/api/reddit?destination=${encodeURIComponent(trip.destination)}&topic=${encodeURIComponent(topic)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setThreads(data.threads || []);
        setSummary(data.summary || null);
        setActiveSource(data.activeSource || "sample");
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch Reddit reviews", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip?.destination) {
      fetchDiscussions(selectedTopic);
    }
  }, [trip?.destination, selectedTopic]);

  // Sort threads
  const sortedThreads = [...threads].sort((a, b) => {
    if (sortBy === "top") return b.score - a.score;
    if (sortBy === "comments") return b.numComments - a.numComments;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (tripLoading) {
    return <div className="py-12 text-center text-gray-500">Loading trip information...</div>;
  }

  return (
    <div className="pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Reddit Community Intelligence: {trip?.destination}
            </h2>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                activeSource === "reddit_oauth"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : activeSource === "serpapi"
                  ? "bg-blue-50 text-blue-800 border-blue-300"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {activeSource === "reddit_oauth"
                ? "Live · Reddit OAuth"
                : activeSource === "serpapi"
                ? "Live · SerpApi (Reddit)"
                : "Sample data"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Unfiltered travel advice, scams to dodge, and insider recommendations from active travelers.
          </p>
        </div>
      </div>

      {/* AI Summary Card */}
      {summary && !loading && (
        <div className="bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 border border-orange-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-base text-gray-900">
                AI summary of Reddit discussions
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Grounded in verified threads</span>
          </div>

          <p className="text-xs text-gray-700 italic mb-5 bg-white/80 p-3 rounded-xl border border-orange-100">
            &ldquo;{summary.overallSentiment}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* What Redditors Love */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                What Redditors Love
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.whatRedditorsLove.map((item, idx) => (
                  <li key={idx}>
                    • {item.claim}{" "}
                    <span className="text-[10px] text-primary underline ml-1 cursor-pointer">
                      (ref)
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Complaints */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Common Complaints
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.commonComplaints.map((item, idx) => (
                  <li key={idx}>• {item.claim}</li>
                ))}
              </ul>
            </div>

            {/* Scams and Things to Avoid */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Scams & Avoid
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.scamsAndAvoid.map((item, idx) => (
                  <li key={idx}>• {item.claim}</li>
                ))}
              </ul>
            </div>

            {/* Hidden Gems */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Hidden Gems
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.hiddenGems.map((item, idx) => (
                  <li key={idx}>• {item.claim}</li>
                ))}
              </ul>
            </div>

            {/* Best Time to Visit */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Best Time to Visit
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.bestTimeToVisit.map((item, idx) => (
                  <li key={idx}>• {item.claim}</li>
                ))}
              </ul>
            </div>

            {/* Top Places Mentioned */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <div className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-600" />
                Frequently Mentioned Spots
              </div>
              <ul className="space-y-1.5 text-gray-600">
                {summary.topPlacesMentioned.map((item, idx) => (
                  <li key={idx}>
                    • <strong>{item.name}</strong> ({item.type})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-2 border-b border-gray-200">
        {/* Topic filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTopic === topic
                  ? "bg-primary text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">Sort:</span>
          <Button
            variant={sortBy === "top" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("top")}
            className="h-8 text-xs"
          >
            <Flame className="w-3 h-3 mr-1" /> Top
          </Button>
          <Button
            variant={sortBy === "newest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("newest")}
            className="h-8 text-xs"
          >
            Newest
          </Button>
          <Button
            variant={sortBy === "comments" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("comments")}
            className="h-8 text-xs"
          >
            Most Discussed
          </Button>
        </div>
      </div>

      {/* Skeleton Loaders */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state with retry */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-900 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h3 className="font-bold text-base mb-1">Failed to load Reddit discussions</h3>
          <p className="text-xs text-red-700 mb-4">
            Could not fetch threads at this time. Please try again.
          </p>
          <Button size="sm" onClick={() => fetchDiscussions()} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sortedThreads.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-md mx-auto">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-lg mb-1">No discussions found</h3>
          <p className="text-xs text-gray-500 mb-4">
            No discussions found for this topic filter. Try selecting &ldquo;All&rdquo; or a nearby city.
          </p>
          <Button size="sm" variant="outline" onClick={() => setSelectedTopic("All")}>
            Show All Discussions
          </Button>
        </div>
      )}

      {/* Thread Cards */}
      {!loading && !error && sortedThreads.length > 0 && (
        <div className="space-y-4">
          {sortedThreads.map((thread) => {
            let timeAgo = "Recently";
            try {
              timeAgo = formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true });
            } catch {}

            return (
              <div
                key={thread.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xs transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-xs text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {thread.subreddit}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">{timeAgo}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {thread.topic}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 mb-2 leading-snug">
                    {thread.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                    {thread.snippet}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                      {thread.score} upvotes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      {thread.numComments} comments
                    </span>
                  </div>
                </div>

                <a
                  href={thread.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 self-end md:self-center"
                >
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                    Open on Reddit <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
