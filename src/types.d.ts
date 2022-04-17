import { User } from "./models";
declare global {
    namespace Express {
        interface Request {
            user: User;
            refreshToken: string;
            payload: {
                userId: number;
                tokenVersion: number;
                [x: string]: any;
            };
        }
    }
}
