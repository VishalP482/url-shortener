import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import type { z } from "zod";
import { createShortUrlSchema } from "./url.schema";
import { urlService } from "./url.service";

type CreateShortUrlRequest = FastifyRequest<{
    Body: z.infer<typeof createShortUrlSchema>;
}>;

export async function createShortUrl(
    request: CreateShortUrlRequest,
    reply: FastifyReply,
) {
    try {
        const result = await urlService.createShortUrl(request.body);

        return reply.status(201).send({
            shortCode: result.shortCode,
            shortUrl: `${request.protocol}://${request.host}/${result.shortCode}`,
            expiresAt: result.expiresAt.toISOString(),
        });
    } catch (error) {
        return reply.status(400).send({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}