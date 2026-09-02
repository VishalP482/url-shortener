import Fastify from "fastify";
import cors from "@fastify/cors";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from "@fastify/type-provider-zod";

import { swaggerConfig } from "./config/swagger";
import { apiRoutes } from "./routes/api.routes";

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
app.register(apiRoutes);

app.get("/health", async () => {
    return {
        status: "ok",
    };
});