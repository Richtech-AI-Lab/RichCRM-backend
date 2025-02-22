/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of Contact
 * 
 * @typedef {object} Contact
 * @property {string} ContactId - Contact ID
 * @property {array} Tags - Tag Labels (foreign key to Tag)
 * @property {string} FirstName - Contact's first name
 * @property {string} LastName - Contact's last name
 * @property {string} Company - Company name
 * @property {string} Position - Contact's position in the company
 * @property {string} CellNumber - Contact's cell phone number 
 * @property {string} Email - Contact's email address
 * @property {string} MailingAddress - Contact's mailing address (foreign key to Address)
 * @property {string} WechatAccount - Contact's WeChat Account
 * @property {string} Note - Note for this contact
 */


const db = require('../dynamodb');

class Contact {
    constructor() {
        this.table = 'Contact';
    }

    async getContactById(contactId) {
        const params = {
            TableName: this.table,
            Key: {
                ContactId: contactId,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async getAllContacts() {
        let params = {
            TableName: this.table,
            Limit: 1000,
        };
        let contacts = [];
        while (true) {
            const data = await db.scan(params);
            contacts = contacts.concat(data.Items);
            if (!data.LastEvaluatedKey) {
                break;
            }
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        }
        return contacts;
    }

    async getContactsByTag(label) {
        const params = {
            TableName: this.table,
            FilterExpression: 'contains(Tags, :t)',
            ExpressionAttributeValues: {
                ':t': label,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getContactsByTags(labels) {
        let filterExpression = '';
        const expressionAttributeValues = {};
        for (let i = 0; i < labels.length; i++) {
            filterExpression += `contains(Tags, :t${i})`;
            if (i < labels.length - 1) {
                filterExpression += ' OR ';
            }
            expressionAttributeValues[`:t${i}`] = labels[i];
        };
        const params = {
            TableName: this.table,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };
        const data = await db.scan(params);
        return data;
    }


    async getContactsByKeyword(keyword) {
        const params = {
            TableName: this.table,
            FilterExpression: 'contains(FirstName, :k) or contains(LastName, :k) or contains(Company, :k) or contains(#p, :k)',
            ExpressionAttributeValues: {
                ':k': keyword,
            },
            ExpressionAttributeNames: {
                '#p': 'Position',
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getContactsByPhoneNumber(phoneNumber) {
        const params = {
            TableName: this.table,
            FilterExpression: 'CellNumber = :c',
            ExpressionAttributeValues: {
                ':c': phoneNumber,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getContactsByEmail(email) {
        const params = {
            TableName: this.table,
            FilterExpression: 'Email = :e',
            ExpressionAttributeValues: {
                ':e': email,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async createContact(contact) {
        const params = {
            TableName: this.table,
            Item: {
                ContactId: contact.contactId,
                Tags: contact.tags,
                FirstName: contact.firstName,
                LastName: contact.lastName,
                Company: contact.company,
                Position: contact.position,
                CellNumber: contact.cellNumber,
                Email: contact.email,
                MailingAddress: contact.mailingAddress,
                WechatAccount: contact.wechatAccount,
                Note: contact.note,
            },
        };
        await db.put(params);
        return params.Item;
    }

    async updateContact(contact) {
        const params = {
            TableName: this.table,
            Key: {
                ContactId: contact.contactId,
            },
            UpdateExpression: 'set #fn = :fn',
            ExpressionAttributeValues: {
                ':fn': contact.firstName,
            },
            ExpressionAttributeNames: {
                '#fn': 'FirstName',
            },
            ReturnValues: 'UPDATED_NEW',
        };

        // Optional fields
        if (contact.lastName !== undefined) {
            params.ExpressionAttributeValues[':ln'] = contact.lastName;
            params.ExpressionAttributeNames['#ln'] = 'LastName';
            params.UpdateExpression += ', #ln = :ln';
        }

        if (contact.company !== undefined) {
            params.ExpressionAttributeValues[':c'] = contact.company;
            params.ExpressionAttributeNames['#c'] = 'Company';
            params.UpdateExpression += ', #c = :c';
        }

        if (contact.position !== undefined) {
            params.ExpressionAttributeValues[':p'] = contact.position;
            params.ExpressionAttributeNames['#p'] = 'Position';
            params.UpdateExpression += ', #p = :p';
        }

        if (contact.tags !== undefined) {
            params.ExpressionAttributeValues[':t'] = contact.tags;
            params.UpdateExpression += ', Tags = :t';
        }

        if (contact.cellNumber !== undefined) {
            params.ExpressionAttributeValues[':cn'] = contact.cellNumber;
            params.UpdateExpression += ', CellNumber = :cn';
        }

        if (contact.email !== undefined) {
            params.ExpressionAttributeValues[':e'] = contact.email;
            params.UpdateExpression += ', Email = :e';
        }

        if (contact.mailingAddress !== undefined) {
            params.ExpressionAttributeValues[':ma'] = contact.mailingAddress;
            params.UpdateExpression += ', MailingAddress = :ma';
        }

        if (contact.wechatAccount !== undefined) {
            params.ExpressionAttributeValues[':wa'] = contact.wechatAccount;
            params.UpdateExpression += ', WechatAccount = :wa';
        }

        if (contact.note !== undefined) {
            params.ExpressionAttributeValues[':n'] = contact.note;
            params.UpdateExpression += ', Note = :n';
        }
        
        const data = await db.update(params);
        return data.Attributes;
    }

    async deleteContact(contactId) {
        const params = {
            TableName: this.table,
            Key: {
                ContactId: contactId,
            },
        };
        await db.delete(params);
    }
}

module.exports = new Contact();