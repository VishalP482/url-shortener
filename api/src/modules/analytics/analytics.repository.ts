import { eq, and, gte, lte, sql } from "drizzle-orm";

import { db } from "../../db/index.js";
import { urlAnalytics, urls } from "../../db/schema.js";

export interface AnalyticsRecord {
    id: number;
    urlId: number;
    clickedAt: Date;
    ipHash: string | null;
    country: string | null;
    region: string | null;
    deviceType: string | null;
    os: string | null;
}

export interface AnalyticsSummary {
    totalClicks: number;
    byCountry: Record<string, number>;
    byDevice: Record<string, number>;
    byOs: Record<string, number>;
    timeline: { date: string; clicks: number }[];
}

export const analyticsRepository = {
    async findByUrlId(urlId: number, from?: Date, to?: Date): Promise<AnalyticsRecord[]> {
        const conditions = [eq(urlAnalytics.urlId, urlId)];

        if (from) {
            conditions.push(gte(urlAnalytics.clickedAt, from));
        }

        if (to) {
            conditions.push(lte(urlAnalytics.clickedAt, to));
        }

        const records = await db
            .select()
            .from(urlAnalytics)
            .where(and(...conditions))
            .orderBy(urlAnalytics.clickedAt);

        return records;
    },

    async getSummary(urlId: number, from?: Date, to?: Date): Promise<AnalyticsSummary> {
        const records = await this.findByUrlId(urlId, from, to);

        const byCountry: Record<string, number> = {};
        const byDevice: Record<string, number> = {};
        const byOs: Record<string, number> = {};
        const timeline: Record<string, number> = {};

        for (const record of records) {
            // Country
            const country = record.country ?? "Unknown";
            byCountry[country] = (byCountry[country] ?? 0) + 1;

            // Device
            const device = record.deviceType ?? "Unknown";
            byDevice[device] = (byDevice[device] ?? 0) + 1;

            // OS
            const os = record.os ?? "Unknown";
            byOs[os] = (byOs[os] ?? 0) + 1;

            // Timeline (by day)
            const date = record.clickedAt.toISOString().split("T")[0]!;
            timeline[date] = (timeline[date] ?? 0) + 1;
        }

        return {
            totalClicks: records.length,
            byCountry,
            byDevice,
            byOs,
            timeline: Object.entries(timeline)
                .map(([date, clicks]) => ({ date, clicks }))
                .sort((a, b) => a.date.localeCompare(b.date)),
        };
    },

    async create(data: {
        urlId: number;
        ipHash?: string | null;
        country?: string | null;
        region?: string | null;
        deviceType?: string | null;
        os?: string | null;
    }): Promise<AnalyticsRecord> {
        const [record] = await db
            .insert(urlAnalytics)
            .values({
                urlId: data.urlId,
                ipHash: data.ipHash ?? null,
                country: data.country ?? null,
                region: data.region ?? null,
                deviceType: data.deviceType ?? null,
                os: data.os ?? null,
            })
            .returning();

        if (!record) {
            throw new Error("Failed to create analytics record");
        }

        return record;
    },

    async findUrlIdByShortCode(shortCode: string): Promise<number | null> {
        const [record] = await db
            .select({ id: urls.id })
            .from(urls)
            .where(eq(urls.shortCode, shortCode))
            .limit(1);

        return record?.id ?? null;
    },
};
