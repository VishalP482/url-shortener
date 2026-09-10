import {
    pgTable,
    integer,
    varchar,
    timestamp,
    boolean,
    index,
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

// UTM configuration for short URLs — one config per URL
export const urlUtms = pgTable("url_utms", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    urlId: integer("url_id")
        .notNull()
        .references(() => urls.id, { onDelete: "cascade" })
        .unique(),

    utmSource: varchar("utm_source", { length: 255 }),
    utmMedium: varchar("utm_medium", { length: 255 }),
    utmCampaign: varchar("utm_campaign", { length: 255 }),
    utmTerm: varchar("utm_term", { length: 255 }),
    utmContent: varchar("utm_content", { length: 255 }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    urlIdIdx: index("url_utms_url_id_idx").on(table.urlId),
}));

// Analytics events for short URL redirects
export const urlAnalytics = pgTable("url_analytics", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),

    urlId: integer("url_id")
        .notNull()
        .references(() => urls.id, { onDelete: "cascade" }),

    clickedAt: timestamp("clicked_at", { withTimezone: true }).defaultNow().notNull(),

    // Privacy-conscious: store hashed/truncated IP instead of raw IP
    ipHash: varchar("ip_hash", { length: 64 }),

    // Geolocation — nullable when unknown
    country: varchar("country", { length: 100 }),
    region: varchar("region", { length: 100 }),

    // Device and OS — parsed from User-Agent
    deviceType: varchar("device_type", { length: 50 }),
    os: varchar("os", { length: 100 }),
}, (table) => ({
    urlIdIdx: index("url_analytics_url_id_idx").on(table.urlId),
    clickedAtIdx: index("url_analytics_clicked_at_idx").on(table.clickedAt),
}));
