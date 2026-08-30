import Fastify from "fastify";
import cors from "@fastify/cors";
import { urlRoutes } from "./modules/url";
import { redirectRoutes } from "./modules/redirect";

export const app = Fastify({
    logger: true
});

app.register(cors, {
    origin: true
});

app.register(urlRoutes, {
    prefix: "/api/v1",
});

app.register(redirectRoutes);

app.get("/health", async () => {
    return {
        status: "okk"
    };
});