import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";

import { createShortUrl } from "./url.controller";
import {
    createShortUrlSchema,
    createShortUrlResponseSchema,
    errorResponseSchema,
} from "./url.schema";

export const urlRoutes: FastifyPluginAsync = async (app) => {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.post(
        "/v1/urls",
        {
            schema: {
                tags: ["URL"],
                operationId: "createShortUrl",
                summary: "Create a short URL",
                description: "Create a shortened URL from a long URL.",

                body: createShortUrlSchema,

                response: {
                    201: createShortUrlResponseSchema,

                    400: errorResponseSchema,

                    500: errorResponseSchema,
                },
            },
        },
        createShortUrl,
    );
};