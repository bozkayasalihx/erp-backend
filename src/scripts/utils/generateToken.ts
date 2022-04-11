import jwt from "jsonwebtoken";

interface IGenerateToken {
    name: string;
    email: string;
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
