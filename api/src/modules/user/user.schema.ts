import { z } from "zod";

export const userResponseSchema = z.object({
    id: z
        .number()
        .meta({
            description: "User ID",
            examples: [1],
        }),

    name: z
        .string()
        .meta({
            description: "User name",
            examples: ["John Doe"],
        }),

    email: z
        .string()
        .email()
        .meta({
            description: "User email",
            examples: ["john@example.com"],
        }),

    status: z
        .enum(["active", "inactive", "deleted"])
        .meta({
            description: "User account status",
            examples: ["active"],
        }),

    createdAt: z
        .iso
        .datetime()
        .meta({
            description: "Creation timestamp",
            examples: ["2024-01-01T00:00:00Z"],
        }),
});

export const meResponseSchema = z.object({
    user: userResponseSchema,
});

export const errorResponseSchema = z.object({
    message: z.string().meta({
        description: "Error message",
        examples: ["User not found"],
    }),
});
