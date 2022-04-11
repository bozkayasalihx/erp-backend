import User from "./models/User";
declare global {
    namespace Express {
        interface User {
            email: string;
            username: string;
        }
        interface Request {
            user: User;
            refreshToken: string;
        }
    }
}
