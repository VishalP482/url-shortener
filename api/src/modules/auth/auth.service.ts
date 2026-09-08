import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { userRepository } from "../user/user.repository";
import { refreshTokenRepository } from "./auth.repository";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BCRYPT_ROUNDS = 10;

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a cryptographically random opaque refresh token.
 * Unlike JWTs, this token carries no embedded data — it is a random string
 * that is looked up in the database by its hash.
 */
function generateOpaqueRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a unique session ID for tracking refresh token sessions.
 * This allows revoking all tokens for a specific session/device.
 */
function generateSessionId(): string {
    return crypto.randomBytes(16).toString("hex");
}

interface GenerateTokenOptions {
    userId: number;
    sessionId: string;
    userAgent: string | undefined;
    ipAddress: string | undefined;
}

export const authService = {
    async register({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) {
        const existing = await userRepository.findByEmail(email);

        if (existing) {
            throw new Error("Email already registered");
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const user = await userRepository.create({
            name,
            email,
            passwordHash,
            isActive: true,
        });

        const sessionId = generateSessionId();
        const tokens = await authService.generateTokens({
            userId: user.id,
            sessionId,
            userAgent: undefined,
            ipAddress: undefined,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
            ...tokens,
        };
    },

    async login({
        email,
        password,
        sessionId,
        userAgent,
        ipAddress,
    }: {
        email: string;
        password: string;
        sessionId: string;
        userAgent: string | undefined;
        ipAddress: string | undefined;
    }) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
            throw new Error("Account is deactivated");
        }

        const isValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isValid) {
            throw new Error("Invalid email or password");
        }

        await refreshTokenRepository.revokeAllForUser(user.id);

        const tokens = await authService.generateTokens({
            userId: user.id,
            sessionId,
            userAgent,
            ipAddress,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
            ...tokens,
        };
    },

    async refresh({ refreshToken }: { refreshToken: string }) {
        const tokenHash = hashToken(refreshToken);
        const stored = await refreshTokenRepository.findByTokenHash(
            tokenHash
        );

        if (!stored) {
            throw new Error("Invalid refresh token");
        }

        if (stored.expiresAt <= new Date()) {
            throw new Error("Refresh token expired");
        }

        await refreshTokenRepository.revoke(stored.id);

        const tokens = await authService.generateTokens({
            userId: stored.userId,
            sessionId: stored.sessionId,
            userAgent: stored.userAgent ?? undefined,
            ipAddress: stored.ipAddress ?? undefined,
        });

        return tokens;
    },

    async logout({ refreshToken }: { refreshToken: string }) {
        const tokenHash = hashToken(refreshToken);
        const stored = await refreshTokenRepository.findByTokenHash(
            tokenHash
        );

        if (stored) {
            await refreshTokenRepository.revoke(stored.id);
        }
    },

    async generateTokens({
        userId,
        sessionId,
        userAgent,
        ipAddress,
    }: GenerateTokenOptions): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const accessToken = jwt.sign(
            { userId },
            env.JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        // Opaque refresh token — cryptographically random, no embedded claims
        const refreshToken = generateOpaqueRefreshToken();

        const now = new Date();
        const refreshTokenExpiry = new Date(
            now.getTime() + REFRESH_TOKEN_EXPIRY_MS
        );

        await refreshTokenRepository.create({
            sessionId,
            userId,
            tokenHash: hashToken(refreshToken),
            expiresAt: refreshTokenExpiry,
            revokedAt: null,
            userAgent: userAgent ?? null,
            ipAddress: ipAddress ?? null,
        });

        return { accessToken, refreshToken };
    },
};
