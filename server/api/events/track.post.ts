import { db } from "~~/server/database/connection";
import { userEvent } from "~~/server/database/schemas/user-event.schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { user_id, product_id, event_type } = body;

  if (!user_id || !product_id || !event_type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: user_id, product_id, event_type"
    });
  }

  // Validate event_type
  const validEventTypes = ['view', 'add_to_cart', 'purchase'];
  if (!validEventTypes.includes(event_type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`
    });
  }

  try {
    const result = await db.insert(userEvent).values({
      user_id,
      product_id,
      event_type
    });

    return {
      success: true,
      message: "Event tracked successfully",
      event_id: result[0].insertId
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to track event"
    });
  }
})
