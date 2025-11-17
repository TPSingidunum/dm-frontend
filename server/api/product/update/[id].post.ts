import { and, eq, ne } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { NewProduct, product } from "~~/server/database/schemas/product.schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const data: NewProduct = await readBody(event);

  // Check if ther does exist an slug with this name
  const exists = await db.select().from(product).where(
    and(
      eq(product.slug, data.slug),
      ne(product.product_id, Number(id))
    )
  )

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

  const result = await db.update(product)
    .set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      seo_id: data.seo_id,
      img_url: data.img_url,
      updated_at: new Date()
    })
    .where(eq(product.product_id, Number(id)))
    
    return result[0].affectedRows == 1
})
