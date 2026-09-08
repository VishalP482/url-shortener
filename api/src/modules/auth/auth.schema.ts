import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(1)
        .meta({
            description: "Full name",
            examples: ["John Doe"],
        }),

    email: z
        .string()
        .email()
        .meta({
            description: "Email address",
            examples: ["john@example.com"],
        }),

    password: z
        .string()
        .min(8)
        .meta({
            description: "Password (min 8 characters)",
            examples: ["securePass123!"],
        }),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email()
        .meta({
            description: "Email address",
            examples: ["john@example.com"],
        }),

    password: z
        .string()
        .meta({
            description: "Password",
            examples: ["securePass123!"],
        }),
});

export const refreshSchema = z.object({
    refreshToken: z
        .string()
        .min(1)
        .meta({
            description: "Opaque refresh token (64-character hex string)",
            examples: ["a1b2c3d4e5f6..."],
        }),
});

export const logoutSchema = z.object({
    refreshToken: z
        .string()
        .min(1)
        .meta({
            description: "Opaque refresh token (64-character hex string)",
            examples: ["a1b2c3d4e5f6..."],
        }),
});

export const authResponseSchema = z.object({
    accessToken: z
        .string()
        .meta({
            description: "JWT access token",
            examples: ["eyJ..."],
        }),

    refreshToken: z
        .string()
        .meta({
            description: "Opaque refresh token (64-character hex string)",
            examples: ["a1b2c3d4e5f6..."],
        }),
});

export const tokenResponseSchema = z.object({
    accessToken: z
        .string()
        .meta({
            description: "JWT access token",
            examples: ["eyJ..."],
        }),

    refreshToken: z
        .string()
        .meta({
            description: "Opaque refresh token (64-character hex string)",
            examples: ["a1b2c3d4e5f6..."],
        }),
});

export const errorResponseSchema = z.object({
    message: z.string().meta({
        description: "Error message",
        examples: ["Invalid credentials"],
    }),
});
