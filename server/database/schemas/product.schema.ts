import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const product = mysqlTable("product", {
    product_id: int("product_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255}).notNull(),
    description: text("description").notNull(),
    slug: varchar("slug", { length: 255}).notNull(),
    category_id: int("category_id").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
})