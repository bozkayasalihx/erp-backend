import { unlink } from "fs/promises";
import nodemailer from "nodemailer";
import eventemitter from "../loaders/eventEmitter";
import DataVerifier from "../scripts/parser/dataVerifier";
import { invoiceOperation } from "../services";

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

    eventemitter.on(
        "process_invoiceInterface",
        async ({ file_process_id, user }, filePath) => {
            const dataverifier = new DataVerifier("vi");
            await dataverifier.setter({ file_process_id });
            dataverifier.validate();
            dataverifier.getData;

            try {
                if (!dataverifier.errors.size) {
                    for (let i = 0; i < dataverifier.getData.length; i++) {
                        await invoiceOperation.invoiceRepo.save({
                            ...(dataverifier.getData[i] as any),
                            created_by: user,
                            updated_by: user,
                        });
                    }
                } else {
                    console.log(dataverifier.errors);
                }
            } catch (err) {
                console.log("err", err);
            } finally {
                filePath && (await unlink(filePath));
            }
        }
    );
};
