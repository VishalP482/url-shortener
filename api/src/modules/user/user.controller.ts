import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { userService } from "./user.service";

export async function getMe(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user = await userService.getMe((request as any).user.id);

        return reply.status(200).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                createdAt: user.createdAt.toISOString(),
            },
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        const statusCode =
            message === "User not found" ||
                message === "User account is deactivated"
                ? 404
                : 401;

        return reply.status(statusCode).send({ message });
    }
}
