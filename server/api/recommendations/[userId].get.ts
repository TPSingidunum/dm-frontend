import { eq, desc, sql, inArray, notInArray } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { userEvent } from "~~/server/database/schemas/user-event.schema";
import { product } from "~~/server/database/schemas/product.schema";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing userId parameter"
    });
  }

  try {
    const userIdInt = parseInt(userId);

    // Get user's event history
    const userEvents = await db.query.userEvent.findMany({
      where: eq(userEvent.user_id, userIdInt),
      orderBy: [desc(userEvent.created_at)],
      limit: 50 // Look at recent 50 events
    });

    if (userEvents.length === 0) {
      // If user has no history, return popular products
      const popularProducts = await db.select().from(product).limit(10);
      return popularProducts;
    }

    // Get product IDs the user has interacted with
    const userProductIds = [...new Set(userEvents.map(e => e.product_id))];
    
    // Weight events: purchase > add_to_cart > view
    const eventWeights = { purchase: 3, add_to_cart: 2, view: 1 };
    const productScores = new Map<number, number>();

    userEvents.forEach(event => {
      const weight = eventWeights[event.event_type as keyof typeof eventWeights] || 1;
      const currentScore = productScores.get(event.product_id) || 0;
      productScores.set(event.product_id, currentScore + weight);
    });

    // Get top interacted products by score
    const topProductIds = Array.from(productScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId]) => productId);

    // Get products in the same categories as user's top products
    const topProducts = await db.select().from(product)
      .where(inArray(product.product_id, topProductIds));

    const categoryIds = [...new Set(topProducts.map(p => p.category_id))];

    // Find similar products (same category, not already viewed)
    let recommendations = await db.select().from(product)
      .where(
        sql`${product.category_id} IN (${sql.raw(categoryIds.join(','))}) 
        AND ${product.product_id} NOT IN (${sql.raw(userProductIds.join(','))})`
      )
      .limit(10);

    // If not enough recommendations, fill with popular products
    if (recommendations.length < 10) {
      const additionalProducts = await db.select().from(product)
        .where(notInArray(product.product_id, userProductIds))
        .limit(10 - recommendations.length);
      
      recommendations = [...recommendations, ...additionalProducts];
    }

    return recommendations;
  } catch (error) {
    console.error("Recommendation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate recommendations"
    });
  }
})
