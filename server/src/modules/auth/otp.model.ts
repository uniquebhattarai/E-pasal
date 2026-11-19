import mongoose, { Schema } from "mongoose";
import { mailSender } from "../../utils/mailSender";
import { otpTemplate } from "../../mail/templates/emailTemplates";
import { IOtp } from "../../types";

const otpSchema = new Schema<IOtp>({
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

async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  try {
    const htmlBody = otpTemplate(otp);
    const mailResponse = await mailSender(
      email,
      "Verification Email from e-पसल",
      htmlBody
    );
    console.log("Verification email sent successfully:", mailResponse?.messageId);
  } catch (error) {
    console.error("Error while sending verification email:", error);
    throw error;
  }
}

otpSchema.pre("save", async function (this: any, next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export const OTP = mongoose.model<IOtp>("OTP", otpSchema);
export default OTP;
