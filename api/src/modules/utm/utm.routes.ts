import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";

import { authenticate } from "../../plugins/auth";
import { getUtm, setUtm, deleteUtm } from "./utm.controller";
import {
    utmConfigSchema,
    utmResponseSchema,
    errorResponseSchema,
} from "./utm.schema";

export const utmRoutes: FastifyPluginAsync = async (app) => {
    app.addHook("onRequest", authenticate);

    const router = app.withTypeProvider<ZodTypeProvider>();

    router.get(
        "/v1/urls/:shortCode/utm",
        {
            schema: {
                tags: ["UTM"],
                operationId: "getUtm",
                summary: "Get UTM configuration",
                description: "Get the UTM configuration for a short URL.",

                security: [{ bearerAuth: [] }],

                params: z.object({
                    shortCode: z.string().min(1),
                }),

                response: {
                    200: utmResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        getUtm
    );

    router.put(
        "/v1/urls/:shortCode/utm",
        {
            schema: {
                tags: ["UTM"],
                operationId: "setUtm",
                summary: "Set UTM configuration",
                description: "Set or update the UTM configuration for a short URL.",

                security: [{ bearerAuth: [] }],

                params: z.object({
                    shortCode: z.string().min(1),
                }),

                body: utmConfigSchema,

                response: {
                    200: utmResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        setUtm
    );

    router.delete(
        "/v1/urls/:shortCode/utm",
        {
            schema: {
                tags: ["UTM"],
                operationId: "deleteUtm",
                summary: "Delete UTM configuration",
                description: "Delete the UTM configuration for a short URL.",

                security: [{ bearerAuth: [] }],

                params: z.object({
                    shortCode: z.string().min(1),
                }),

                response: {
                    204: z.void(),
                    404: errorResponseSchema,
                },
            },
        },
        deleteUtm
    );
};
