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

        namespace NodeJS {
            interface ProcessEnv {
                DB_PORT: number;
                PORT: number;
                DB_NAME: string;
                HOST: string;
                DB_USER: string;
                DB_PASSWORD: string;
                NODE_ENV: string;
                REDIS_URL: string;
                ACCESS_TOKEN_SECRET_KEY: string;
                REFRESH_TOKEN_SECRET_KEY: string;
                SALT: number;
                EMAIL_HOST: string;
                EMAIL_PORT: number;
                EMAIL_USER: string;
                EMAIL_PASWORD: string;
                EMAIL_FROM: string;
                TOKEN_EXPIRE: number;
                ORIGIN: string;
            }
        }
    }
}
export {};
