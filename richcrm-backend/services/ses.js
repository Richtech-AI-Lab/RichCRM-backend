var { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
require('dotenv').config();

const clientConfig = {
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
    },
};

if (process.env.NODE_ENV === 'local') {
    clientConfig.endpoint = process.env.ENDPOINT;
}

const SES = new SESClient(clientConfig);

const ses = {

    verifyEmailAddress: async (emails) => {
        try {
            const verificationPromises = emails.map(async email => {
                const params = {
                    EmailAddress: email,
                }
                const command = new VerifyEmailIdentityCommand(params);
                return await SES.send(command);
            })
        } catch (err) {
            console.log("Fail to verify emails: ", err, err.stack);
            return false;
        }
    },

    sendEmail: async (data) => {
        var params = {
            Destination: {
                /* required */
                ToAddresses: data.toAddresses, // Array of Emails
                CcAddresses: data.ccAddresses, // Array of Emails
            },
            Message: {
                /* required */
                Body: {
                    /* required */
                    // Html: {
                    //     Charset: "UTF-8",
                    //     Data: data.templateContent,
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: data.templateContent,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: data.templateTitle,
                },
            },
            Source: process.env.SES_SOURCE_EMAIL, /* required */
            ReplyToAddresses: [
                process.env.SES_REPLY_EMAIL,
            ],
        }

        try {
            const command = new SendEmailCommand(params);
            const data = await SES.send(command);
            return data;
        } catch (err) {
            console.log("Fail to send email: ", err, err.stack);
            return err;
        }
    },

    // TODO: Create Template
};


module.exports = ses;