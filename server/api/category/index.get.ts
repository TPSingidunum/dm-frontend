import { db } from "~~/server/database/connection"
import { user } from "~~/server/database/schemas/user.schema"

export default defineEventHandler(async (event) => {
  const users = db.select().from(user);

  return users;
})
