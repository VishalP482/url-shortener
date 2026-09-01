import {
    pgTable,
    serial,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
    id: serial("id").primaryKey(),

    shortCode: varchar("short_code", {
        length: 10,
    })
        .notNull()
        .unique(),

    originalUrl: varchar("original_url", {
        length: 2048,
    }).notNull(),

    expiresAt: timestamp("expires_at", {
        withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});