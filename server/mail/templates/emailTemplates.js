/**
 * E-Pasal Professional HTML Email Templates
 * Standardized with brand colors (#0c61f6, linear-gradient(#5891f8 -> #0c61f6)),
 * inline CID logo attachment, and clean responsive layout.
 */

// Common email shell wrapper
const emailShell = ({ title, badgeText, heading, bodyContent, footerText }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7fb; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Top Accent Bar (Brand Blue Gradient) -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #5891f8 0%, #0c61f6 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px; text-align: center;">
              
              <!-- Logo -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 22px;">
                    <a href="https://epasal.com" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="https://res.cloudinary.com/dmr1vnpun/image/upload/v1794596618/unique/epasal_logo.png" alt="e-पसल" width="150" style="display: block; max-width: 160px; height: auto; border: 0; margin: 0 auto;" />
                    </a>
                  </td>
                </tr>
              </table>

              ${badgeText ? `
              <!-- Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 16px auto;">
                <tr>
                  <td style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; color: #0c61f6; letter-spacing: 0.8px; text-transform: uppercase;">
                    ${badgeText}
                  </td>
                </tr>
              </table>` : ""}

              ${heading ? `
              <!-- Main Heading -->
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${heading}
              </h1>` : ""}
              
              <!-- Body Content -->
              ${bodyContent}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                ${footerText || 'Need help? Reach out to <a href="mailto:support@epasal.com" style="color: #0c61f6; text-decoration: none; font-weight: 600;">support@epasal.com</a>'}
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} e-पसल. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// OTP Verification Email Template
exports.otpTemplate = (otp) => {
  return emailShell({
    title: "Verify Your Email - e-पसल",
    badgeText: "Account Verification",
    heading: "Verify Your Email Address",
    bodyContent: `
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Thank you for joining <strong>e-पसल</strong>! Please use the following 6-digit verification code to complete your registration and activate your account:
      </p>

      <!-- OTP Code Box -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0;">
        <tr>
          <td align="center" style="background: #f8faff; border: 1.5px dashed #3b82f6; border-radius: 14px; padding: 20px 16px;">
            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
              Your 6-Digit Code
            </div>
            <div style="font-family: 'SF Pro Display', -apple-system, 'Segoe UI', Roboto, 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0c61f6; padding-left: 10px; margin: 4px 0 6px 0;">
              ${otp}
            </div>
            <div style="font-size: 12px; color: #94a3b8; font-weight: 500;">
              &#9201; Valid for 10 minutes
            </div>
          </td>
        </tr>
      </table>

      <!-- Security Disclaimers -->
      <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        Never share this code with anyone. e-पसल will never ask for your verification code.
      </p>
      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        If you didn't request this email, you can safely ignore it.
      </p>
    `,
  });
};

// Password Updated Confirmation Email
exports.passwordUpdated = (email, name = "User") => {
  return emailShell({
    title: "Password Updated - e-पसल",
    badgeText: "Security Notice",
    heading: "Password Successfully Updated",
    bodyContent: `
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Your password has been successfully updated for the account associated with <span style="font-weight: 600; color: #0c61f6;">${email}</span>.
      </p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 20px 0;">
        <tr>
          <td style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #b91c1c; text-align: left; line-height: 1.5;">
            <strong>Important:</strong> If you did not make this change, please contact our support team immediately to secure your account.
          </td>
        </tr>
      </table>
    `,
  });
};

// Password Reset Link Email
exports.passwordResetTemplate = (url, email) => {
  return emailShell({
    title: "Reset Your Password - e-पसल",
    badgeText: "Password Reset",
    heading: "Reset Your Password",
    bodyContent: `
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        We received a request to reset your password for <span style="font-weight: 600; color: #0c61f6;">${email}</span>. Click the button below to set a new password:
      </p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 24px auto;">
        <tr>
          <td align="center" style="border-radius: 10px; background: linear-gradient(90deg, #5891f8 0%, #0c61f6 100%);">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
              Reset Password
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        This reset link will expire in 5 minutes. If you did not request a password reset, you can safely disregard this email.
      </p>
      <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #cbd5e1; word-break: break-all;">
        Or copy and paste this link: <a href="${url}" style="color: #0c61f6;">${url}</a>
      </p>
    `,
  });
};

// Order Confirmation Email
exports.orderConfirmation = (productName, name = "Customer") => {
  return emailShell({
    title: "Order Confirmation - e-पसल",
    badgeText: "Order Placed",
    heading: "Thank You for Your Order!",
    bodyContent: `
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Your order for <strong style="color: #0c61f6;">${productName}</strong> has been successfully placed and is now being processed.
      </p>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 24px auto;">
        <tr>
          <td align="center" style="border-radius: 10px; background: linear-gradient(90deg, #5891f8 0%, #0c61f6 100%);">
            <a href="https://epasal.com/dashboard/my-orders" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 10px;">
              View My Orders
            </a>
          </td>
        </tr>
      </table>
    `,
  });
};
