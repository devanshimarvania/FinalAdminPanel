const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'devanshimarvania21@gmail.com', 
        
        pass: 'abcdefghijklmnopqrst'           
    }
});

module.exports.sendOTP = (toEmail, otp) => {
    const mailOptions = {
        from: 'devanshimarvania21@gmail.com',
        to: toEmail,
        subject: 'Password Reset OTP - Purple Admin',
        text: `Your OTP for password reset is: ${otp}. It is valid for a short time.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log('OTP Email sent: ' + info.response);
        }
    });
};