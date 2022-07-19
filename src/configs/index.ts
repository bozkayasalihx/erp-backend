import nodemailer from "nodemailer";
import eventemitter from "../loaders/eventEmitter";

export const eventHandler = () => {
    eventemitter.on("send_email", async ({ toEmail, subject, html }) => {
        // const pass = process.env.SENDER_EMAIL_PASSWORD as string;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: "N3h9!73t26",
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

    // eventemitter.on(
    //     "process_invoiceInterface",
    //     async ({ file_process_id, user }, filePath) => {
    //         const viDataVerifier = new DataVerifier("vi");
    //         await viDataVerifier.setter({ file_process_id });
    //         viDataVerifier.validate();
    //         viDataVerifier.getData;

    //         try {
    //             if (!viDataVerifier.errors.size) {
    //                 for (let i = 0; i < viDataVerifier.getData.length; i++) {
    //                     await invoiceOperation.invoiceRepo.save({
    //                         ...(viDataVerifier.getData[i] as any),
    //                         created_by: user,
    //                         updated_by: user,
    //                     });
    //                 }
    //             } else {
    //                 console.log(viDataVerifier.errors);
    //             }

    //             return true;
    //         } catch (err) {
    //             return false;
    //         } finally {
    //             filePath && (await unlink(filePath));
    //         }
    //     }
    // );

    // eventemitter.on(
    //     "process_psi",
    //     async ({ file_process_id, user }, filePath) => {
    //         const maker = await paymentOperation.PSIRepo.find({
    //             where: { file_process_id },
    //         });
    //         const psDataVerifier = new DataVerifier("psi");
    //         await psDataVerifier.setter({ file_process_id });
    //         psDataVerifier.validate();
    //     }
    // );
};
