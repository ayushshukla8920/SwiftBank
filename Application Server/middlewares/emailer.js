const nodemailer = require("nodemailer");
require('dotenv').config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILERUSER,
    pass: process.env.MAILERPASS,
  },
});
async function sendVerifyOTP(to_user,otp) {
  const info = await transporter.sendMail({
    from: `"Swift Bank" ${process.env.MAILERUSER}`,
    to: to_user,
    subject: 'Account Verification', 
    text: `Your OTP for Swift Bank Account Verification is ${otp}`,
    html: `<b>Your OTP for Swift Bank Account Verification is ${otp}</b>`,
  });
}
async function sendLoginOTP(to_user,otp) {
  const info = await transporter.sendMail({
    from: `"Swift Bank" ${process.env.MAILERUSER}`,
    to: to_user,
    subject: 'Login OTP', 
    text: `Your OTP for Login to SwiftBank Account is ${otp}`,
    html: `<b>Your OTP for Login to SwiftBank Account is ${otp}</b>`,
  });
}
async function sendAdminOTP(to_user,otp) {
  const info = await transporter.sendMail({
    from: `"Swift Bank" ${process.env.MAILERUSER}`,
    to: to_user,
    subject: 'Admin Panel Login OTP', 
    text: `Your OTP for Login to SwiftBank Admin Panel is ${otp}`,
    html: `<b>Your OTP for Login to SwiftBank Admin Panel is ${otp}</b>`,
  });
}

async function sendWelcomeEmail(to_user,Account) {
  const info = await transporter.sendMail({
    from: `"Swift Bank" ${process.env.MAILERUSER}`,
    to: to_user,
    subject: 'Welcome to SwiftBank', 
    text: `Welcome to SwiftBank. Here are your New SwiftBank Account Details`,
    html: `
      <html>
        <body style="margin: 0; color: white;">
            <div style="background-color: black; width: 100%; height: 100vh; border-radius: 20px;">
                <br>
                <div style="display: flex; margin-left: 4%">
                  <img src="cid:icon@swiftbank.com" alt="" style="height: 10vh; width: 10vh;">
                  <h1 style="color: white; text-align: center; margin-left: 32%;">SwiftBank</h1>
                </div>
                <br><hr><br>
                <main>
                    <h2 style="text-align: center;">Welcome to SwiftBank</h2>
                    <h2 style="text-align: center;">Your New Account Details</h2><br><br>
                    <div style="margin-left: 38%;">
                        <p style="font-size: 14pt;">Name: ${Account.name}</p>
                        <p style="font-size: 14pt;">Customer ID: ${Account.customerId}</p>
                        <p style="font-size: 14pt;">Account Number: ${Account.accNo}</p>
                        <p style="font-size: 14pt;">Account Type: ${Account.accType}</p>
                        <p style="font-size: 14pt;">Mobile No.: ${Account.mobNo}</p>
                        <p style="font-size: 14pt;">E-mail: ${Account.email}</p>
                    </div>
                </main>
                <br><br><br><br>
            </div>
        </body>
    </html>`,
    attachments: [{
      filename: 'image.png',
      path: './public/icon.png',
      cid: 'icon@swiftbank.com' 
    }]
  });
}

module.exports = {
    sendVerifyOTP,
    sendLoginOTP,
    sendAdminOTP,
    sendWelcomeEmail,
}
