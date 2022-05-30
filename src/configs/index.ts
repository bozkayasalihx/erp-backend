import nodemailer from "nodemailer";
import eventemitter from "../loaders/eventEmitter";
import DataVerifier from "../scripts/parser/dataVerifier";

export const eventHandler = () => {
    eventemitter.on("send_email", async ({ toEmail, subject, html }) => {
        const pass = process.env.SENDER_EMAIL_PASSWORD as string;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: "N3h9!73t26", // will be fixed later
            },
        });
        try {
            const resp = await transporter.sendMail({
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

    eventemitter.on("process_invoiceInterface", async ({ file_process_id }) => {
        const dataverifier = new DataVerifier("vi");
        await dataverifier.setter({ file_process_id });
        const validate = dataverifier.validate();
        console.log("validate", validate);
    });
};
