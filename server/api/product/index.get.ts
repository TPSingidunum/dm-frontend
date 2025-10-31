import { db } from "~~/server/database/connection"
import { product } from "~~/server/database/schemas/product.schema"

export default defineEventHandler(async (event) => {
  const products = db.select().from(product);
  return products;
})
