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
        name: "Auth",
        description: "Authentication operations",
      },
      {
        name: "User",
        description: "User profile operations",
      },
      {
        name: "URL",
        description: "URL shortening operations",
      },
      {
        name: "Redirect",
        description: "Short URL redirect operations",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};
