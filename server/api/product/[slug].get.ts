import { eq } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { product } from "~~/server/database/schemas/product.schema";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug){
    return "Error"
  }

  const prod = await db.select().from(product).where(eq(product.slug, slug));

  return prod[0];
})
