import { randomBytes } from "node:crypto";
import { urlRepository } from "./url.repository";
import type { UrlRecord } from "./url.repository";

interface CreateUrlInput {
    url: string;
    expiresIn: number;
    userId?: number | null;
}

function generateShortCode(length = 7): string {
    return randomBytes(8)
        .toString("base64url")
        .slice(0, length);
}

export const urlService = {
    async createShortUrl(input: CreateUrlInput) {
        const { url, expiresIn, userId } = input;

        // Validate URL
        try {
            new URL(url);
        } catch {
            throw new Error("Invalid URL");
        }

        if (expiresIn <= 0) {
            throw new Error("expiresIn must be greater than 0");
        }

        let shortCode = generateShortCode();

        // Make sure the generated code is unique
        while (await urlRepository.findByShortCode(shortCode)) {
            shortCode = generateShortCode();
        }

        const now = new Date();

        const record: Omit<UrlRecord, "id" | "createdAt"> = {
            shortCode,
            originalUrl: url,
            expiresAt: new Date(now.getTime() + expiresIn * 1000),
            userId: userId ?? null,
        };

        await urlRepository.create(record);

        return record;
    },
};