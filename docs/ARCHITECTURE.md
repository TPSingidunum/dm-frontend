# System Architecture

## User Event Tracking and Recommendation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue/Nuxt)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Home Page    │  │ Shop Page    │  │ Product Page │         │
│  │              │  │              │  │              │         │
│  │ - Shows      │  │ - Shows      │  │ - Shows      │         │
│  │   Recommend  │  │   Products   │  │   Details    │         │
│  │   -ations    │  │ - Shows      │  │ - Tracks     │         │
│  │              │  │   Recommend  │  │   View Event │         │
│  └──────────────┘  │   -ations    │  └──────────────┘         │
│                     │ - Tracks     │                            │
│                     │   Add-to-Cart│                            │
│                     └──────────────┘                            │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         useEventTracking Composable                      │   │
│  │  - getUserId() - Gets/generates user ID                 │   │
│  │  - trackEvent() - Sends events to API                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Nitro)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/events/track                                 │   │
│  │  - Validates input (user_id, product_id, event_type)    │   │
│  │  - Inserts event into database                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GET /api/events/user/:userId                           │   │
│  │  - Retrieves user's event history                       │   │
│  │  - Includes related product data                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GET /api/recommendations/:userId                       │   │
│  │  1. Fetch user's recent events (last 50)               │   │
│  │  2. Calculate weighted scores                           │   │
│  │     - purchase: 3 points                                │   │
│  │     - add_to_cart: 2 points                            │   │
│  │     - view: 1 point                                     │   │
│  │  3. Identify top 5 products user likes                  │   │
│  │  4. Find their categories                               │   │
│  │  5. Recommend similar products (not yet viewed)         │   │
│  │  6. Fill with popular products if needed                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MySQL)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  user_event Table                                       │   │
│  │  ┌──────────────┬───────────────┬─────────────────┐    │   │
│  │  │ event_id (PK)│ user_id (FK)  │ product_id (FK) │    │   │
│  │  │ event_type   │ created_at    │                 │    │   │
│  │  └──────────────┴───────────────┴─────────────────┘    │   │
│  │  Indexes: user_id, product_id, event_type, created_at  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  product Table (Existing)                               │   │
│  │  - product_id, name, description, img_url              │   │
│  │  - slug, category_id, seo_id                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  user Table (Existing)                                  │   │
│  │  - user_id, username, email, password                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Event Tracking Flow
```
User Action → Component Handler → trackEvent() → 
POST /api/events/track → Validate → Insert DB → Return Success
```

### Recommendation Flow
```
User Visits Page → Component Mounts → GET /api/recommendations/:userId →
Fetch User Events → Calculate Scores → Identify Categories →
Find Similar Products → Filter Viewed → Return Recommendations →
Display in UI
```

## Event Weighting Example

```
User History:
- View Product A (category: Electronics) → +1 point
- View Product B (category: Electronics) → +1 point
- Add Product A to cart → +2 points
- View Product C (category: Books) → +1 point
- Add Product B to cart → +2 points

Scores:
- Product A: 3 points (1 view + 2 add_to_cart)
- Product B: 3 points (1 view + 2 add_to_cart)
- Product C: 1 point (1 view)

Top Category: Electronics (6 points)

Recommendation Strategy:
→ Find more Electronics products
→ Exclude Products A, B, C (already seen)
→ Return up to 10 new Electronics products
```

## Component Hierarchy

```
App
├── Home Page
│   └── ProductRecommendedProducts
│       ├── Uses: useEventTracking()
│       └── Fetches: /api/recommendations/:userId
│
├── Shop Page
│   ├── ProductRecommendedProducts
│   │   └── Fetches: /api/recommendations/:userId
│   └── Product Cards
│       └── onClick: trackEvent(id, 'add_to_cart')
│
└── Product Detail Page
    ├── Uses: useEventTracking()
    └── onMounted: trackEvent(id, 'view')
```

## Technology Stack

```
Frontend:
- Vue 3 (Composition API)
- Nuxt 4
- TypeScript
- Nuxt UI (Component Library)

Backend:
- Nitro (Nuxt Server)
- Drizzle ORM
- MySQL2

Database:
- MySQL
```

## File Structure

```
dm-frontend/
├── app/
│   ├── components/
│   │   └── product/
│   │       └── RecommendedProducts.vue
│   ├── composables/
│   │   └── useEventTracking.ts
│   └── pages/
│       ├── index.vue (home)
│       ├── shop/index.vue
│       └── product/[slug].vue
├── server/
│   ├── api/
│   │   ├── events/
│   │   │   ├── track.post.ts
│   │   │   └── user/[userId].get.ts
│   │   └── recommendations/
│   │       └── [userId].get.ts
│   └── database/
│       ├── connection.ts
│       └── schemas/
│           └── user-event.schema.ts
├── migrations/
│   ├── 001_create_user_event_table.sql
│   └── README.md
└── docs/
    ├── USER_EVENT_TRACKING.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── QUICK_START.md
    └── ARCHITECTURE.md (this file)
```
