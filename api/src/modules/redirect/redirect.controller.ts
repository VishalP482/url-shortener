import { FastifyReply, FastifyRequest } from "fastify";
import { redirectService } from "./redirect.service";
import { RedirectParams } from "./redirect.schema";

export async function redirectToOriginalUrl(
    request: FastifyRequest<{
        Params: RedirectParams;
    }>,
    reply: FastifyReply
) {
    try {
        const originalUrl = await redirectService.getOriginalUrl(
            request.params.shortCode
        );

        return reply.redirect(originalUrl, 302);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        const statusCode =
            message === "Short URL has expired" ? 410 : 404;

        return reply.status(statusCode).send({
            message,
        });
    }
}
