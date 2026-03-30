import axios from 'axios';

interface ContentItem {
  title: string;
  description: string;
  image: string;
  link: string;
  author: string;
  date: string;
  source?: string;
}

// Simple in-memory cache with TTL
const cache: { [key: string]: { data: ContentItem[]; timestamp: number } } = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Category to Reddit communities mapping
const REDDIT_COMMUNITIES_MAP: { [key: string]: string[] } = {
  'get-inspired': ['r/travel', 'r/backpacking', 'r/digitalnomad', 'r/worldtravel', 'r/touring'],
  'hidden-gems': ['r/offbeat', 'r/travel', 'r/wanderlust', 'r/hiddenplaces', 'r/sleepyplaces'],
  'adventure-ideas': ['r/adventuretravel', 'r/backpacking', 'r/outdoors', 'r/mountaineering', 'r/rockclimbing', 'r/CampingandHiking'],
};

function getFromCache(key: string): ContentItem[] | null {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: ContentItem[]): void {
  cache[key] = { data, timestamp: Date.now() };
}

// Fetch Reddit posts from specified communities
async function fetchRedditContent(communities: string[], limit: number = 15): Promise<ContentItem[]> {
  try {
    const results: ContentItem[] = [];

    for (const community of communities) {
      try {
        const cleanCommunity = community.replace(/^r\//, '');
        // Fetch from Reddit's JSON endpoint (no auth required for public communities)
        const response = await axios.get(`https://www.reddit.com/r/${cleanCommunity}/top.json?t=week&limit=15`, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          },
          timeout: 8000,
        });

        const posts = response.data.data.children || [];

        for (const post of posts) {
          const postData = post.data;

          // Filter out stickied posts and self-posts without content
          if (postData.stickied) continue;

          // Get image from post
          let image = 'https://via.placeholder.com/400x300?text=Travel+Content';
          if (postData.thumbnail && postData.thumbnail.startsWith('http')) {
            image = postData.thumbnail;
          } else if (postData.preview?.images?.[0]?.source?.url) {
            image = postData.preview.images[0].source.url;
          } else if (postData.media_metadata) {
            // Try to extract from media metadata
            const firstMedia = Object.values(postData.media_metadata)[0] as any;
            if (firstMedia?.s?.x) image = firstMedia.s.x;
          }

          results.push({
            title: postData.title.substring(0, 100),
            description: postData.selftext?.substring(0, 200) || postData.title.substring(100, 200) || 'Discussion post',
            image: image,
            link: `https://reddit.com${postData.permalink}`,
            author: postData.author || 'Reddit',
            date: new Date(postData.created_utc * 1000).toLocaleDateString(),
            source: `r/${cleanCommunity}`,
          });

          if (results.length >= limit) break;
        }
      } catch (error) {
        console.error(`Error fetching from r/${community}:`, error);
        continue;
      }
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error('Error fetching Reddit content:', error);
    return [];
  }
}

// Fetch from Dev.to API (public API)
async function fetchDevtoContent(tag: string = 'travel'): Promise<ContentItem[]> {
  try {
    const response = await axios.get(`https://dev.to/api/articles?tag=${tag}&per_page=12`, {
      timeout: 8000,
    });

    return (response.data || [])
      .filter((article: any) => article.cover_image) // Only articles with images
      .map((article: any) => ({
        title: article.title.substring(0, 100),
        description: article.description?.substring(0, 200) || article.title.substring(100, 200),
        image: article.cover_image || 'https://via.placeholder.com/400x300?text=Dev.to',
        link: article.url,
        author: article.user?.name || 'Dev.to',
        date: new Date(article.published_at).toLocaleDateString(),
        source: 'Dev.to',
      }))
      .slice(0, 12);
  } catch (error) {
    console.error('Error fetching from Dev.to:', error);
    return [];
  }
}

