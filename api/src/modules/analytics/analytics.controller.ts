import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { analyticsService } from "./analytics.service";
import {
    analyticsQuerySchema,
    analyticsResponseSchema,
    errorResponseSchema,
} from "./analytics.schema";

type GetAnalyticsRequest = FastifyRequest<{
    Querystring: z.infer<typeof analyticsQuerySchema>;
    Params: { shortCode: string };
}>;

export async function getAnalytics(
    request: GetAnalyticsRequest,
    reply: FastifyReply
) {
    try {
        const query = request.query as z.infer<typeof analyticsQuerySchema>;
        const { from, to } = query;

        const summary = await analyticsService.getAnalytics({
            shortCode: request.params.shortCode,
            from,
            to,
        });

        return reply.status(200).send(summary);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        const statusCode =
            message === "Short URL not found" ? 404 : 400;

        return reply.status(statusCode).send({ message });
    }
}
