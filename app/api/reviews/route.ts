import axios from 'axios';

interface Review {
  title: string;
  content: string;
  author: string;
  date: string;
  rating?: number;
  source: string;
  link?: string;
}

const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours
const cache: { [key: string]: { data: Review[]; timestamp: number } } = {};

function getFromCache(key: string): Review[] | null {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: Review[]): void {
  cache[key] = { data, timestamp: Date.now() };
}

// Fetch reviews from Reddit travel communities
async function fetchRedditReviews(destination: string): Promise<Review[]> {
  try {
    const results: Review[] = [];
    
    // Try multiple search queries to increase chances of finding reviews
    const searchQueries = [
      `${destination} travel experience`,
      `visiting ${destination}`,
      `trip to ${destination}`,
      `${destination} tips`,
      `${destination} travel`,
      destination, // Just the destination name alone
    ];

    for (const searchQuery of searchQueries) {
      if (results.length >= 8) break; // Stop if we have enough results
      
      try {
        const encodedQuery = encodeURIComponent(searchQuery);
        // Search Reddit for posts about the destination
        const response = await axios.get(`https://www.reddit.com/r/travel/search.json?q=${encodedQuery}&restrict_sr=true&sort=top&t=month&limit=15`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          },
          timeout: 8000,
        });

        const posts = response.data.data.children || [];

        for (const post of posts) {
          if (results.length >= 5) break;
          
          const postData = post.data;

          // Skip if low engagement (more lenient for less common destinations)
          if (postData.stickied || postData.score < 3) continue;

          // Check if post is actually about this destination
          const postText = (postData.title + ' ' + postData.selftext).toLowerCase();
          if (!postText.includes(destination.toLowerCase())) continue;

          results.push({
            title: postData.title.substring(0, 120),
            content: postData.selftext?.substring(0, 400) || postData.title,
            author: postData.author || 'Reddit User',
            date: new Date(postData.created_utc * 1000).toLocaleDateString(),
            rating: postData.ups > 100 ? 5 : postData.ups > 50 ? 4 : postData.ups > 20 ? 3 : 3,
            source: 'Reddit - r/travel',
            link: `https://reddit.com${postData.permalink}`,
          });
        }
      } catch (searchError) {
        // Continue with next search query if this one fails
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching Reddit reviews:', error);
    return [];
  }
}

// Fetch reviews from r/backpacking
async function fetchBackpackingReviews(destination: string): Promise<Review[]> {
  try {
    const results: Review[] = [];
    
    // Try multiple search queries
    const searchQueries = [
      destination,
      `${destination} backpacking`,
      `backpacking in ${destination}`,
      `${destination} budget`,
      `${destination} travel tips`,
      `${destination} visit`,
    ];

    for (const searchQuery of searchQueries) {
      if (results.length >= 8) break;
      
      try {
        const encodedQuery = encodeURIComponent(searchQuery);
        const response = await axios.get(`https://www.reddit.com/r/backpacking/search.json?q=${encodedQuery}&restrict_sr=true&sort=top&t=month&limit=15`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          },
          timeout: 8000,
        });

        const posts = response.data.data.children || [];

        for (const post of posts) {
          if (results.length >= 5) break;
          
          const postData = post.data;

          // Skip if stickied
          if (postData.stickied) continue;

          // Check if post is actually about this destination
          const postText = (postData.title + ' ' + postData.selftext).toLowerCase();
          if (!postText.includes(destination.toLowerCase())) continue;

          results.push({
            title: postData.title.substring(0, 120),
            content: postData.selftext?.substring(0, 400) || postData.title,
            author: postData.author || 'Backpacker',
            date: new Date(postData.created_utc * 1000).toLocaleDateString(),
            rating: postData.ups > 50 ? 5 : postData.ups > 25 ? 4 : postData.ups > 10 ? 3 : 3,
            source: 'Reddit - r/backpacking',
            link: `https://reddit.com${postData.permalink}`,
          });
        }
      } catch (searchError) {
        // Continue with next search query
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching backpacking reviews:', error);
    return [];
  }
}

// Fetch from Dev.to and travel articles
async function fetchTravelExperiences(destination: string): Promise<Review[]> {
  try {
    const results: Review[] = [];
    
    // Try searching for the destination directly
    const response = await axios.get(`https://dev.to/api/articles?search=${encodeURIComponent(destination)}&per_page=25`, {
      timeout: 8000,
    });

    const articles = response.data || [];

    for (const article of articles) {
      // Filter for travel-related content
      const tags = article.tag_list || [];
      const isTravel = tags.some((tag: string) => 
        ['travel', 'adventure', 'tourism', 'backpacking', 'nomad', 'journey', 'destination', 'trip'].includes(tag.toLowerCase())
      );
      
      // Also check if destination is mentioned in title or description
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      const mentions = text.includes(destination.toLowerCase());

      if (!isTravel && !mentions) continue;

      results.push({
        title: article.title?.substring(0, 120) || 'Travel Experience',
        content: article.description?.substring(0, 400) || article.title?.substring(0, 400),
        author: article.user?.name || 'Travel Blogger',
        date: new Date(article.published_at).toLocaleDateString(),
        rating: 4,
        source: 'Dev.to - Travel',
        link: article.url,
      });

      if (results.length >= 8) break;
    }

    return results;
  } catch (error) {
    console.error('Error fetching travel experiences:', error);
    return [];
  }
}

// Fallback reviews - empty by default
const FALLBACK_REVIEWS: { [key: string]: Review[] } = {
  default: [],
};

// Create destination-specific placeholder when no reviews found
function createNoReviewsMessage(destination: string): Review[] {
  return [
    {
      title: `Be the first to share your ${destination} experience!`,
      content: `No reviews found for ${destination} yet in our database. This could mean the destination is lesser-known or newly added. Check back soon as more travelers share their experiences, or visit Reddit's r/travel and r/backpacking communities to find experienced travelers discussing this destination.`,
      author: 'Trip Planner',
      date: new Date().toLocaleDateString(),
      rating: undefined,
      source: 'System',
    },
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination') || '';

    if (!destination) {
      return Response.json(
        { success: false, error: 'Destination parameter required' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = destination.toLowerCase().trim();
    const cached = getFromCache(cacheKey);
    if (cached && cached.length > 0) {
      return Response.json({
        success: true,
        data: cached,
        cached: true,
        destination: destination,
      });
    }

    // Fetch from all sources
    const [redditReviews, backpackingReviews, travelExperiences] = await Promise.all([
      fetchRedditReviews(destination),
      fetchBackpackingReviews(destination),
      fetchTravelExperiences(destination),
    ]);

    // Combine and deduplicate
    const allReviews = [...redditReviews, ...backpackingReviews, ...travelExperiences];
    
    // Remove duplicates by title
    const uniqueMap = new Map();
    allReviews.forEach((review) => {
      const key = review.title.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, review);
      }
    });
    const uniqueReviews = Array.from(uniqueMap.values());

    // Use fetched reviews or destination-specific message
    const finalReviews = uniqueReviews.length > 0 ? uniqueReviews.slice(0, 15) : createNoReviewsMessage(destination);

    // Cache the result
    setCache(cacheKey, finalReviews);

    return Response.json({
      success: true,
      data: finalReviews,
      cached: false,
      count: finalReviews.length,
      destination: destination,
    });
  } catch (error) {
    console.error('Error in reviews API:', error);
    const destination = new URL(request.url).searchParams.get('destination') || 'this destination';
    return Response.json(
      {
        success: true,
        data: createNoReviewsMessage(destination),
        cached: false,
        source: 'error-fallback',
      },
      { status: 200 }
    );
  }
}
