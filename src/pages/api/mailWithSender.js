import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    const { email, subject, text, html, brevoSmtp, brevoUser, brevoApi, brevoSender } = req.query;
    if (!email || !text || !subject || !html || !brevoSmtp || !brevoUser || !brevoApi || !brevoSender ) return res.status(400).json({ message: 'Infos Manquantes' });

    const transporter = nodemailer.createTransport({
        host: brevoSmtp,
        port: 587,
        auth: {
            user: brevoUser,
            pass: brevoApi,
        },
    });

    try {
        await transporter.verify();
        await transporter.sendMail({
            from: brevoSender,
            to: email,
            subject,
            text,
            html,
        });

        return res.status(200).json({ message: 'Email code sent!' });
    } catch (message) {
        console.log('Erreur lors de l\'envoi de l\'email :', message);
        return res.status(500).json({ message: 'Failed to send email', details: message.message });
    }
}
