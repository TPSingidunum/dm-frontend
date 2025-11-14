import { relations } from "drizzle-orm";
import { int, json, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { product } from "./product.schema";

export const seo = mysqlTable("seo", {
    seo_id: int("seo_id").primaryKey().autoincrement(),
    seo_title: varchar("seo_title", { length: 60}).notNull(),
    seo_description: varchar("seo_description", { length: 155}).notNull(),
    key_words: json("key_words").notNull(),
})

export const seoRelations = relations(seo, ({ one }) => ({
	product: one(product, { fields: [seo.seo_id], references: [product.seo_id] }),
}));
