var { Resend } = require('resend');
require('dotenv').config();

const client = new Resend(process.env.RESEND_API_KEY);

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'eden.wu@richtech-ai-lab.org',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

const resend = {
    sendEmail: async (data) => {
        try {
            const response = await client.emails.send({
                from: process.env.SES_SOURCE_EMAIL,
                replyTo: process.env.SES_REPLY_EMAIL,
                to: data.toAddresses,
                cc: data.ccAddresses,
                subject: data.templateTitle,
                html: data.templateContent,
                attachments: data.attachments,
            });
            return response;
        } catch (err) {
            console.log("Fail to send email: ", err, err.stack);
            return err;
        }
    }
}

module.exports = resend;