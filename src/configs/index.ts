import nodemailer from "nodemailer";
import eventemitter from "../scripts/eventEmitter";
import { password } from "../types/index";

export const eventHandler = () =>
    eventemitter.on("send_email", async ({ toEmail, subject, html }) => {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: password,
            },
        });
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: toEmail,
                subject,
                html,
            });

            return true;
        } catch (err) {
            return false;
        }
    });
