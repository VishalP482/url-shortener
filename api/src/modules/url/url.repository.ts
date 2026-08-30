export interface UrlRecord {
    id: string;
    shortCode: string;
    originalUrl: string;
    expiresAt: Date;
    createdAt: Date;
}

const urls = new Map<string, UrlRecord>();

export const urlRepository = {
    async create(data: UrlRecord) {
        urls.set(data.shortCode, data);

        return data;
    },

    async findByShortCode(shortCode: string) {
        return urls.get(shortCode) ?? null;
    },

    async deleteByShortCode(shortCode: string) {
        return urls.delete(shortCode);
    },
};