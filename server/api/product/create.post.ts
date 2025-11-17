import { eq } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { NewProduct, product } from "~~/server/database/schemas/product.schema";

export default defineEventHandler(async (event) => {
  const data: NewProduct = await readBody(event);

  // Check if the slug does exist an with this name
  const exists = await db.select().from(product).where(eq(product.slug, data.slug))

  if (exists.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        field: "slug",
        message: "Slug is taken"
      }
    })
  }

  // TODO: Fix updated and created At in the schema
  data.created_at = new Date();
  data.updated_at = new Date();
  const result = await db.insert(product).values(data);
  if (!result[0].insertId) {
    return false
  }

  return true
})