// Fetch from HashNode API - travel related blogs
async function fetchHashnodeContent(): Promise<ContentItem[]> {
  try {
    const response = await axios.post(
      'https://gql.hashnode.com',
      {
        query: `
          query {
            feed(first: 15, tagSlugs: ["travel", "adventure", "nomad"]) {
              edges {
                node {
                  id
                  title
                  brief
                  coverImage {
                    url
                  }
                  url
                  author {
                    name
                  }
                  publishedAt
                }
              }
            }
          }
        `,
      },
      { timeout: 8000 }
    );

    if (!response.data.data?.feed?.edges) return [];

    return response.data.data.feed.edges
      .map((edge: any) => {
        const node = edge.node;
        return {
          title: node.title?.substring(0, 100) || 'Travel Blog',
          description: node.brief?.substring(0, 200) || node.title?.substring(100, 200),
          image: node.coverImage?.url || 'https://via.placeholder.com/400x300?text=Hashnode',
          link: node.url,
          author: node.author?.name || 'Hashnode Author',
          date: new Date(node.publishedAt).toLocaleDateString(),
          source: 'Hashnode',
        };
      })
      .slice(0, 15);
  } catch (error) {
    console.error('Error fetching from Hashnode:', error);
    return [];
  }
}

// Fetch from NewsAPI - travel news/blogs
async function fetchNewsAPIContent(): Promise<ContentItem[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.warn('NEWS_API_KEY not configured, skipping NewsAPI');
      return [];
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'travel destinations OR travel tips OR adventure',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 15,
        apiKey: apiKey,
      },
      timeout: 8000,
    });

    if (!response.data.articles) return [];

    return response.data.articles
      .filter((article: any) => article.urlToImage) // Only with images
      .map((article: any) => ({
        title: article.title?.substring(0, 100) || 'Travel News',
        description: article.description?.substring(0, 200) || article.title?.substring(100, 200),
        image: article.urlToImage || 'https://via.placeholder.com/400x300?text=Travel+News',
        link: article.url,
        author: article.source?.name || 'News',
        date: new Date(article.publishedAt).toLocaleDateString(),
        source: 'News',
      }))
      .slice(0, 15);
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

// Fetch from Medium RSS feed 
async function fetchMediumContent(): Promise<ContentItem[]> {
  try {
    // Using Medium's RSS feed for travel
    const rssUrl = 'https://medium.com/feed/tag/travel';

    const response = await axios.get(rssUrl, {
      timeout: 8000,
    });

    // For proper XML parsing, would need xml2js library
    // For now, using regex-based parsing as fallback
    const items: ContentItem[] = [];
    
    // This is a simplified approach - in production, use xml2js
    // For now returning empty but can be enhanced
    return items.slice(0, 10);
  } catch (error) {
    console.error('Error fetching from Medium:', error);
    return [];
  }
}

// Fetch from Steemit/Hive (Web3 travel bloggers) - simplified
async function fetchWeb3BlogContent(): Promise<ContentItem[]> {
  try {
    // Using Hive API for travel-related posts
    const response = await axios.get('https://api.hive.blog', {
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        method: 'get_discussions_by_trending',
        params: {
          tag: 'travel',
          limit: 10,
        },
      },
      timeout: 8000,
    });

    return [];
  } catch (error) {
    console.error('Error fetching from Web3 blogs:', error);
    return [];
  }
}

// Fallback hardcoded content if all APIs fail
const FALLBACK_CONTENT: { [key: string]: ContentItem[] } = {
  'get-inspired': [
    {
      title: '10 Hidden Gems in Southeast Asia You Must Visit',
      description: 'Discover the lesser-known destinations that offer authentic experiences away from tourist crowds.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      link: 'https://www.nomadicmatt.com',
      author: 'Nomadic Matt',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'Budget Travel Tips for 2024',
      description: 'How to travel the world on a shoestring budget with these proven strategies.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      link: 'https://www.wanderlust.co.uk',
      author: 'Wanderlust Magazine',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'The Best Time to Visit Popular Destinations',
      description: 'Plan your trip better by knowing the best seasons to visit iconic worldwide locations.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      link: 'https://www.lonelyplanet.com',
      author: 'Lonely Planet',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
  ],
  'hidden-gems': [
    {
      title: 'Undiscovered Islands Perfect for Solo Travelers',
      description: 'Find secluded islands that offer peace, natural beauty, and authentic cultural experiences.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      link: 'https://www.solotravel.com',
      author: 'Solo Travel Guide',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'Secret Villages in Europe Tourists Never Visit',
      description: 'Experience authentic European culture in charming villages off the beaten path.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      link: 'https://www.europeantravel.com',
      author: 'European Travel Expert',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'Best Local Markets Around the World',
      description: 'Immerse yourself in local cultures by exploring traditional markets and bazaars.',
      image: 'https://images.unsplash.com/photo-1514306688991-b34db6da6341?w=400&h=300&fit=crop',
      link: 'https://www.localmarkets.travel',
      author: 'Travel & Culture',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
  ],
  'adventure-ideas': [
    {
      title: '20 Thrilling Adventure Activities to Try',
      description: 'From rock climbing to parasailing, discover the best adventure activities worldwide.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      link: 'https://www.adventurejunkie.com',
      author: 'Adventure Junkie',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'Best Mountain Biking Trails Globally',
      description: 'Explore challenging and scenic trails for mountain biking enthusiasts.',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
      link: 'https://www.mtb.com',
      author: 'Mountain Biker',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
    {
      title: 'Scaling: Rock Climbing Destinations Worldwide',
      description: 'Premier rock climbing spots for climbers of all skill levels.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      link: 'https://www.climbingschool.com',
      author: 'Adventure Sports',
      date: new Date().toLocaleDateString(),
      source: 'Fallback',
    },
  ],
};

// Get fallback content for a specific category
function getFallbackForCategory(category: string): ContentItem[] {
  return FALLBACK_CONTENT[category] || FALLBACK_CONTENT['get-inspired'] || [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';

    // Check cache first
    const cached = getFromCache(category);
    if (cached && cached.length > 0) {
      return Response.json({
        success: true,
        data: cached,
        cached: true,
        source: 'cache',
      });
    }

    let allContent: ContentItem[] = [];

    // Get communities for this category
    const communities = REDDIT_COMMUNITIES_MAP[category] || REDDIT_COMMUNITIES_MAP['get-inspired'];

    try {
      // Fetch from all sources in parallel
      const [redditContent, devtoContent, hashnodeContent, newsContent] = await Promise.all([
        fetchRedditContent(communities, 10),
        fetchDevtoContent('travel'),
        fetchHashnodeContent(),
        fetchNewsAPIContent(),
      ]);

      allContent = [...redditContent, ...devtoContent, ...hashnodeContent, ...newsContent];
    } catch (error) {
      console.error('Error fetching from multiple sources:', error);
      // Continue with whatever we got
    }

    // Remove duplicates by title and link
    const uniqueMap = new Map();
    allContent.forEach((item) => {
      const key = `${item.title.toLowerCase().trim()}|${item.link}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    const uniqueContent = Array.from(uniqueMap.values());

    // Use fetched content or fallback
    const finalContent =
      uniqueContent.length > 0 ? uniqueContent.slice(0, 12) : getFallbackForCategory(category);

    // Cache the result
    setCache(category, finalContent);

    return Response.json({
      success: true,
      data: finalContent,
      cached: false,
      count: finalContent.length,
      category: category,
    });
  } catch (error) {
    console.error('Error in content API:', error);
    const category = new URL(request.url).searchParams.get('category') || 'get-inspired';
    return Response.json(
      {
        success: true,
        error: 'Using fallback content',
        data: getFallbackForCategory(category),
        cached: false,
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
