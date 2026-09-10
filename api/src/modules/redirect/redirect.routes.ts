import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { redirectToOriginalUrl } from "./redirect.controller";
import {
    redirectParamsSchema,
    redirectQuerySchema,
    errorResponseSchema,
} from "./redirect.schema";
import { ZodTypeProvider } from "@fastify/type-provider-zod";

export const redirectRoutes: FastifyPluginAsync = async (app) => {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.get(
        "/:shortCode",
        {
            schema: {
                tags: ["Redirect"],
                summary: "Redirect to original URL",
                description: "Redirects the client to the original URL associated with the short code.",

                params: redirectParamsSchema,

                querystring: redirectQuerySchema,

                response: {
                    404: errorResponseSchema,
                    410: errorResponseSchema,
                },
            },
        },
        redirectToOriginalUrl
    );
}
