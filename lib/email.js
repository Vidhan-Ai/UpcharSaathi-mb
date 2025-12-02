import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"UpcharSaathi" <noreply@upcharsaathi.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export const emailTemplates = {
    welcome: (name) => `
    <h1>Welcome to UpcharSaathi, ${name}!</h1>
    <p>We are excited to have you on board.</p>
    <p>Get started by exploring our features.</p>
  `,
    resetPassword: (link) => `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${link}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  `,
    verifyEmail: (link) => `
    <h1>Verify Your Email Address</h1>
    <p>Thank you for signing up! Please click the link below to verify your email address:</p>
    <a href="${link}">Verify Email</a>
    <p>If you didn't create an account, please ignore this email.</p>
  `
};
