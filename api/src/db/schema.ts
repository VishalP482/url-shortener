import {
    pgTable,
    integer,
    varchar,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

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

    // Optional relationship to user — null for anonymous (non-logged-in) users
    userId: integer("user_id").references(() => users.id),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});

export const users = pgTable("users", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    // Session tracking — allows revoking all tokens for a specific session/device
    sessionId: varchar("session_id", { length: 64 }).notNull(),

    userId: integer("user_id").references(() => users.id).notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    userAgent: varchar("user_agent", { length: 512 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
