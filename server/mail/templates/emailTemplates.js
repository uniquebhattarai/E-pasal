
exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Password Update Confirmation</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; color: #333; margin:0; padding:0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
            .logo { max-width: 180px; margin-bottom: 20px; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .highlight { font-weight: bold; }
            .support { font-size: 14px; color: #999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <a href='https://epasal.com'>
                <img class='logo' src='https://i.ibb.co/your-ePasal-logo.png' alt='e-Pasal Logo'>
            </a>
            <div class='message'>Password Update Confirmation</div>
            <div class='body'>
                <p>Hi ${name},</p>
                <p>Your password has been successfully updated for the email <span class='highlight'>${email}</span>.</p>
                <p>If you did not request this change, please contact our support immediately.</p>
            </div>
            <div class='support'>
                For assistance, contact <a href='mailto:support@epasal.com'>support@epasal.com</a>.
            </div>
        </div>
    </body>
    </html>`;
};

// OTP Verification Email
exports.otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification</title>
        <style>
            body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; color: #333; margin:0; padding:0; }
            .container { max-width: 600px; margin:0 auto; padding:20px; text-align:center; }
            .logo { max-width: 180px; margin-bottom: 20px; }
            .message { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
            .body { font-size: 16px; margin-bottom: 20px; }
            .cta { display:inline-block; padding:10px 20px; background-color:#FFD60A; color:#000; text-decoration:none; border-radius:5px; font-weight:bold; margin-top:20px; }
            .highlight { font-weight:bold; }
            .support { font-size: 14px; color:#999; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://epasal.com">
                <img class="logo" src="https://i.ibb.co/your-ePasal-logo.png" alt="e-Pasal Logo">
            </a>
            <div class="message">OTP Verification</div>
            <div class="body">
                <p>Dear User,</p>
                <p>Use the following OTP to verify your account registration:</p>
                <h2 class="highlight">${otp}</h2>
                <p>This OTP is valid for 5 minutes. If you did not request it, ignore this email.</p>
            </div>
            <div class="support">
                Need help? Contact us at <a href="mailto:support@epasal.com">support@epasal.com</a>.
            </div>
        </div>
    </body>
    </html>`;
};

// Course / Order Confirmation Email
exports.orderConfirmation = (productName, name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Order Confirmation</title>
        <style>
            body { background-color:#ffffff; font-family:Arial,sans-serif; font-size:16px; color:#333; margin:0; padding:0; }
            .container { max-width:600px; margin:0 auto; padding:20px; text-align:center; }
            .logo { max-width:180px; margin-bottom:20px; }
            .message { font-size:18px; font-weight:bold; margin-bottom:20px; }
            .body { font-size:16px; margin-bottom:20px; }
            .cta { display:inline-block; padding:10px 20px; background-color:#FFD60A; color:#000; text-decoration:none; border-radius:5px; font-weight:bold; margin-top:20px; }
            .highlight { font-weight:bold; }
            .support { font-size:14px; color:#999; margin-top:20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://epasal.com">
                <img class="logo" src="https://i.ibb.co/your-ePasal-logo.png" alt="e-Pasal Logo">
            </a>
            <div class="message">Order Confirmation</div>
            <div class="body">
                <p>Hi ${name},</p>
                <p>Your order for <span class="highlight">${productName}</span> has been successfully placed!</p>
                <a class="cta" href="https://epasal.com/dashboard">Go to My Orders</a>
            </div>
            <div class="support">
                Questions? Contact <a href="mailto:support@epasal.com">support@epasal.com</a>.
            </div>
        </div>
    </body>
    </html>`;
};
