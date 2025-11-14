import { eq } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { product } from "~~/server/database/schemas/product.schema";
import { seo } from "~~/server/database/schemas/seo.schema";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug){
    return "Error"
  }

  let prod = await db.select().from(product).where(eq(product.slug, slug));
  const s = await db.select().from(seo).where(eq(seo.seo_id, prod[0].seo_id))

  prod[0]["seo"] = s

  return prod[0];
})
