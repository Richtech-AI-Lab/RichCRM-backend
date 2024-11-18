var AddressService = require('../db/address/address.service');
var TemplateService = require('../db/template/template.service');
var TaskService = require('../db/task/task.service');
var { standardizeAddress } = require('../middlewares/utils');
var ses = require('../services/ses');
var resend = require('../services/resend');


class UtilsController {
    // Address
    async registerAddress(req, res) {
        const {addressLine1, addressLine2, city, state, zipCode} = req.body;
        try {
            // Validate & standardize address
            const standardizedData = await standardizeAddress(addressLine1, addressLine2, city, state, zipCode);
            if (standardizedData === null || standardizedData.formattedAddress === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'The address you entered cannot be verified, please check and try again'
                });
            }

            let addressId = standardizedData.formattedAddress;
            if (standardizedData.addressLine2 !== null) {
                addressId = `${standardizedData.formattedAddress}#${standardizedData.addressLine2}`;
            }
            

            // Check if address already exists
            const existingAddress = await AddressService.readAddress(addressId);
            if (existingAddress !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        addressId: existingAddress.AddressId,
                        addressLine1: existingAddress.AddressLine1,
                        addressLine2: existingAddress.AddressLine2,
                        city: existingAddress.City,
                        state: existingAddress.State,
                        zipCode: existingAddress.ZipCode,
                        plus4: existingAddress.Plus4
                    }],
                    message: 'Address already exists'
                });
            }

            // Create address
            const address = await AddressService.createAddress({
                addressId: addressId,
                addressLine1: standardizedData.addressLine1,
                addressLine2: addressLine2,
                city: standardizedData.city,
                state: standardizedData.state,
                zipCode: standardizedData.zipCode,
                plus4: standardizedData.plus4
            });
            if (address !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        addressId: address.AddressId,
                        addressLine1: address.AddressLine1,
                        addressLine2: address.AddressLine2,
                        city: address.City,
                        state: address.State,
                        zipCode: address.ZipCode,
                        plus4: address.Plus4
                    }],
                    message: 'Address created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async getAllAddresses(req, res) {
        try {
            const addresses = await AddressService.readAllAddresses();
            if (addresses !== null) {
                res.status(200).json({
                    status: "success",
                    data: addresses,
                    message: 'Addresses retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'No addresses found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async getAddress(req, res) {
        const { addressId } = req.body;
        try {
            const address = await AddressService.readAddress(addressId);
            if (address !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        addressId: address.AddressId,
                        addressLine1: address.AddressLine1,
                        addressLine2: address.AddressLine2,
                        city: address.City,
                        state: address.State,
                        zipCode: address.ZipCode,
                        plus4: address.Plus4
                    }],
                    message: 'Address retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `Internal server error ${error}`
            });
        }
        res.end();
    }

    async deleteAddress(req, res) {
        const { addressId } = req.body;
        try {
            const address = await AddressService.readAddress(addressId);
            if (address === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address not found'
                });
            }
            const deletedAddress = await AddressService.deleteAddress(addressId);
            if (deletedAddress !== null) {
                res.status(200).json({
                    status: "success",
                    data: [deletedAddress],
                    message: 'Address deleted successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address deletion failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }


    // Email Send SES
    async sendEmail(req, res) {
        const { toAddresses, ccAddresses, templateTitle, templateContent } = req.body;
        try {
            const data = await ses.sendEmail({
                toAddresses: toAddresses,
                ccAddresses: ccAddresses,
                templateTitle: templateTitle,
                templateContent: templateContent
            });
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [data],
                    message: 'Email sent successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Email sending failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    // Email send Resend
    async sendEmailResend(req, res) {
        const { toAddresses, ccAddresses, replyAddress, templateTitle, templateContent, attachments } = req.body;
        try {
            const emailObj = {
                toAddresses: toAddresses,
                ccAddresses: ccAddresses,
                replyAddress: replyAddress,
                templateTitle: templateTitle,
                templateContent: templateContent
            }
            if (attachments !== undefined && attachments.length > 0) {
                const attachmentsResend = attachments.map(attachment => {
                    return {
                        filename: attachment.fileName,
                        content: attachment.fileContent
                    }
                });
                emailObj.attachments = attachmentsResend;
            }
            console.log(emailObj);
            const data = await resend.sendEmail(emailObj);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [data],
                    message: 'Email sent successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Email sending failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

}

module.exports = new UtilsController();