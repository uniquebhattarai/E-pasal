const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail/templates/emailTemplates");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10 * 60,
    },
});

async function sendVerificationEmail(email, otp) {
    try {
        const htmlBody = otpTemplate(otp);
        const mailResponse = await mailSender(
            email,
            "verification Email from E-pasal",
            htmlBody
        );
        console.log("Verification email sent successfully:", mailResponse?.messageId);
    } catch (error) {
        console.error("Error while sending verification email:", error);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", otpSchema);
