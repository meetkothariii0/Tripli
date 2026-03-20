# 🌍 Tripli - AI-Powered Travel Planner

An intelligent travel planning application powered by AI that generates personalized trip itineraries, hotel recommendations, restaurant suggestions, and day-by-day activities with beautiful images.

🚀 **[Live Demo: https://tripli-kappa.vercel.app](https://tripli-kappa.vercel.app)**

![Tripli](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)
![Live](https://img.shields.io/badge/Live-Vercel-blue)

---

## ✨ Features

### 🤖 AI-Powered Planning
- **Groq LLM Integration** - Fast, intelligent trip recommendations
- **Smart Conversations** - Natural dialogue for trip planning
- **Personalized Itineraries** - 5+ day detailed plans with activities
- **Budget-Aware** - Recommendations based on your budget range

### 🏨 Complete Travel Info
- **Hotel Recommendations** - With real images, pricing, and ratings
- **Restaurant Suggestions** - Multiple price ranges and cuisines
- **Daily Activities** - Curated attractions, landmarks, and experiences
- **Google Maps Links** - Easy navigation to every recommendation

### 🎨 Modern UI/UX
- **Beautiful Design** - Gradient backgrounds and smooth animations
- **Responsive Layouts** - Works on mobile, tablet, and desktop
- **Real Images** - High-quality photos via Pixabay API
- **Intuitive Flow** - Simple step-by-step trip planning

### 🔐 Authentication & Security
- **Clerk OAuth** - Secure Google authentication
- **Arcjet Rate Limiting** - Protection against abuse
- **Real-time Sync** - Convex database for instant updates

### 💰 Subscription Tiers
- **Free Plan** - 1 trip/month with basic recommendations
- **Pro Plan** - ₹99/month, unlimited trips with advanced AI
- **Premium Plan** - ₹299/month, all features + priority support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15.4.5, React 19, TypeScript, Tailwind CSS 4.0 |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | Convex (Real-time sync) |
| **Authentication** | Clerk (OAuth: Google) |
| **AI** | Groq API (LLaMA models) |
| **Images** | Pixabay API |
| **Rate Limiting** | Arcjet |
| **Styling** | Tailwind CSS, Motion (animations) |
| **Icons** | Lucide React |
| **Components** | Shadcn/UI |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tripli.git
cd tripli
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment_id
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

---

## 📋 Configuration

### Required API Keys

#### 1. Groq API (AI)
- Get free API key: https://console.groq.com
- Free tier: 150 requests/minute

#### 2. Pixabay API (Images)
- Get free API key: https://pixabay.com/api/
- Free tier: Unlimited requests

#### 3. Convex (Database)
- Create account: https://convex.dev
- Free tier: 10GB storage, 1M transactions/month

#### 4. Clerk (Authentication)
- Create account: https://clerk.com
- Free tier: Unlimited users

#### 5. Arcjet (Rate Limiting)
- Create account: https://www.arcjet.com
- Free tier: 3,600 requests/hour

---

## 📁 Project Structure

```
tripli/
├── app/
│   ├── api/
│   │   ├── aimodel/route.tsx          # Groq AI integration
│   │   ├── arcjet/route.ts            # Rate limiting
│   │   └── debug/route.ts             # Debug endpoint
│   ├── _components/
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── Hero.tsx                   # Homepage hero
│   │   └── PopularCityList.tsx        # City suggestions
│   ├── create-new-trip/
│   │   ├── page.tsx                   # Trip creation page
│   │   └── _components/
│   │       ├── ChatBox.tsx            # AI conversation
│   │       ├── MapComponent.tsx       # Destination map
│   │       └── ...other UI components
│   ├── trip-details/page.tsx          # Trip itinerary display
│   ├── pricing/page.tsx               # Pricing page
│   ├── contact-us/page.tsx            # Contact form
│   └── layout.tsx                     # Root layout
├── components/
│   ├── ui/                            # Shadcn UI components
│   └── magicui/                       # Magic UI components
├── convex/
│   ├── schema.ts                      # Database schema
│   ├── TripDetail.ts                  # Trip operations
│   └── user.ts                        # User management
├── public/                            # Static assets
└── package.json                       # Dependencies
```

---

## 🎯 Usage

### 1. **Plan a Trip**
- Click "Create New Trip"
- Follow AI-guided conversation:
  - Enter origin city
  - Select destination
  - Choose group size (1-20 people)
  - Set duration (1-30 days)
  - Specify budget per person
  - Select activity preferences

### 2. **View Recommendations**
- See hotel recommendations with photos, prices, ratings
- Get restaurant suggestions with cuisines and locations
- Follow day-by-day activities with images

### 3. **Share & Save**
- Export your itinerary
- Share with friends
- Save for future reference

---

## 🧪 Testing

Test the API and features:
```bash
npm run dev
```

Visit `http://localhost:3000` and start planning a trip!

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy Tripli"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import from GitHub repo
- Add environment variables
- Deploy!

---

## 📈 Roadmap

- [ ] User trip history
- [ ] Trip sharing with friends
- [ ] Flight booking integration
- [ ] Hotel booking system
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Meet Kothari** - [GitHub](https://github.com/Meet807)

---

## 🙏 Acknowledgments

- Groq for fast LLM inference
- Convex for real-time database
- Clerk for authentication
- Pixabay for high-quality images
- Vercel for hosting
- Next.js team for the amazing framework

---

⭐ If you find this project helpful, please consider starring the repository!
