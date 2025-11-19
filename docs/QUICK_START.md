# Quick Start Guide: Using Event Tracking and Recommendations

This guide will help you quickly set up and use the user event tracking and product recommendation system.

## Prerequisites

- MySQL database running
- Node.js installed
- Environment variables configured (see `.env.sample`)

## Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
```bash
# Create the user_event table
mysql -u root -p your_database < migrations/001_create_user_event_table.sql
```

### Step 3: Configure Environment
Create a `.env` file:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dm
DB_USER=root
DB_PASSWORD=your_password
```

### Step 4: Start Development Server
```bash
npm run dev
```

## Using the Features

### For Users (Frontend)

1. **Browse Products**: Visit `/shop` to see all products
2. **View Product Details**: Click on any product to see details
   - The system automatically tracks this as a "view" event
3. **Add to Cart**: Click the shopping cart icon
   - The system tracks this as an "add_to_cart" event
4. **See Recommendations**: 
   - Visit the home page `/` to see personalized recommendations
   - Recommendations also appear at the top of the shop page

### For Developers (Backend)

#### Track Custom Events
```typescript
// In any component
const { trackEvent } = useEventTracking();

// Track a view
trackEvent(productId, 'view');

// Track add to cart
trackEvent(productId, 'add_to_cart');

// Track purchase (when implemented)
trackEvent(productId, 'purchase');
```

#### Get User Events
```typescript
// Fetch user's event history
const userId = 123;
const events = await $fetch(`/api/events/user/${userId}`);
```

#### Get Recommendations
```typescript
// Fetch recommendations for a user
const userId = 123;
const recommendations = await $fetch(`/api/recommendations/${userId}`);
```

#### Use the Recommendations Component
```vue
<template>
  <ProductRecommendedProducts @add-to-cart="handleAddToCart" />
</template>

<script setup>
const { trackEvent } = useEventTracking();

function handleAddToCart(productId) {
  trackEvent(productId, 'add_to_cart');
  // Additional cart logic here
}
</script>
```

## Testing the System

### Manual Testing Steps

1. **Clear your localStorage** to simulate a new user:
   ```javascript
   localStorage.clear();
   ```

2. **Visit several product pages** to create view events

3. **Add some products to cart** to create add_to_cart events

4. **Visit the home page** to see your personalized recommendations

5. **Check the browser console** to see your generated user ID

### Verify Events in Database
```sql
-- See all events for a user
SELECT * FROM user_event WHERE user_id = 123 ORDER BY created_at DESC;

-- Count events by type
SELECT event_type, COUNT(*) as count 
FROM user_event 
GROUP BY event_type;
```

## How Recommendations Work

1. **New Users**: Get popular products as recommendations
2. **Users with History**: 
   - System analyzes your recent 50 events
   - Identifies your preferred product categories
   - Recommends products from those categories you haven't seen
   - Shows up to 10 recommendations

## Troubleshooting

### No Recommendations Showing
- Check that the database migration ran successfully
- Verify your user has some tracked events
- Check browser console for errors
- Ensure API endpoints are accessible

### Events Not Being Tracked
- Check browser console for network errors
- Verify database connection in `.env`
- Ensure `user_event` table exists
- Check that product IDs are valid

### Recommendations Not Relevant
- System needs more data (interact with more products)
- Try products from different categories
- Clear localStorage and start fresh

## API Reference

### Track Event
```bash
curl -X POST http://localhost:3000/api/events/track \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "product_id": 456,
    "event_type": "view"
  }'
```

### Get User Events
```bash
curl http://localhost:3000/api/events/user/123
```

### Get Recommendations
```bash
curl http://localhost:3000/api/recommendations/123
```

## Next Steps

- Integrate with authentication system (replace localStorage)
- Add purchase event tracking
- Implement analytics dashboard
- Configure ML-based recommendations
- Add A/B testing

## Need Help?

See the detailed documentation:
- [USER_EVENT_TRACKING.md](./USER_EVENT_TRACKING.md) - Complete feature documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical implementation details
- [../migrations/README.md](../migrations/README.md) - Database migration guide
