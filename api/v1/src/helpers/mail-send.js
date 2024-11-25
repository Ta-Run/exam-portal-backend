const nodemailer = require('nodemailer')

require('dotenv').config()

module.exports = async (data, sub) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: data.email,
    subject: sub,
    text: `Dear ${data.clientName},

    Welcome to Exam Portal! We're excited to have you on board.
    
    Below are your account details:
    
    - Email: ${data.email}
    - Temporary Password: ${data.password}
    
    This account was created for you by ${data.createdByName}.
    
    Important: Change Your Password
    
    For your security, please log in to your account and change your password as soon as possible. Here’s how you can do it:
    
    1. Visit our website and log in with your temporary password.
    2. Navigate to the account settings.
    3. Select the option to change your password and follow the instructions.
    
    If you have any questions or need assistance, please don't hesitate to contact our support team.
    
    Welcome again, and we look forward to serving you!
    
    Best regards,
    
    Exam portal Team
    
    ---
    
    Note: Please ensure you change your password immediately upon logging in for the first time to maintain the security of your account.`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log(`Email sent: ${info.response}`)
    }
  })
}
