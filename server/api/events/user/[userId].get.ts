import { eq, desc } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { userEvent } from "~~/server/database/schemas/user-event.schema";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing userId parameter"
    });
  }

  try {
    const events = await db.query.userEvent.findMany({
      where: eq(userEvent.user_id, parseInt(userId)),
      orderBy: [desc(userEvent.created_at)],
      with: {
        product: true
      }
    });

    return events;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user events"
    });
  }
})
