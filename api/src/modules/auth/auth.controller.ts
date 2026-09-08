import crypto from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { z } from "zod";
import { authService } from "./auth.service";
import {
    registerSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    authResponseSchema,
    tokenResponseSchema,
} from "./auth.schema";

type RegisterRequest = FastifyRequest<{
    Body: z.infer<typeof registerSchema>;
}>;

type LoginRequest = FastifyRequest<{
    Body: z.infer<typeof loginSchema>;
}>;

type RefreshRequest = FastifyRequest<{
    Body: z.infer<typeof refreshSchema>;
}>;

type LogoutRequest = FastifyRequest<{
    Body: z.infer<typeof logoutSchema>;
}>;

export async function register(
    request: RegisterRequest,
    reply: FastifyReply
) {
    try {
        const result = await authService.register(request.body);

        return reply.status(201).send({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        return reply.status(400).send({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}

export async function login(request: LoginRequest, reply: FastifyReply) {
    try {
        // Generate a unique session ID for this login session
        const sessionId = crypto.randomBytes(16).toString("hex");

        // Capture client metadata for session tracking
        const userAgent = request.headers["user-agent"] as string | undefined;
        const ipAddress = request.ip;

        const result = await authService.login({
            ...request.body,
            sessionId,
            userAgent,
            ipAddress,
        });

        return reply.status(200).send({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        return reply.status(401).send({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}

export async function refresh(
    request: RefreshRequest,
    reply: FastifyReply
) {
    try {
        const result = await authService.refresh(request.body);

        return reply.status(200).send({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        return reply.status(401).send({
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}

export async function logout(
    request: LogoutRequest,
    reply: FastifyReply
) {
    try {
        await authService.logout(request.body);

        return reply.status(204).send();
    } catch {
        return reply.status(204).send();
    }
}
