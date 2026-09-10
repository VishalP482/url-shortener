import { urlRepository } from "../url/url.repository";
import { utmRepository } from "../utm/utm.repository";
import { analyticsService } from "../analytics/analytics.service";
import { mergeUtmParams, appendUtmToUrl, extractUtmFromQuery } from "../../utils/utm";
import { hashIp, parseUserAgent, extractCountry } from "../../utils/analytics";

export const redirectService = {
    async getOriginalUrl(shortCode: string, query?: Record<string, string | undefined>) {
        const record = await urlRepository.findByShortCode(shortCode);

        if (!record) {
            throw new Error("Short URL not found");
        }

        if (record.expiresAt <= new Date()) {
            throw new Error("Short URL has expired");
        }

        let finalUrl = record.originalUrl;

        // Handle UTM parameters
        const storedUtm = await utmRepository.findByUrlId(record.id);
        const incomingUtm = query ? extractUtmFromQuery(query) : {};
        const mergedUtm = mergeUtmParams(storedUtm, incomingUtm);
        finalUrl = appendUtmToUrl(finalUrl, mergedUtm);

        return finalUrl;
    },

    async trackRedirect(shortCode: string, request: { headers: Record<string, string | undefined>; ip?: string | undefined }) {
        // Fire-and-forget: don't block the redirect
        const { deviceType, os } = parseUserAgent(request.headers["user-agent"]);
        const country = extractCountry({ headers: request.headers });
        const ipHash = hashIp(request.ip);

        analyticsService.trackClick({
            shortCode,
            ipHash,
            country,
            deviceType,
            os,
        });
    },
};
