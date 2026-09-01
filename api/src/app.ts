import Fastify from "fastify";
import cors from "@fastify/cors";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from "@fastify/type-provider-zod";

import { urlRoutes } from "./modules/url";
import { redirectRoutes } from "./modules/redirect";

import { swaggerConfig } from "./config/swagger";

export const app = Fastify({
    logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: true,
});

// Swagger
app.register(fastifySwagger, {
    ...swaggerConfig,
    transform: jsonSchemaTransform,
});

// Swagger UI
app.register(fastifySwaggerUi, {
    routePrefix: "/doc",
});

// Routes
app.register(urlRoutes, {
    prefix: "/api/v1",
});

app.register(redirectRoutes);

app.get("/health", async () => {
    return {
        status: "ok",
    };
});