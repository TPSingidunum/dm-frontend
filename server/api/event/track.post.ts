import { db } from "~~/server/database/connection";
import { event } from "~~/server/database/schemas/event.schema";

export default defineEventHandler(async (event_handler) => {
  const body = await readBody(event_handler);

  if (!body) {
    return "ERROR"
  }

  const newEvent = await db.insert(event).values({
    event_type: body.event_type,
    product_id: body.product_id,
    user_session: body.user_session
  })

  if (!newEvent[0].insertId) {
    return false
  }

  return true;
})
