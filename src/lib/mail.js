import nodemailer from 'nodemailer';
import { env } from '../config/env';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});
export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${env.ORIGIN}/reset-password?token=${token}`;
    try {
        await transporter.sendMail({
            from: `"Deudas App" <${env.SMTP_USER}>`,
            to: email,
            subject: 'Recuperar contraseña - Deudas App',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Recuperar contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               Restablecer contraseña
            </a>
          </div>
          <p>Si no solicitaste esto, puedes ignorar este correo.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Este enlace expirará en 1 hora.</p>
        </div>
      `,
        });
    }
    catch (error) {
        console.error('Error sending email with Nodemailer:', error);
        throw new Error('Failed to send reset email');
    }
};
