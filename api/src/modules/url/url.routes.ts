import type { FastifyInstance } from "fastify";
import { createShortUrl } from "./url.controller";

export async function urlRoutes(fastify: FastifyInstance) {
    fastify.post("/urls", createShortUrl);
}