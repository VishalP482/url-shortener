import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";

import { register, login, refresh, logout } from "./auth.controller";
import {
    registerSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    authResponseSchema,
    tokenResponseSchema,
    errorResponseSchema,
} from "./auth.schema";

export const authRoutes: FastifyPluginAsync = async (app) => {
    const router = app.withTypeProvider<ZodTypeProvider>();

    router.post(
        "/v1/auth/register",
        {
            schema: {
                tags: ["Auth"],
                operationId: "register",
                summary: "Register a new user",
                description: "Create a new user account.",

                body: registerSchema,

                response: {
                    201: authResponseSchema,
                    400: errorResponseSchema,
                },
            },
        },
        register
    );

    router.post(
        "/v1/auth/login",
        {
            schema: {
                tags: ["Auth"],
                operationId: "login",
                summary: "Login user",
                description: "Authenticate user and return tokens.",

                body: loginSchema,

                response: {
                    200: authResponseSchema,
                    401: errorResponseSchema,
                },
            },
        },
        login
    );

    router.post(
        "/v1/auth/refresh",
        {
            schema: {
                tags: ["Auth"],
                operationId: "refresh",
                summary: "Refresh access token",
                description: "Get new access and refresh tokens.",

                body: refreshSchema,

                response: {
                    200: tokenResponseSchema,
                    401: errorResponseSchema,
                },
            },
        },
        refresh
    );

    router.post(
        "/v1/auth/logout",
        {
            schema: {
                tags: ["Auth"],
                operationId: "logout",
                summary: "Logout user",
                description: "Revoke refresh token.",

                body: logoutSchema,

                response: {
                    204: z.void(),
                    400: errorResponseSchema,
                },
            },
        },
        logout
    );
};
