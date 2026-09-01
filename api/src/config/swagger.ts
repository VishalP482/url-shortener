import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
    openapi: {
        info: {
            title: "URL Shortener API",
            description: "API for creating and resolving shortened URLs",
            version: "1.0.0",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development",
            },
        ],

        tags: [
            {
                name: "URL",
                description: "URL shortening operations",
            },
            {
                name: "Redirect",
                description: "Short URL redirect operations",
            },
        ],
    },
};