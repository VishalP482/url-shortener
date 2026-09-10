import { FastifyInstance } from "fastify";
import { urlRoutes } from "../modules/url";
import { redirectRoutes } from "../modules/redirect";
import { authRoutes } from "../modules/auth";
import { userRoutes } from "../modules/user";
import { utmRoutes } from "../modules/utm";
import { analyticsRoutes } from "../modules/analytics";

export async function apiRoutes(app: FastifyInstance) {

    app.register(authRoutes, {
        prefix: "/api",
    });

    app.register(userRoutes, {
        prefix: "/api",
    });

    app.register(urlRoutes, {
        prefix: "/api",
    });

    app.register(utmRoutes, {
        prefix: "/api",
    });

    app.register(analyticsRoutes, {
        prefix: "/api",
    });

    app.register(redirectRoutes);
}
