import nodemailer from "nodemailer"

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: "SE LAB MFU <glasssirikorn@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail