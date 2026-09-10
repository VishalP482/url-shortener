import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { utmService } from "./utm.service";
import {
    utmConfigSchema,
    utmResponseSchema,
    errorResponseSchema,
} from "./utm.schema";

type SetUtmRequest = FastifyRequest<{
    Body: z.infer<typeof utmConfigSchema>;
    Params: { shortCode: string };
}>;

type GetUtmRequest = FastifyRequest<{
    Params: { shortCode: string };
}>;

export async function getUtm(
    request: GetUtmRequest,
    reply: FastifyReply
) {
    try {
        const utm = await utmService.getUtm(request.params.shortCode);

        if (!utm) {
            return reply.status(404).send({
                message: "No UTM configuration found for this URL",
            });
        }

        return reply.status(200).send(utm);
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

export async function setUtm(
    request: SetUtmRequest,
    reply: FastifyReply
) {
    try {
        const utm = await utmService.setUtm({
            shortCode: request.params.shortCode,
            utmSource: request.body.utm_source,
            utmMedium: request.body.utm_medium,
            utmCampaign: request.body.utm_campaign,
            utmTerm: request.body.utm_term,
            utmContent: request.body.utm_content,
        });

        return reply.status(200).send(utm);
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

export async function deleteUtm(
    request: FastifyRequest<{
        Params: { shortCode: string };
    }>,
    reply: FastifyReply
) {
    try {
        const deleted = await utmService.deleteUtm(request.params.shortCode);

        if (!deleted) {
            return reply.status(404).send({
                message: "No UTM configuration found for this URL",
            });
        }

        return reply.status(204).send();
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
