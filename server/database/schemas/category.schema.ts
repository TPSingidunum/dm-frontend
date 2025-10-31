import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const category = mysqlTable("category", {
    category_id: int("category_id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255}).notNull(),
    slug: varchar("slug", { length: 255}).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
})