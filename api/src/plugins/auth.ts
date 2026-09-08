import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { userRepository } from "../modules/user/user.repository";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            id: number;
            name: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
        };
    }
}

/**
 * Authenticates a request by verifying the JWT access token.
 *
 * This function is designed to be used as a `preHandler` on specific routes
 * or route groups. It does NOT need to be registered globally.
 *
 * USAGE — apply to a single route:
 *   router.post("/v1/protected", { preHandler: [authenticate] }, handler);
 *
 * USAGE — apply to an entire module/route group:
 *   export const protectedRoutes: FastifyPluginAsync = async (app) => {
 *       const router = app.withTypeProvider<ZodTypeProvider>();
 *       router.addHook("preHandler", authenticate);
 *       router.post("/v1/protected", handler);
 *   };
 */
export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({
            message: "Missing or invalid authorization header",
        });
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as { userId: number };

        const user = await userRepository.findById(decoded.userId);

        if (!user || !user.isActive) {
            return reply.status(401).send({
                message: "Invalid token",
            });
        }

        request.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    } catch {
        return reply.status(401).send({
            message: "Invalid token",
        });
    }
}

/**
 * Global auth plugin — only decorates `request.user` with `undefined`.
 * The actual authentication is performed by the `authenticate` preHandler
 * on routes that require it.
 */
export const authPlugin = fp.fastifyPlugin(async (app) => {
    app.decorateRequest("user", undefined);
});
