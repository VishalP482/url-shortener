import { urlRepository } from "../url/url.repository";

export const redirectService = {
    async getOriginalUrl(shortCode: string) {
        const record = await urlRepository.findByShortCode(shortCode);

        if (!record) {
            throw new Error("Short URL not found");
        }

        if (record.expiresAt <= new Date()) {
            throw new Error("Short URL has expired");
        }

        return record.originalUrl;
    },
};  