'use strict';

const htmlEmailToken = (link) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p style="color: #555;">Thank you for signing up! Please click the link below to verify your email address:</p>
                <a href="${link}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Verify Email
                </a>
                <p style="color: #777; margin-top: 20px;">If you didn’t request this email, you can safely ignore it.</p>
            </div>
        </body>
        </html>
    `;
};

module.exports = {
    htmlEmailToken
};
