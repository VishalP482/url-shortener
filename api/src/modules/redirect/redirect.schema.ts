import { z } from "zod";

export const redirectParamsSchema = z.object({
    shortCode: z.string().min(1).meta({
        description: "The short code of the shortened URL",
        examples: ["abc123"],
    }),
});

export const redirectQuerySchema = z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
});

export const errorResponseSchema = z.object({
    message: z.string().meta({
        description: "Error message",
        examples: ["Invalid URL"],
    }),
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;
export type RedirectQuery = z.infer<typeof redirectQuerySchema>;
