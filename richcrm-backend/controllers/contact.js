var ContactService = require("../db/contact/contact.service");
var ClientService = require("../db/client/client.service");
var ClientController = require("./client");
var AddressService = require("../db/address/address.service");
const { v4: uuidv4 } = require('uuid');
const Types = require("../db/types");

class ContactController {
    constructor () {

    }

    async getContact(req, res) {
        const { contactId } = req.params;
        try {
            const contact = await ContactService.readContact(contactId);
            if (contact !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        contactId: contact.ContactId,
                        contactType: contact.ContactType,
                        firstName: contact.FirstName,
                        lastName: contact.LastName,
                        company: contact.Company,
                        position: contact.Position,
                        cellNumber: contact.CellNumber,
                        email: contact.Email,
                        mailingAddress: contact.MailingAddress,
                        wechatAccount: contact.WechatAccount,
                        note: contact.Note,
                    }],
                    message: '[ContactController][getContact] Contact retrieved successfully',
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][getContact] Contact does not exist',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][getContact] Internal server error: ${error}`,
            });
        }
    }

    async registerContact(req, res) {
        const { contactType, firstName, lastName, company, position, cellNumber, email, mailingAddress, wechatAccount, note } = req.body;

        try {
            // Check if contactType is valid
            if (Types.castIntToEnum(Types.contactType, contactType) === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][registerContact] Invalid contact type',
                });
            }

            // Check if address exists
            if (mailingAddress !== undefined) {
                const existingAddress = await AddressService.readAddress(mailingAddress);
                if (existingAddress === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][registerClient] Address does not exist'
                    });
                }
            }

            // Create contact object
            const contact = await ContactService.createContact({
                contactId: uuidv4(),
                contactType: contactType,
                firstName: firstName,
                lastName: lastName,
                company: company,
                position: position,
                cellNumber: cellNumber,
                email: email,
                mailingAddress: mailingAddress,
                wechatAccount: wechatAccount,
                note: note,
            });
            if (contact !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        contactId: contact.ContactId,
                        contactType: contact.ContactType,
                        firstName: contact.FirstName,
                        lastName: contact.LastName,
                        company: contact.Company,
                        position: contact.Position,
                        cellNumber: contact.CellNumber,
                        email: contact.Email,
                        mailingAddress: contact.MailingAddress,
                        wechatAccount: contact.WechatAccount,
                        note: contact.Note,
                    }],
                    message: '[ContactController][registerContact] Contact created successfully',
                });
            } else {
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][registerContact] Contact creation failed',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][registerContact] Internal server error: ${error}`,
            });
        }
    }

    async queryContacts(req, res) {
        const { keyword } = req.body;
        var contactList = [];
        try {
            const contacts = await ContactService.readContactByKeyWord(keyword);
            if (contacts !== null) {
                contacts.forEach(contact => {
                    contactList.push({
                        contactId: contact.ContactId,
                        contactType: contact.ContactType,
                        firstName: contact.FirstName,
                        lastName: contact.LastName,
                        company: contact.Company,
                        position: contact.Position,
                        cellNumber: contact.CellNumber,
                        email: contact.Email,
                        mailingAddress: contact.MailingAddress,
                        wechatAccount: contact.WechatAccount,
                        note: contact.Note,
                    });
                });
            }
            const clients = await ClientService.readClientByKeyWord(keyword);
            if (clients !== null) {
                clients.forEach(client => {
                    contactList.push({
                        contactId: client.ClientId,
                        contactType: Types.contactType.CLIENT,
                        firstName: client.FirstName,
                        lastName: client.LastName,
                        cellNumber: client.CellNumber,
                        workNumber: client.WorkNumber,
                        email: client.Email,
                        mailingAddress: client.addressId,
                        wechatAccount: client.WechatAccount,
                    });
                });
            }
            return res.status(200).json({
                status: "success",
                data: contactList,
                message: '[ContactController][queryContacts] Contacts queried successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][queryContacts] Internal server error: ${error}`,
            });
        }
    }

    async queryContactsByType(req, res) {
        const { contactType } = req.body;
        var contactList = [];
        try {
            if (Types.castIntToEnum(Types.contactType, contactType) === "CLIENT") {
                const clients = await ClientService.readAllClients();
                if (clients !== null) {
                    clients.forEach(client => {
                        contactList.push({
                            contactId: client.ClientId,
                            contactType: Types.contactType.CLIENT,
                            firstName: client.FirstName,
                            lastName: client.LastName,
                            cellNumber: client.CellNumber,
                            workNumber: client.WorkNumber,
                            email: client.Email,
                            mailingAddress: client.AddressId,
                            wechatAccount: client.WechatAccount,
                        });
                    });
                }
                return res.status(200).json({
                    status: "success",
                    data: contactList,
                    message: '[ContactController][queryContactsByType] Contacts queried successfully',
                });
            } else {
                const contacts = await ContactService.readContactsByType(contactType);
                if (contacts !== null) {
                    contacts.forEach(contact => {
                        contactList.push({
                            contactId: contact.ContactId,
                            contactType: contact.ContactType,
                            firstName: contact.FirstName,
                            lastName: contact.LastName,
                            company: contact.Company,
                            position: contact.Position,
                            cellNumber: contact.CellNumber,
                            email: contact.Email,
                            mailingAddress: contact.MailingAddress,
                            wechatAccount: contact.WechatAccount,
                            note: contact.Note,
                        });
                    });
                }
                return res.status(200).json({
                    status: "success",
                    data: contactList,
                    message: '[ContactController][queryContactsByType] Contacts queried successfully',
                });
            }
            
            
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][queryContactsByType] Internal server error: ${error}`,
            });
        }
    }

    async updateContact(req, res) {
        const { contactId, contactType, firstName, lastName, company, position, cellNumber, email, mailingAddress, wechatAccount, note } = req.body;
        try {
            if (Types.castIntToEnum(Types.contactType, contactType) === "CLIENT") {
                req.body.clientId = contactId;
                req.body.firstName = firstName;
                req.body.lastName = lastName;
                req.body.cellNumber = cellNumber;
                req.body.email = email;
                req.body.addressId = mailingAddress;
                req.body.wechatAccount = wechatAccount;
                return ClientController.updateClient(req, res);
            }

            
            const contact = await ContactService.readContact(contactId);
            if (contact === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][updateContact] Contact does not exist',
                });
            }

            var contactObj = {
                contactId: contactId,
                contactType: contact.ContactType,
                firstName: contact.FirstName,
                lastName: contact.LastName,
                company: contact.Company,
                position: contact.Position,
                cellNumber: contact.CellNumber,
                email: contact.Email,
                mailingAddress: contact.MailingAddress,
                wechatAccount: contact.WechatAccount,
                note: contact.Note,
            }

            // Check if contactType is valid
            if (contactType !== contactObj.contactType) {
                if (Types.castIntToEnum(Types.contactType, contactType) === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ContactController][updateContact] Invalid contact type',
                    });
                }
                contactObj.contactType = contactType;
            }
            

            // Check if address exists
            if (mailingAddress !== contactObj.mailingAddress) {
                if (mailingAddress !== undefined) {
                    const existingAddress = await AddressService.readAddress(mailingAddress);
                    if (existingAddress === null) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[ClientController][updateClient] Address does not exist'
                        });
                    }
                    contactObj.mailingAddress = mailingAddress;
                }
            }
            
            // Update first name
            if (firstName !== contactObj.firstName && firstName !== undefined) {
                contactObj.firstName = firstName;
            }

            // Update last name
            if (lastName !== contactObj.lastName) {
                contactObj.lastName = lastName;
            }

            // Update company
            if (company !== contactObj.company) {
                contactObj.company = company;
            }

            // Update position
            if (position !== contactObj.position) {
                contactObj.position = position;
            }

            // Update cell number
            if (cellNumber !== contactObj.cellNumber) {
                contactObj.cellNumber = cellNumber;
            }

            // Update email
            if (email !== contactObj.email) {
                contactObj.email = email;
            }

            // Update wechat account
            if (wechatAccount !== contactObj.wechatAccount) {
                contactObj.wechatAccount = wechatAccount;
            }

            // Update note
            if (note !== contactObj.note) {
                contactObj.note = note;
            }

            const updatedContact = await ContactService.updateContact(contactObj);
            if (updatedContact !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        contactId: updatedContact.ContactId,
                        contactType: updatedContact.ContactType,
                        firstName: updatedContact.FirstName,
                        lastName: updatedContact.LastName,
                        company: updatedContact.Company,
                        position: updatedContact.Position,
                        cellNumber: updatedContact.CellNumber,
                        email: updatedContact.Email,
                        mailingAddress: updatedContact.MailingAddress,
                        wechatAccount: updatedContact.WechatAccount,
                        note: updatedContact.Note,
                    }],
                    message: '[ContactController][updateContact] Contact updated successfully',
                });
            } else {
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][updateContact] Contact update failed',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][updateContact] Internal server error: ${error}`,
            });
        }   
    }

    async deleteContact(req, res) {
        const { contactId } = req.body;
        try {
            const contact = await ContactService.readContact(contactId);
            if (contact === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][deleteContact] Contact does not exist',
                });
            }

            const deletedContact = await ContactService.deleteContact(contactId);
            if (deletedContact !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[ContactController][deleteContact] Contact deleted successfully',
                });
            } else {
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][deleteContact] Contact deletion failed',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][deleteContact] Internal server error: ${error}`,
            });
        }
    }
}

module.exports = new ContactController();