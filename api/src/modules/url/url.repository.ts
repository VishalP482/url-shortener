import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { urls } from "../../db/schema.js";

export interface UrlRecord {
    id: number;
    shortCode: string;
    originalUrl: string;
    expiresAt: Date;
    userId: number | null;
    createdAt: Date;
}

export const urlRepository = {
    async create(
        data: Omit<UrlRecord, "id" | "createdAt">
    ): Promise<UrlRecord> {
        const [record] = await db
            .insert(urls)
            .values({
                shortCode: data.shortCode,
                originalUrl: data.originalUrl,
                expiresAt: data.expiresAt,
                userId: data.userId,
            })
            .returning();

        if (!record) {
            throw new Error("Failed to create URL");
        }

        return record;
    },

    async findByShortCode(
        shortCode: string
    ): Promise<UrlRecord | null> {
        const [record] = await db
            .select()
            .from(urls)
            .where(eq(urls.shortCode, shortCode))
            .limit(1);

        return record ?? null;
    },

    async deleteByShortCode(
        shortCode: string
    ): Promise<boolean> {
        const deleted = await db
            .delete(urls)
            .where(eq(urls.shortCode, shortCode))
            .returning({
                id: urls.id,
            });

        return deleted.length > 0;
    },
};