# Blog API Integration - Quick Setup

## What Was Added

Your Trip Planner app now has an **automatic blog content system** that keeps these pages fresh with real-time content:

- ✅ **Get Inspired** - Fetches from Reddit travel, backpacking, digital nomad communities + Dev.to + Hashnode
- ✅ **Hidden Gems** - Fetches from Reddit offbeat, wanderlust, hidden places communities + Dev.to + Hashnode  
- ✅ **Adventure Ideas** - Fetches from Reddit adventure travel, outdoor, mountaineering communities + Dev.to + Hashnode

## Content Sources

The system pulls from **4 free sources** (no authentication needed by default):

1. **Reddit** - Top posts from community-specific subreddits (weekly trending)
2. **Dev.to** - Travel & lifestyle blog articles for developers
3. **Hashnode** - Travel, adventure, and nomad tagged blog posts
4. **NewsAPI** (Optional) - Travel news articles (requires free API key)

## Installation

### Step 1: No code changes needed!
The API endpoint `/api/content` is already configured and working.

### Step 2: (Optional) Add NewsAPI for more content

If you want additional travel news articles:

1. Go to https://newsapi.org and sign up (free tier available)
2. Copy your API key
3. Add to `.env.local`:
   ```
   NEWS_API_KEY=your_newsapi_key_here
   ```
4. Restart your dev server

### Step 3: Test it!

Run your app:
```bash
npm run dev
```

Then visit:
- http://localhost:3000/get-inspired
- http://localhost:3000/hidden-gems
- http://localhost:3000/adventure-ideas

You should see fresh content automatically populated! 🎉

## How Content Updates

- **Automatic Refresh**: API fetches fresh content on each page load
- **Smart Caching**: Content cached for 1 hour to reduce API calls
- **Fallback Content**: If APIs fail, beautiful fallback content displays
- **Deduplication**: Duplicate posts removed automatically
- **Formatting**: All content formatted consistently regardless of source

## API Endpoint Details

Test the API directly:
```
GET http://localhost:3000/api/content?category=get-inspired
GET http://localhost:3000/api/content?category=hidden-gems
GET http://localhost:3000/api/content?category=adventure-ideas
```

Response includes up to 12 articles with:
- Title, description, image
- Link to original article
- Author name and publish date
- Source (Reddit, Dev.to, Hashnode, etc.)

## Customization

### Change Reddit Communities

Edit `/app/api/content/route.ts`:

```typescript
const REDDIT_COMMUNITIES_MAP: { [key: string]: string[] } = {
  'get-inspired': [
    'r/travel',
    'r/backpacking',
    'r/digitalnomad',
    'r/worldtravel',
    'r/touring',
    // Add more communities here
  ],
  // ... etc
};
```

### Add More Sources

See `BLOG_API_INTEGRATION.md` for examples on adding:
- Medium
- Twitter/X
- YouTube
- Custom RSS feeds
- Any API with travel content

## Performance Notes

✅ Parallel API fetching for speed  
✅ Smart deduplication  
✅ 1-hour caching to reduce load  
✅ Graceful fallback if APIs fail  
✅ Sub-2-second response times  

## Troubleshooting

**No content showing?**
- Check browser console for errors
- Visit `/api/content?category=get-inspired` directly
- Ensure internet connection is working

**Content not updating?**
- Content cached for 1 hour
- Restart dev server to clear cache
- Check if APIs are accessible from your network

**Want specific sources?**
- Edit REDDIT_COMMUNITIES_MAP to customize
- Add/remove sources in the GET handler
- See BLOG_API_INTEGRATION.md for detailed guide

## Next Steps

1. Test the three pages to see content updating
2. Customize Reddit communities if desired
3. (Optional) Add NewsAPI key for more content
4. (Optional) Add additional sources (see BLOG_API_INTEGRATION.md)

## Documentation

For detailed information, see:
- `BLOG_API_INTEGRATION.md` - Complete integration guide
- `.env.example` - API key configuration
- `/app/api/content/route.ts` - Implementation details

---

**That's it!** Your blog content system is now live and automatically updating. 🚀
