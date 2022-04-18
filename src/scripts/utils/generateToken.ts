import jwt from "jsonwebtoken";

interface IGenerateToken {
    userId: number;
    tokenVersion: number;
}

export function generateAccessToken(params: IGenerateToken, secretKey: string) {
    return jwt.sign(params, secretKey, {
        expiresIn: "10m",
    });
}

export function generateRefreshToken(
    params: IGenerateToken,
    secretKey: string
) {
    return jwt.sign(params, secretKey, {
        expiresIn: "1d",
    });
}
