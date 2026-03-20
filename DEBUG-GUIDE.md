# 🔍 Trip Planner - Debug Report & API Testing Guide

## 📋 Current System Status

### ✅ What's Working:
- Convex database connected and configured
- Clerk authentication setup
- All UI components (SelectDays, GroupSizeUi, BudgetUi, TripTypeUi)
- Error handling in ChatBox component
- API route structure and error responses
- Trip details page with Suspense boundary
- Build process (compiles successfully)
- Dev server running on port 3000

### ❌ What Needs Fixing:
- **🔴 Groq API Key is INVALID** - Must regenerate before testing

### ⚠️ Issues Found:
1. Groq API returning: `invalid_api_key` error
2. Trip creation flow can't complete without valid API key

---

## 🚀 How to Fix the Groq API Key

### Step 1: Get a New API Key
1. Go to: https://console.groq.com/keys
2. Login with your Groq account (create one if needed)
3. Click **"Create API Key"**
4. Copy the entire key (starts with `gsk_`)

### Step 2: Update Environment
1. Open `.env.local` in the project
2. Replace the GROQ_API_KEY value:
   ```env
   GROQ_API_KEY=<paste-your-new-key-here>
   ```
3. Save the file

### Step 3: Restart Dev Server
1. Kill the current server (Ctrl+C)
2. Run `npm run dev`
3. Server will pick up the new key automatically

---

## 🧪 Testing the Trip Creation Flow

### Method 1: Use the Debug Endpoint

**Check Environment:**
```bash
curl http://localhost:3000/api/debug
```

Expected response:
```json
{
  "timestamp": "2026-03-20T...",
  "environment": {
    "groq_api_key_set": true,
    "groq_api_key_prefix": "gsk_hbb...",
    "convex_url_set": true,
    "arcjet_key_set": true,
    "node_env": "development"
  }
}
```

**Test Groq API Key:**
```bash
curl -X POST http://localhost:3000/api/debug \
  -H "Content-Type: application/json" \
  -d '{"testType":"groq-key"}'
```

If key is valid, you'll see:
```json
{
  "status": "GROQ_KEY_VALID",
  "data": {
    "choices": [...]
  }
}
```

If key is invalid:
```json
{
  "status": "GROQ_API_KEY_INVALID",
  "error": {
    "message": "Invalid API Key",
    "code": "invalid_api_key"
  },
  "action": "Regenerate API key from https://console.groq.com/keys"
}
```

---

### Method 2: Manual UI Testing

1. **Navigate to:** http://localhost:3000/create-new-trip

2. **Sign in** (if not already):
   - Use Clerk's sign-up/sign-in
   - Ensure you're logged in (check auth header)

3. **Start Trip Creation:**
   - Type: "I want to plan a trip"
   - Chat should respond with: "Where are you traveling from?"

4. **Step-by-Step Conversation:**
   ```
   You: "Mumbai"
   AI: "Where would you like to go?"
   
   You: "Goa"
   AI: Shows GROUP SIZE UI
   
   You: Click "Couple"
   AI: Shows TRIP DURATION UI (NEW SelectDays component!)
   
   You: Select "3 Days" or use slider
   AI: Shows BUDGET UI
   
   You: Click "Moderate"
   AI: Shows TRIP TYPE UI
   
   You: Click "Beach" + "Party"
   AI: Generates trip plan with:
       - Hotels (4-5 recommendations)
       - Restaurants
       - Day-by-day itinerary
       - "View Trip" button
   ```

5. **Click "View Trip":**
   - Should navigate to `/trip-details`
   - Display all recommendations
   - Show full itinerary

---

## 🔧 Troubleshooting Common Issues

### Issue: "Invalid API Key" Error in Chat

**Cause:** Groq API key is expired or invalid

**Fix:**
1. Get new key from https://console.groq.com/keys
2. Update `.env.local`
3. Restart dev server
4. Refresh browser

---

### Issue: Chat Shows "Sorry, there was an error"

**Cause:** Could be several things - check browser console

