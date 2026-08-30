import { FastifyInstance } from "fastify";
import { redirectToOriginalUrl } from "./redirect.controller";

export async function redirectRoutes(fastify: FastifyInstance) {
    fastify.get("/:shortCode", redirectToOriginalUrl);
}