import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_LOGIN, 
		pass: process.env.SMTP_PASSWORD, 
	},
});

export async function sendMail(email: string, theme: string, html: string){
	const sendResponse = await transporter.sendMail({
		from: `"StudyTracker "<${process.env.SMTP_LOGIN}>`,
		to: email,
		subject: theme,
		html: html
	});

	return sendResponse
}
