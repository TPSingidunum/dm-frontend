import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { user } from "./user.schema";
import { product } from "./product.schema";

export const userEvent = mysqlTable("user_event", {
    event_id: int("event_id").primaryKey().autoincrement(),
    user_id: int("user_id").notNull().references(() => user.user_id),
    product_id: int("product_id").notNull().references(() => product.product_id),
    event_type: varchar("event_type", { length: 50 }).notNull(), // 'view', 'add_to_cart', 'purchase'
    created_at: timestamp("created_at").defaultNow(),
})

export const userEventRelations = relations(userEvent, ({ one }) => ({
    user: one(user, {
        fields: [userEvent.user_id],
        references: [user.user_id],
    }),
    product: one(product, {
        fields: [userEvent.product_id],
        references: [product.product_id],
    }),
}));

export type UserEvent = typeof userEvent.$inferSelect
export type NewUserEvent = typeof userEvent.$inferInsert
