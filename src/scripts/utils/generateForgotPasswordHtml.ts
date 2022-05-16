interface Iparams {
    token: string;
}

export const generateForgotPasswordHTML = ({ token }: Iparams) => {
    return `<p>Click this link to reset password </br> ${process.env.ORIGIN}/reset-password/${token}`;
};
