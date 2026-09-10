import { eq, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { urlUtms, urls } from "../../db/schema.js";

export interface UrlUtmRecord {
    id: number;
    urlId: number;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const utmRepository = {
    async findByUrlId(urlId: number): Promise<UrlUtmRecord | null> {
        const [record] = await db
            .select()
            .from(urlUtms)
            .where(eq(urlUtms.urlId, urlId))
            .limit(1);

        return record ?? null;
    },

    async findByShortCode(shortCode: string): Promise<UrlUtmRecord | null> {
        const [record] = await db
            .select({
                id: urlUtms.id,
                urlId: urlUtms.urlId,
                utmSource: urlUtms.utmSource,
                utmMedium: urlUtms.utmMedium,
                utmCampaign: urlUtms.utmCampaign,
                utmTerm: urlUtms.utmTerm,
                utmContent: urlUtms.utmContent,
                createdAt: urlUtms.createdAt,
                updatedAt: urlUtms.updatedAt,
            })
            .from(urlUtms)
            .innerJoin(urls, eq(urls.id, urlUtms.urlId))
            .where(eq(urls.shortCode, shortCode))
            .limit(1);

        return record ?? null;
    },

    async upsert(data: {
        urlId: number;
        utmSource?: string | null | undefined;
        utmMedium?: string | null | undefined;
        utmCampaign?: string | null | undefined;
        utmTerm?: string | null | undefined;
        utmContent?: string | null | undefined;
    }): Promise<UrlUtmRecord> {
        const existing = await this.findByUrlId(data.urlId);

        if (existing) {
            const [updated] = await db
                .update(urlUtms)
                .set({
                    utmSource: data.utmSource ?? existing.utmSource,
                    utmMedium: data.utmMedium ?? existing.utmMedium,
                    utmCampaign: data.utmCampaign ?? existing.utmCampaign,
                    utmTerm: data.utmTerm ?? existing.utmTerm,
                    utmContent: data.utmContent ?? existing.utmContent,
                    updatedAt: new Date(),
                })
                .where(eq(urlUtms.urlId, data.urlId))
                .returning();

            if (!updated) {
                throw new Error("Failed to update UTM configuration");
            }

            return updated;
        }

        const [created] = await db
            .insert(urlUtms)
            .values({
                urlId: data.urlId,
                utmSource: data.utmSource ?? null,
                utmMedium: data.utmMedium ?? null,
                utmCampaign: data.utmCampaign ?? null,
                utmTerm: data.utmTerm ?? null,
                utmContent: data.utmContent ?? null,
            })
            .returning();

        if (!created) {
            throw new Error("Failed to create UTM configuration");
        }

        return created;
    },

    async deleteByUrlId(urlId: number): Promise<boolean> {
        const result = await db
            .delete(urlUtms)
            .where(eq(urlUtms.urlId, urlId))
            .returning({ id: urlUtms.id });

        return result.length > 0;
    },
};
