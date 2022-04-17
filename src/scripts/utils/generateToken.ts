import jwt from "jsonwebtoken";

interface IGenerateToken {
    userId: number;
    tokenVersion: number;
}

export default function generateToken(
    params: IGenerateToken,
    secretKey: string,
    expiresIn: string
) {
    return jwt.sign(params, secretKey, {
        expiresIn,
    });
}
