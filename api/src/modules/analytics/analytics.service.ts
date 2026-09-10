import { urlRepository } from "../url/url.repository";
import { analyticsRepository } from "./analytics.repository";

interface GetAnalyticsInput {
    shortCode: string;
    from?: Date | undefined;
    to?: Date | undefined;
}

export const analyticsService = {
    async getAnalytics(input: GetAnalyticsInput) {
        const urlRecord = await urlRepository.findByShortCode(input.shortCode);

        if (!urlRecord) {
            throw new Error("Short URL not found");
        }

        const summary = await analyticsRepository.getSummary(
            urlRecord.id,
            input.from,
            input.to
        );

        return summary;
    },

    async trackClick(data: {
        shortCode: string;
        ipHash?: string | null;
        country?: string | null;
        region?: string | null;
        deviceType?: string | null;
        os?: string | null;
    }) {
        const urlId = await analyticsRepository.findUrlIdByShortCode(data.shortCode);

        if (!urlId) {
            // URL not found — silently skip tracking
            return;
        }

        try {
            await analyticsRepository.create({
                urlId,
                ipHash: data.ipHash ?? null,
                country: data.country ?? null,
                region: data.region ?? null,
                deviceType: data.deviceType ?? null,
                os: data.os ?? null,
            });
        } catch {
            // Silently fail — analytics should not break redirects
        }
    },
};
