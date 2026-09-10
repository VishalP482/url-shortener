import { FastifyReply, FastifyRequest } from "fastify";
import { redirectService } from "./redirect.service";
import { RedirectParams } from "./redirect.schema";

export async function redirectToOriginalUrl(
    request: FastifyRequest<{
        Params: RedirectParams;
        Querystring: Record<string, string | undefined>;
    }>,
    reply: FastifyReply
) {
    try {
        const originalUrl = await redirectService.getOriginalUrl(
            request.params.shortCode,
            request.query
        );

        // Track analytics asynchronously — don't block the redirect
        redirectService.trackRedirect(request.params.shortCode, {
            headers: request.headers as Record<string, string | undefined>,
            ip: request.ip,
        });

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
