# 🧪 Trip Creation Flow Testing Guide

## Current Status

### ✅ What Works:
- SelectDays component with range slider (1-30 days)
- GroupSizeUi component with emoji icons
- BudgetUi component with 3 budget tiers
- TripTypeUi component with 6 activity types
- Map component placeholder
- Convex database setup
- Clerk authentication

### ❌ What Needs Fixing:
- **Groq API Key is INVALID** - Need to regenerate from https://console.groq.com/keys

---

## 🚀 Testing Flow (When API Key is Valid)

### Step-by-Step Testing:

1. **Navigate to:** http://localhost:3000/create-new-trip

2. **Initial Load:**
   - Chat box should show "Hi! 👋" greeting
   - Map component should display on the right side
   - Should prompt: "Where are you traveling from?"

3. **Test Conversation Flow:**
   ```
   Q1: "Where are you traveling from?" 
   → Answer: "Mumbai"
   
   Q2: "Where would you like to go?"
   → Answer: "Goa"
   
   Q3: "Who will be joining you on this trip?" (Click: Couple)
   → UI Component: GroupSizeUi appears
   
   Q4: "How many days will your trip be?"
   → UI Component: SelectDays appears (NEW - with range slider!)
   → Answer: Select "3 Days" or use slider
   
   Q5: "What's your budget range for this trip?"
   → UI Component: BudgetUi appears
   → Answer: Click "Moderate"
   
   Q6: "What type of activities do you like?"
   → UI Component: TripTypeUi appears
   → Answer: Click "Beach", "Party", etc.
   
   Q7: Trip plan generated with:
   - Hotels list
   - Restaurants
   - Day-by-day itinerary
   - Map shows destination
   ```

4. **Verify Output:**
   - Click "View Trip" button at the end
   - Should navigate to `/trip-details` page
   - Should display full itinerary with all recommendations

---

## 🔧 Troubleshooting

### Issue: API Returns Error
**Solution:** Check `.env.local` has valid GROQ_API_KEY

### Issue: Chat doesn't respond
**Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors related to `/api/aimodel`
4. Check Network tab to see API requests

### Issue: SelectDays not appearing
**Check:**
- Confirm SelectDays.tsx compiles (build was successful)
- Clear browser cache: Ctrl+Shift+Delete
- Refresh page

### Issue: Trip details page is blank
**Check:**
- Verify trip data is being sent correctly
- Check browser console for JSON parsing errors
- Ensure useSearchParams hook data is provided

---

## 📊 Expected API Response Format

When AI generates the trip plan, expect:

```json
{
  "resp": "Perfect! Here's your trip plan...",
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
        "rating": 4.5,
        "google_maps_link": "https://..."
      }
    ],
    "itinerary": {
      "day_1": {
        "day_title": "Title",
        "activities": [...],
        "recommended_restaurants": {...}
      }
    }
  }
}
```

---

## ✅ Next Steps to Complete Testing

1. **Regenerate Groq API Key:**
   - Visit: https://console.groq.com/keys
   - Create a new API key
   - Update `.env.local` with new key
   - Restart dev server

2. **Run through conversation flow**

3. **Verify trip details are saved to Convex** (if authenticated)

4. **Check trip appears in user's trip history** (Phase 4 feature)

---

## 📝 Manual Testing Checklist

- [ ] API key regenerated and working
- [ ] Initial chat message loads
- [ ] Origin answer submitted successfully
- [ ] Destination answer submitted
- [ ] GroupSizeUi component appears and works
- [ ] SelectDays component appears and works (NEW!)
- [ ] BudgetUi component appears and works
- [ ] TripTypeUi component appears and works
- [ ] Trip plan generates successfully
- [ ] Map shows destination name
- [ ] "View Trip" button navigates to trip-details
- [ ] Trip details page displays all recommendations
- [ ] Trip is saved to Convex database

---

## 🔍 Debug Quick Commands

Check API endpoint:
```bash
curl -X POST http://localhost:3000/api/aimodel \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}],"isFinal":false}'
```

Check Convex connection:
```bash
# Run in project root
npx convex dev
```

---

**Questions?** Check the console logs and network tab in DevTools for detailed error messages.
