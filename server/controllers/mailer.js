import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
});


export const registerMail = async (req, res) => {
    const { userEmail, text, subject } = req.body;
    const mail = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        html: text,
    };

    transporter.sendMail(mail)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send(error))
};