**Fix:**
1. Open DevTools: F12
2. Go to **Console** tab
3. Look for errors starting with "Error generating final plan:"
4. See what error message is shown
5. Check **Network** tab:
   - Filter by "aimodel"
   - Click the request
   - See the response body for details

---

### Issue: SelectDays Component Not Showing

**Cause:** Browser cache or component not loading

**Fix:**
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+F5
3. Or restart with fresh session

---

### Issue: Redux/State Error

**If you see:** "Cannot read properties of undefined"

**Check:**
1. Clerk authentication is working (can sign in)
2. User context is properly initialized
3. Browser console for specific error line

---

## 📊 Expected API Response Format

### Initial Conversation Response:
```json
{
  "resp": "Where would you like to go?",
  "ui": "null",
  "trip_plan": {
    "origin": "Mumbai",
    "destination": null,
    "duration": null,
    "group_size": null,
    "budget": null,
    "interests": null
  }
}
```

### Final Trip Plan Response:
```json
{
  "resp": "Perfect! Here's your complete trip plan...",
  "ui": "final",
  "trip_plan": {
    "origin": "Mumbai",
    "destination": "Goa",
    "duration": "3 Days",
    "budget": "Moderate",
    "group_size": "Couple",
    "interests": "Beach, Party, Photography",
    "hotels": [
      {
        "hotel_name": "Hotel Name",
        "hotel_address": "Address",
        "price_per_night": "₹X,XXX",
        "rating": 4.8,
        "google_maps_link": "https://maps.google.com/...",
        "hotel_image_url": "https://..."
      }
    ],
    "restaurants": [
      {
        "name": "Restaurant Name",
        "cuisine_type": "Cuisine",
        "price_range": "₹X,XXX",
        "rating": 4.6,
        "google_maps_link": "https://...",
        "image_url": "https://..."
      }
    ],
    "itinerary": {
      "day_1": {
        "day_title": "Arrival Day",
        "activities": [
          {
            "place_name": "Beach Name",
            "place_details": "Description",
            "ticket_pricing": "₹X",
            "recommended_duration": "2 hours",
            "google_maps_link": "https://..."
          }
        ],
        "recommended_restaurants": {
          "breakfast": {...},
          "lunch": {...},
          "dinner": {...}
        },
        "tips": ["Tip 1", "Tip 2"],
        "recommended_transport": "Taxi or scooter rental"
      }
    }
  }
}
```

---

## ✅ Complete Testing Checklist

- [ ] Groq API key regenerated and updated in `.env.local`
- [ ] Dev server restarted after key update
- [ ] Debug endpoint (`/api/debug`) shows all keys set
- [ ] Groq key test endpoint (`/api/debug` with POST) returns VALID status
- [ ] Signed in to app via Clerk
- [ ] Initial chat message loads ("Where are you traveling from?")
- [ ] Origin answer submitted without error
- [ ] Destination answer submitted
- [ ] GroupSizeUi component appears and selection works
- [ ] **SelectDays component appears** with range slider and preset buttons
- [ ] Day selection works (both slider and buttons)
- [ ] BudgetUi component appears and works
- [ ] TripTypeUi component appears and multiple selections work
- [ ] Trip plan generates with full details
- [ ] Browser console shows no critical errors
- [ ] Trip is saved to Convex (check in Convex dashboard)
- [ ] "View Trip" button works and navigates to `/trip-details`
- [ ] Trip details page displays all recommendations
- [ ] Hotels show ratings, images, and map links
- [ ] Itinerary displays day-by-day activities
- [ ] Restaurants and cafes are listed

---

## 📝 Next Steps After Getting API Key Working

1. **Phase 3:** Create pricing & contact pages
2. **Phase 4:** Build user profile with trip history
3. **Phase 5:** Add trip editing, sharing, real maps, and images

---

## 🆘 Still Having Issues?

1. Check browser Console (F12 → Console tab)
2. Check Network tab for API requests
3. Look at server logs (terminal where `npm run dev` is running)
4. Try clearing `.next` cache: `rm -r .next`
5. Reinstall deps: `rm -r node_modules && npm install`

