import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";

import { authenticate } from "../../plugins/auth";
import { getAnalytics } from "./analytics.controller";
import {
    analyticsParamsSchema,
    analyticsQuerySchema,
    analyticsResponseSchema,
    errorResponseSchema,
} from "./analytics.schema";

export const analyticsRoutes: FastifyPluginAsync = async (app) => {
    app.addHook("onRequest", authenticate);

    const router = app.withTypeProvider<ZodTypeProvider>();

    router.get(
        "/v1/urls/:shortCode/analytics",
        {
            schema: {
                tags: ["Analytics"],
                operationId: "getAnalytics",
                summary: "Get URL analytics",
                description: "Get analytics data for a short URL.",

                security: [{ bearerAuth: [] }],

                params: analyticsParamsSchema,

                querystring: analyticsQuerySchema,

                response: {
                    200: analyticsResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        getAnalytics
    );
};
