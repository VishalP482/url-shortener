import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";

import { authenticate } from "../../plugins/auth";
import { getMe } from "./user.controller";
import {
    meResponseSchema,
    errorResponseSchema,
} from "./user.schema";

export const userRoutes: FastifyPluginAsync = async (app) => {
    app.addHook("onRequest", authenticate);

    const router = app.withTypeProvider<ZodTypeProvider>();

    router.get(
        "/v1/users/me",
        {
            schema: {
                tags: ["User"],
                operationId: "getMe",
                summary: "Get current user",
                description: "Get the authenticated user's profile.",

                security: [{ bearerAuth: [] }],

                response: {
                    200: meResponseSchema,
                    401: errorResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        getMe
    );
};
