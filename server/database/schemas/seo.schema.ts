import { relations } from "drizzle-orm";
import { int, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { product } from "./product.schema";

export const seo = mysqlTable("seo", {
    seo_id: int("seo_id").primaryKey().autoincrement(),
    title: varchar("title", { length: 60}).notNull(),
    description: varchar("description", { length: 155}).notNull(),
    key_words: json("key_words").notNull(),
})

export const seoRelations = relations(seo, ({ one }) => ({
	product: one(product, { fields: [seo.seo_id], references: [product.seo_id] }),
}));

export type Seo = typeof seo.$inferSelect
export type NewSeo = typeof seo.$inferInsert