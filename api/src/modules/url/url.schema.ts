import { z } from "zod";

export const createShortUrlSchema = z.object({
    url: z
        .url()
        .meta({
            description: "The original URL to shorten",
            examples: ["https://google.com"],
        }),

    expiresIn: z
        .number()
        .int()
        .positive()
        .meta({
            description: "Expiration time in seconds",
            examples: [3600],
        }),

    // Optional userId — set automatically when user is authenticated
    userId: z
        .number()
        .int()
        .positive()
        .optional()
        .meta({
            description: "User ID (set automatically for authenticated users)",
            examples: [1],
        }),
});

export const createShortUrlResponseSchema = z.object({
    shortCode: z
        .string()
        .meta({
            description: "Generated short code",
            examples: ["hdB9CcB"],
        }),

    shortUrl: z
        .url()
        .meta({
            description: "Complete shortened URL",
            examples: ["http://localhost:5000/hdB9CcB"],
        }),

    expiresAt: z
        .iso.datetime()
        .meta({
            description: "Expiration timestamp in ISO 8601 format",
            examples: ["2026-08-31T18:34:28.918Z"],
        }),
});

export const errorResponseSchema = z.object({
    message: z.string().meta({
        description: "Error message",
        examples: ["Invalid URL"],
    }),
});