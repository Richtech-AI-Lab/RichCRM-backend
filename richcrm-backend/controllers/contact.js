var ContactService = require("../db/contact/contact.service");
var ClientService = require("../db/client/client.service");
var CaseService = require("../db/case/case.service");
var TagService = require("../db/tag/tag.service");
var ClientController = require("./client");
var AddressService = require("../db/address/address.service");
const { v4: uuidv4 } = require('uuid');
const Types = require("../db/types");

class ContactController {
    constructor () {
        this.getContact = this.getContact.bind(this);
        this.getAllContacts = this.getAllContacts.bind(this);
        this.registerContact = this.registerContact.bind(this);
        this.queryContacts = this.queryContacts.bind(this);
        this.queryContactsByTag = this.queryContactsByTag.bind(this);
        this.queryContactsByTags = this.queryContactsByTags.bind(this);
        this.queryContactsByCaseAndTag = this.queryContactsByCaseAndTag.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.procContacts = this.procContacts.bind(this);
    }

    async getContact(req, res) {
        const { contactId } = req.params;
        try {
            const contact = await ContactService.readContact(contactId);
            if (contact !== null) {
                const contactObj = this.procContact(contact);
                return res.status(200).json({
                    status: "success",
                    data: [contactObj],
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

    async getAllContacts(req, res) {
        try {
            const contacts = await ContactService.readAllContacts();
            var contactList = this.procContacts(contacts);
            const clients = await ClientService.readAllClients();
            if (clients !== null) {
                clients.forEach(client => {
                    contactList.push({
                        contactId: client.ClientId,
                        tags: client.Tags,
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
                message: '[ContactController][getAllContacts] Contacts retrieved successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][getAllContacts] Internal server error: ${error}`,
            });
        }
    }

    async registerContact(req, res) {
        const { tags, firstName, lastName, company, position, cellNumber, email, mailingAddress, wechatAccount, note } = req.body;

        try {

            // Check if tags exist
            const tagList = [];
            if (tags !== undefined && tags !== null) {
                for (let i = 0; i < tags.length; i++) {
                    const label = tags[i];
                    const tag = await TagService.readTagByLabel(label);
                    if (tag !== null) {
                        tagList.push(label);
                    }
                }
            }


            // Check existing contact
            const existingContacts = await ContactService.readContactByKeyWord(firstName);
            if (existingContacts !== null) {
                for (let i = 0; i < existingContacts.length; i++) {
                    const contact = existingContacts[i];
                    if (contact.FirstName === firstName && 
                        contact.LastName === lastName &&
                        contact.Company === company) {
                        // Update tags
                        const contactObj = this.procContact(contact);
                        tagList.forEach(tag => {
                            if (!contactObj.tags.includes(tag)) {
                                contactObj.tags.push(tag);
                            }
                        });
                        if (contactObj.email === null || contactObj.email === "") {
                            contactObj.email = email;
                        }
                        if (contactObj.cellNumber === null || contactObj.cellNumber === "") {
                            contactObj.cellNumber = cellNumber;
                        }
                        const updatedContact = await ContactService.updateContact(contactObj);
                        if (updatedContact !== null) {
                            return res.status(200).json({
                                status: "success",
                                data: [contactObj],
                                message: '[ContactController][registerContact] Existing contact updated successfully',
                            });
                        }
                    }
                }
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
                tags: tagList,
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
                const contactObj = this.procContact(contact);
                return res.status(200).json({
                    status: "success",
                    data: [contactObj],
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
                contactList = this.procContacts(contacts);
            }
            const clients = await ClientService.readClientByKeyWord(keyword);
            if (clients !== null) {
                clients.forEach(client => {
                    contactList.push({
                        contactId: client.ClientId,
                        tags: client.Tags,
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

    async queryContactsByTag(req, res) {
        const { tag } = req.body;
        var contactList = [];
        try {
            const tagObj = await TagService.readTagByLabel(tag);
            if (tagObj === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ContactController][queryContactsByTag] Tag does not exist',
                });
            }

            const contacts = await ContactService.readContactsByTag(tag);
            if (contacts !== null) {
                contactList = this.procContacts(contacts);
            }
            const clients = await ClientService.readClientsByTag(tag);
            if (clients !== null) {
                clients.forEach(client => {
                    contactList.push({
                        contactId: client.ClientId,
                        tags: client.Tags,
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
                message: '[ContactController][queryContactsByTag] Contacts queried successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][queryContactsByTag] Internal server error: ${error}`,
            });
        }
    }

    async queryContactsByTags(req, res) {
        const { tags } = req.body;
        var contactList = [];
        try {
            const tagList = [];
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                const tagObj = await TagService.readTagByLabel(tag);
                if (tagObj !== null) {
                    tagList.push(tag);
                }
            }

            if (tagList.length === 0) {
                return this.getAllContacts(req, res);
            }

            const contacts = await ContactService.readContactsByTags(tagList);
            if (contacts !== null) {
                contactList = this.procContacts(contacts);
            }
            const clients = await ClientService.readClientsByTags(tagList);
            if (clients !== null) {
                clients.forEach(client => {
                    contactList.push({
                        contactId: client.ClientId,
                        tags: client.Tags,
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
                message: '[ContactController][queryContactsByTags] Contacts queried successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][queryContactsByTags] Internal server error: ${error}`,
            });
        }
    }

    async queryContactsByCaseAndTag(req, res) {
        const { caseId, tag } = req.body;
        var contactList = [];
        try {
            const tagObj = await TagService.readTagByLabel(tag);
            if (tagObj !== null) {
                const caseObj = await CaseService.readCase(caseId);
                if (caseObj === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ContactController][queryContactsByCaseAndTag] Case does not exist',
                    });
                }
                const contactIds = caseObj.Contacts;
                if (contactIds !== null && contactIds.length > 0) {
                    for (let i = 0; i < contactIds.length; i++) {
                        const contactId = contactIds[i];
                        const contact = await ContactService.readContact(contactId);
                        if (contact !== null) {
                            const contactObj = this.procContact(contact);
                            if (contactObj.tags.includes(tag)) {
                                contactList.push(contactObj);
                            }
                        }
                    }
                }
            }
            return res.status(200).json({
                status: "success",
                data: contactList,
                message: '[ContactController][queryContactsByCaseAndTag] Contacts queried successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ContactController][queryContactsByCaseAndTag] Internal server error: ${error}`,
            });
        }
    }

    async updateContact(req, res) {
        const { contactId, tags, firstName, lastName, company, position, cellNumber, email, mailingAddress, wechatAccount, note } = req.body;
        try {
            // Check if Id is clientId
            const client = await ClientService.readClient(contactId);
            if (client !== null) {
                req.body.clientId = contactId;
                req.body.tags = tags;
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
                tags: contact.Tags,
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

            // Check if tags exist
            if (tags !== contactObj.tags && tags !== undefined && tags !== null) {
                const tagList = [];
                for (let i = 0; i < tags.length; i++) {
                    const label = tags[i];
                    const tag = await TagService.readTagByLabel(label);
                    if (tag !== null) {
                        tagList.push(label);
                    }
                }
                contactObj.tags = tagList;
            }
            

            // Check if address exists
            if (mailingAddress !== contactObj.mailingAddress && mailingAddress !== undefined && mailingAddress !== null && mailingAddress !== "") {
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
                    data: [contactObj],
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

    // Extract contact from list
    procContact(contact) {
        return {
            contactId: contact.ContactId,
            tags: contact.Tags,
            firstName: contact.FirstName,
            lastName: contact.LastName,
            company: contact.Company,
            position: contact.Position,
            cellNumber: contact.CellNumber,
            email: contact.Email,
            mailingAddress: contact.MailingAddress,
            wechatAccount: contact.WechatAccount,
            note: contact.Note,
        };
    }
    procContacts(contacts) {
        var contactList = [];
        if (contacts !== null) {
            for (let i = 0; i < contacts.length; i++) {
                const c = contacts[i];
                contactList.push(this.procContact(c));
            }
        }
        return contactList;
    }
}

module.exports = new ContactController();