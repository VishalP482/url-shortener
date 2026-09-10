import { urlRepository } from "../url/url.repository";
import { utmRepository } from "./utm.repository";

interface SetUtmInput {
    shortCode: string;
    utmSource?: string | null | undefined;
    utmMedium?: string | null | undefined;
    utmCampaign?: string | null | undefined;
    utmTerm?: string | null | undefined;
    utmContent?: string | null | undefined;
}

export const utmService = {
    async getUtm(shortCode: string) {
        const urlRecord = await urlRepository.findByShortCode(shortCode);

        if (!urlRecord) {
            throw new Error("Short URL not found");
        }

        const utmRecord = await utmRepository.findByUrlId(urlRecord.id);

        if (!utmRecord) {
            return null;
        }

        return {
            utm_source: utmRecord.utmSource,
            utm_medium: utmRecord.utmMedium,
            utm_campaign: utmRecord.utmCampaign,
            utm_term: utmRecord.utmTerm,
            utm_content: utmRecord.utmContent,
        };
    },

    async setUtm(input: SetUtmInput) {
        const urlRecord = await urlRepository.findByShortCode(input.shortCode);

        if (!urlRecord) {
            throw new Error("Short URL not found");
        }

        const utmRecord = await utmRepository.upsert({
            urlId: urlRecord.id,
            utmSource: input.utmSource,
            utmMedium: input.utmMedium,
            utmCampaign: input.utmCampaign,
            utmTerm: input.utmTerm,
            utmContent: input.utmContent,
        });

        return {
            utm_source: utmRecord.utmSource,
            utm_medium: utmRecord.utmMedium,
            utm_campaign: utmRecord.utmCampaign,
            utm_term: utmRecord.utmTerm,
            utm_content: utmRecord.utmContent,
        };
    },

    async deleteUtm(shortCode: string) {
        const urlRecord = await urlRepository.findByShortCode(shortCode);

        if (!urlRecord) {
            throw new Error("Short URL not found");
        }

        const deleted = await utmRepository.deleteByUrlId(urlRecord.id);

        return deleted;
    },
};
