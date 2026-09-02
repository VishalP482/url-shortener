import { FastifyInstance } from "fastify";
import { urlRoutes } from "../modules/url";
import { redirectRoutes } from "../modules/redirect";

export async function apiRoutes(app: FastifyInstance) {
    app.register(urlRoutes, {
        prefix: "/api",
    });

    app.register(redirectRoutes);
}
