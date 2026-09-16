import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export interface UserRecord {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    status: "active" | "inactive" | "deleted";
    createdAt: Date;
    updatedAt: Date;
}

export const userRepository = {
    async create(
        data: Omit<UserRecord, "id" | "createdAt" | "updatedAt">
    ): Promise<UserRecord> {
        const [record] = await db
            .insert(users)
            .values({
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                status: data.status ?? "active",
            })
            .returning();

        if (!record) {
            throw new Error("Failed to create user");
        }

        return record;
    },

    async findByEmail(email: string): Promise<UserRecord | null> {
        const [record] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return record ?? null;
    },

    async findById(id: number): Promise<UserRecord | null> {
        const [record] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return record ?? null;
    },
};
