import { appDataSource } from "../../loaders";
import { User } from "../../models";

export default async function revokeRefreshToken(userId: number) {
    try {
        await appDataSource
            .getRepository(User)
            .increment({ id: userId }, "tokenVersion", 1);
        return userId + 1;
    } catch (err) {
        return userId;
    }
}
