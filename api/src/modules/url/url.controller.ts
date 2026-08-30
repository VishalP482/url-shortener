import type { FastifyReply, FastifyRequest } from "fastify";
import { urlService } from "./url.service";

interface CreateUrlBody {
    url: string;
    expiresIn: number;
}

export async function createShortUrl(
    request: FastifyRequest<{
        Body: CreateUrlBody;
    }>,
    reply: FastifyReply
) {
    try {
        const result = await urlService.createShortUrl(request.body);

        return reply.status(201).send({
            shortCode: result.shortCode,
            shortUrl: `${request.protocol}://${request.host}/${result.shortCode}`,
            expiresAt: result.expiresAt,
        });
    } catch (error) {
        return reply.status(400).send({
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}