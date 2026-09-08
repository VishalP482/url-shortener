import { eq, and, sql } from "drizzle-orm";

import { db } from "../../db/index.js";
import { refreshTokens } from "../../db/schema.js";

export interface RefreshTokenRecord {
    id: number;
    sessionId: string;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
}

export const refreshTokenRepository = {
    async create(
        data: Omit<RefreshTokenRecord, "id" | "createdAt">
    ): Promise<RefreshTokenRecord> {
        const [record] = await db
            .insert(refreshTokens)
            .values({
                sessionId: data.sessionId,
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
                revokedAt: data.revokedAt,
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
            })
            .returning();

        if (!record) {
            throw new Error("Failed to create refresh token");
        }

        return record;
    },

    async findByTokenHash(
        tokenHash: string
    ): Promise<RefreshTokenRecord | null> {
        const [record] = await db
            .select()
            .from(refreshTokens)
            .where(
                and(
                    eq(refreshTokens.tokenHash, tokenHash),
                    sql`${refreshTokens.revokedAt} IS NULL`
                )
            )
            .limit(1);

        return record ?? null;
    },

    async revoke(id: number): Promise<boolean> {
        const result = await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(eq(refreshTokens.id, id));

        return (result.rowCount ?? 0) > 0;
    },

    async revokeAllForUser(userId: number): Promise<void> {
        await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(
                and(
                    eq(refreshTokens.userId, userId),
                    sql`${refreshTokens.revokedAt} IS NULL`
                )
            );
    },

    async revokeAllForSession(sessionId: string): Promise<void> {
        await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(
                and(
                    eq(refreshTokens.sessionId, sessionId),
                    sql`${refreshTokens.revokedAt} IS NULL`
                )
            );
    },
};
