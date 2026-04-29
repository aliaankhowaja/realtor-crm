import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendEmail({ to, subject, html }: {
  to: string
  subject: string
  html: string
}) {
  try {
    await transporter.sendMail({
      from: `"Property CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`Email sent to ${to}`)
  } catch (error) {
    console.error('Email send failed:', error)
    // Do NOT rethrow — email failure should not crash the API
  }
}
