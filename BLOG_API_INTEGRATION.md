# Blog & Content API Integration

This document explains how the Trip Planner app automatically fetches and updates blog content for three main sections.

## Overview

The app has an automatic content discovery system that populates the following pages with fresh travel-related content:

1. **Get Inspired** - `/get-inspired` - General travel inspiration and tips
2. **Hidden Gems** - `/hidden-gems` - Lesser-known travel destinations and local experiences
3. **Adventure Ideas** - `/adventure-ideas` - Adventure activities and thrilling experiences

## How It Works

### Content Sources

The app fetches content from multiple sources:

1. **Reddit** (Free, No Auth Required)
   - Main travel communities for each category
   - Fresh user-generated content weekly

2. **Dev.to** (Free, No Auth Required)
   - Technical travel blogs and lifestyle articles
   - Quality-curated content from developers who travel

3. **Hashnode** (Free, GraphQL API)
   - Travel blogs from content creators
   - Tagged content: travel, adventure, nomad

4. **NewsAPI** (Optional, API Key Required)
   - Travel news and articles
   - Requires FREE key from https://newsapi.org

### Category-Specific Reddit Communities

The app automatically fetches from category-specific subreddits:

#### Get Inspired
- `r/travel` - General travel discussions
- `r/backpacking` - Budget travel and backpacking
- `r/digitalnomad` - Digital nomads and location independent work
- `r/worldtravel` - Around-the-world travel
- `r/touring` - Travel tours and travel planning

#### Hidden Gems
- `r/offbeat` - Off-the-beaten-path locations
- `r/travel` - General travel
- `r/wanderlust` - Travel inspiration
- `r/hiddenplaces` - Secret locations
- `r/sleepyplaces` - Small, quiet towns

#### Adventure Ideas
- `r/adventuretravel` - Adventure travel experiences
- `r/backpacking` - Adventure backpacking
- `r/outdoors` - Outdoor activities
- `r/mountaineering` - Mountain climbing
- `r/rockclimbing` - Rock climbing spots
- `r/CampingandHiking` - Camping and hiking trails

## Setup & Configuration

### Basic Setup (No Configuration Needed)

The following sources require NO configuration and work out of the box:
- Reddit API
- Dev.to API
- Hashnode API

These will automatically populate content in all three pages with fallback support.

### Optional: Add NewsAPI

To include additional travel news content:

1. Get a FREE API key from [newsapi.org](https://newsapi.org)
2. Add to `.env.local`:
   ```
   NEWS_API_KEY=your_api_key_here
   ```
3. Restart the app

## API Endpoint

The content API is available at:

```
GET /api/content?category=<category>
```

### Parameters

- `category` (optional): One of `get-inspired`, `hidden-gems`, `adventure-ideas`, or `all`

### Response

```json
{
  "success": true,
  "data": [
    {
      "title": "Blog post title",
      "description": "Brief description",
      "image": "https://...",
      "link": "https://...",
      "author": "Author name",
      "date": "3/30/2026",
      "source": "Reddit"
    }
  ],
  "cached": false,
  "count": 12,
  "category": "get-inspired"
}
```

## Caching

Content is cached for **1 hour** to improve performance and reduce API calls.

Cache clears automatically after 1 hour, and fresh content is fetched on the next request.

## Fallback Content

If all APIs fail, the app displays hardcoded fallback content relevant to each category. This ensures the pages always have content to display.

## Adding More Content Sources

### Adding a New API Source

To add a new blog platform or API:

1. Create a new fetch function in `/app/api/content/route.ts`:

```typescript
async function fetchCustomSource(): Promise<ContentItem[]> {
  try {
    const response = await axios.get('https://api.example.com/travel', {
      timeout: 8000,
    });

    return (response.data || []).map((item: any) => ({
      title: item.title.substring(0, 100),
      description: item.description.substring(0, 200),
      image: item.image || 'https://via.placeholder.com/400x300',
      link: item.url,
      author: item.author || 'Custom Source',
      date: new Date(item.publishedDate).toLocaleDateString(),
      source: 'Custom Source',
    }));
  } catch (error) {
    console.error('Error fetching custom content:', error);
    return [];
  }
}
```

2. Add it to the parallel fetch in the GET handler:

```typescript
const [redditContent, devtoContent, hashnodeContent, newsContent, customContent] = await Promise.all([
  fetchRedditContent(communities, 10),
  fetchDevtoContent('travel'),
  fetchHashnodeContent(),
  fetchNewsAPIContent(),
  fetchCustomSource(), // Add this
]);

allContent = [...redditContent, ...devtoContent, ...hashnodeContent, ...newsContent, ...customContent];
```

3. Deploy and test!

### Suggested Additional Sources

Here are some popular sources you could integrate:

1. **Medium.com** - Travel blogs (requires RSS parsing)
2. **Hacker News** - Travel discussions
3. **Dev Community** - Technical travel content
4. **Twitter/X API** - Travel thread collections
5. **YouTube Data API** - Travel vlog titles/summaries
6. **Tumblr API** - Travel photo blogs
7. **Any RSS Feed** - Custom travel blogs (with xml2js library)

## Troubleshooting

### No Content Appearing

1. Check browser console for errors
2. Visit `/api/content?category=get-inspired` directly to test the API
3. Ensure no external APIs are blocked by firewall
4. Check that .env.local is correctly configured (for NewsAPI)

### Content Not Updating

1. Content is cached for 1 hour - wait for cache to expire
2. Restart the development server to clear cache
3. Check that APIs are accessible from your network

### Reddit API Returns No Content

- Reddit may rate-limit if hitting too many communities quickly
- Try reducing the number of communities in REDDIT_COMMUNITIES_MAP
- Add longer timeout values

## Performance Notes

- All API calls happen in parallel for speed
- Content is deduplicated to avoid showing the same article twice
- Images are validated to ensure they load correctly
- Failed API calls don't block the entire response (graceful degradation)

## Future Enhancements

Potential improvements:

1. **Database Caching** - Store content in Convex instead of memory
2. **Scheduled Updates** - Cron job to pre-fetch content
3. **User Preferences** - Let users customize content sources
4. **Manual Refresh** - UI button to manually refresh content
5. **Content Filtering** - Filter by language, date range, etc.

## Questions?

Check these resources:
- Reddit API: https://www.reddit.com/dev/api
- Dev.to API: https://developers.forem.com/api/
- Hashnode API: https://hashnode.com/api
- NewsAPI: https://newsapi.org/docs
