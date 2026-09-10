import { z } from "zod";

export const analyticsParamsSchema = z.object({
    shortCode: z
        .string()
        .min(1)
        .describe("The short code of the shortened URL"),
});

export const analyticsQuerySchema = z.object({
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
    groupBy: z.enum(["day", "country", "device", "os"]).optional(),
});

export const analyticsResponseSchema = z.object({
    totalClicks: z.number(),
    byCountry: z.record(z.string(), z.number()),
    byDevice: z.record(z.string(), z.number()),
    byOs: z.record(z.string(), z.number()),
    timeline: z.array(
        z.object({
            date: z.string(),
            clicks: z.number(),
        })
    ),
});

export const errorResponseSchema = z.object({
    message: z.string(),
});
