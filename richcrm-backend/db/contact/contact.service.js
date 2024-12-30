const Contact = require('./contact.db');

class ContactService {
    async readContact(contactId) {
        const data = await Contact.getContactById(contactId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllContacts() {
        const data = await Contact.getAllContacts();

        if (data !== undefined) {
            return data;
        }

        return null;
    }

    async readContactByKeyWord(keyword) {
        if (keyword === undefined || keyword === "") {
            console.log("[ContactService][readContactByKeyWord] Invalid keyword");
            return null;
        }
        const data = await Contact.getContactsByKeyword(keyword);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readContactByPhoneNumber(phoneNumber) {
        const data = await Contact.getContactsByPhoneNumber(phoneNumber);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readContactByEmail(email) {
        const data = await Contact.getContactsByEmail(email);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readContactsByTag(tagId) {
        const data = await Contact.getContactsByTag(tagId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readContactsByTags(tags) {
        const data = await Contact.getContactsByTags(tags);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createContact(contact) {
        // Check if the contact object is valid
        if (contact.contactId === undefined ||
            contact.firstName === undefined) {
            console.log("[ContactService][createContact] Invalid contact object");
            return null;
        }
        const data = await Contact.createContact(contact);
        return data;
    }

    async updateContact(contact) {
        // Check if the contact object is valid
        if (contact.contactId === undefined ||
            contact.firstName === undefined) {
            console.log("[ContactService][updateContact] Invalid contact object");
            return null;
        }
        const data = await Contact.updateContact(contact);
        return data;
    }

    async deleteContact(contactId) {
        const data = await Contact.deleteContact(contactId);
        return data;
    }
}

module.exports = new ContactService();