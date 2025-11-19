# User Event Tracking and Product Recommendations

This document describes the user event tracking and product recommendation system implemented in the DM Frontend application.

## Overview

The system tracks user interactions with products and uses this data to provide personalized product recommendations. Events are stored in the database and analyzed to determine which products to recommend to each user.

## Features

### 1. Event Tracking

The system tracks three types of user events:
- **view**: User views a product detail page
- **add_to_cart**: User adds a product to their shopping cart
- **purchase**: User completes a purchase (reserved for future implementation)

### 2. Product Recommendations

The recommendation algorithm:
1. Analyzes user's recent event history (last 50 events)
2. Weights events by importance: purchase (3) > add_to_cart (2) > view (1)
3. Identifies categories the user is interested in based on their top products
4. Recommends products from those categories that the user hasn't interacted with yet
5. Falls back to popular products if user has no history

## Database Schema

### user_event Table

```sql
CREATE TABLE user_event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

**Indexes:**
- `user_id` - for fast user event lookups
- `product_id` - for fast product event lookups
- `event_type` - for filtering by event type
- `created_at` - for time-based queries

## API Endpoints

### Track Event
**POST** `/api/events/track`

Tracks a user interaction event.

**Request Body:**
```json
{
  "user_id": 123,
  "product_id": 456,
  "event_type": "view"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked successfully",
  "event_id": 789
}
```

### Get User Events
**GET** `/api/events/user/{userId}`

Retrieves all events for a specific user, ordered by most recent first.

**Response:**
```json
[
  {
    "event_id": 789,
    "user_id": 123,
    "product_id": 456,
    "event_type": "view",
    "created_at": "2024-11-19T03:32:01.000Z",
    "product": {
      "product_id": 456,
      "name": "Product Name",
      "slug": "product-slug",
      ...
    }
  }
]
```

### Get Recommendations
**GET** `/api/recommendations/{userId}`

Returns personalized product recommendations for a user.

**Response:**
```json
[
  {
    "product_id": 789,
    "name": "Recommended Product",
    "slug": "recommended-product",
    "img_url": "https://...",
    "description": "Product description",
    "category_id": 1
  }
]
```

## Frontend Integration

### Event Tracking Composable

The `useEventTracking` composable provides utilities for tracking user events:

```typescript
const { getUserId, trackEvent } = useEventTracking();

// Track a product view
trackEvent(productId, 'view');

// Track add to cart
trackEvent(productId, 'add_to_cart');
```

### User Identification

For demonstration purposes, the system generates a random user ID stored in localStorage. In a production environment, this should be replaced with actual user authentication.

### Recommendations Component

The `RecommendedProducts` component displays personalized recommendations:

```vue
<ProductRecommendedProducts @add-to-cart="handleAddToCart" />
```

This component:
- Automatically fetches recommendations on mount
- Displays up to 10 recommended products
- Allows users to navigate to product pages or add items to cart

## Usage

### Setting Up the Database

1. Run the migration script:
```bash
mysql -u [username] -p [database] < migrations/001_create_user_event_table.sql
```

### Tracking Events in Your Components

In any Vue component:

```vue
<script setup>
const { trackEvent } = useEventTracking();

function handleProductView(productId) {
  trackEvent(productId, 'view');
}

function handleAddToCart(productId) {
  trackEvent(productId, 'add_to_cart');
}
</script>
```

### Displaying Recommendations

Add the recommendations component to any page:

```vue
<template>
  <div>
    <ProductRecommendedProducts @add-to-cart="handleAddToCart" />
  </div>
</template>
```

## Future Enhancements

1. **Machine Learning Integration**: The nuxt.config.ts includes a proxy route to `/ml/**` for future ML-based recommendations
2. **Collaborative Filtering**: Recommend products based on similar users' behavior
3. **Real-time Updates**: Use WebSockets to update recommendations in real-time
4. **A/B Testing**: Test different recommendation algorithms
5. **Analytics Dashboard**: Visualize user behavior and recommendation performance
6. **Purchase Event Tracking**: Complete the purchase flow to track completed transactions

## Security Considerations

- User IDs should be validated and authenticated in production
- API endpoints should include rate limiting
- Event data should be sanitized before database insertion
- Consider GDPR compliance for storing user behavior data

## Performance Optimization

- Event tracking is asynchronous and doesn't block user interactions
- Recommendations are cached client-side during the session
- Database indexes ensure fast query performance
- Consider implementing a caching layer (Redis) for frequently accessed recommendations
