import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { seo } from "./seo.schema";
import { relations } from "drizzle-orm";

export const product = mysqlTable("product", {
    product_id: int("product_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255}).notNull(),
    description: text("description").notNull(),
    img_url: text("img_url").notNull(),
    slug: varchar("slug", { length: 255}).notNull(),
    category_id: int("category_id").notNull(),
    seo_id: int("seo_id").notNull().references(() => seo.seo_id),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const productRelations = relations(product, ({ one }) => ({
	seo: one(seo),
}));

export type Product = typeof product.$inferSelect
export type NewProduct = typeof product.$inferInsert