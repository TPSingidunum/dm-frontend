import { eq } from "drizzle-orm";
import { db } from "~~/server/database/connection";
import { product } from "~~/server/database/schemas/product.schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    return "Error"
  }

  const prod = db.query.product.findFirst({
    where: eq(product.product_id, Number(id)),
    with: {
      seo: true
    }
  })

  return prod;
})
