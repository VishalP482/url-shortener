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

/**
 * Creates a short URL.
 *
 * Both authenticated and anonymous users can create URLs:
 * - If the user is logged in, `request.user` is populated by the auth plugin
 *   and the URL is associated with that user.
 * - If the user is not logged in, `userId` is `null` and the URL is anonymous.
 */
export async function createShortUrl(
    request: CreateShortUrlRequest,
    reply: FastifyReply,
) {
    try {
        // If user is authenticated, associate the URL with their account.
        // Anonymous users (no auth header) will have userId = null.
        const userId = request.user?.id ?? null;

        const result = await urlService.createShortUrl({
            ...request.body,
            userId,
        });

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