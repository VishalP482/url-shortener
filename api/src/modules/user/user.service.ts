import { userRepository } from "./user.repository";
import type { UserRecord } from "./user.repository";

export const userService = {
    async getMe(userId: number): Promise<UserRecord> {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.isActive) {
            throw new Error("User account is deactivated");
        }

        return user;
    },
};
