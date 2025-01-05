/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of Client
 * 
 * @typedef {object} Client
 * @property {string} ClientId - Client ID
 * @property {clientType} ClientType - Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST)
 * @property {array} Tags - Tag Labels (foreign key to Tag)
 * @property {title} Title - Client's title
 * @property {string} FirstName - Client's first name
 * @property {string} LastName - Client's last name
 * @property {gender} Gender - Client's gender
 * @property {string} CellNumber - Client's cell phone number
 * @property {string} WorkNumber - Client's work phone number
 * @property {string} Email - Client's email address
 * @property {string} WechatAccount - Client's WeChat Account
 * @property {string} SSN - Client's Social Security Number
 * @property {Date} DOB - Client's date of birth
 * @property {string} AttorneyId - Foreign key to Attorney
 * @property {string} BankAttorneyId - Foreign key to Bank Attorney
 * @property {string} AddressId - Foreign key to Address
 * @property {string} OrganizationId - Foreign key to Organization
 */

const db = require('../dynamodb');
const { title, gender, clientType } = require('../types');

class Client {
    constructor() {
        this.table = 'Client';
    }

    async getClientById(clientId) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: clientId,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async getAllClients() {
        const params = {
            TableName: this.table,
        };
        const data = await db.scan(params);
        return data;
    }

    async getClientsByTag(label) {
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

    async getClientsByTags(labels) {
        let filterExpression = "";
        const expressionAttributeValues = {};
        labels.forEach((label, i) => {
            filterExpression += `contains(Tags, :t${i})`;
            expressionAttributeValues[`:t${i}`] = label;
            if (i < labels.length - 1) {
                filterExpression += ' OR ';
            }
        });
        const params = {
            TableName: this.table,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };
        const data = await db.scan(params);
        return data;
    }

    async getClientsByType(clientType) {
        const params = {
            TableName: this.table,
            FilterExpression: 'ClientType = :t',
            ExpressionAttributeValues: {
                ':t': clientType,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getClientByPhoneNumber(phoneNumber) {
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

    async getClientByEmail(email) {
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

    async getClientsByKeyword(keyword) {
        const params = {
            TableName: this.table,
            FilterExpression: 'contains(FirstName, :k) or contains(LastName, :k) or contains(Email, :k) or contains(CellNumber, :k)',
            ExpressionAttributeValues: {
                ':k': keyword,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getClientsByKeywords(keywords) {
        const filterExpression = keywords.map((k, i) => `(contains(FirstName, :k${i}) or contains(LastName, :k${i}) or contains(Email, :k${i}) or contains(CellNumber, :k${i}))`).join(' and ');
        const expressionAttributeValues = {};
        keywords.forEach((k, i) => {
            expressionAttributeValues[`:k${i}`] = k;
        });
        const params = {
            TableName: this.table,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
        };
        const data = await db.scan(params);
        return data;
    }


    async createClient(client) {
        const params = {
            TableName: this.table,
            Item: {
                ClientId: client.clientId,
                ClientType: client.clientType,
                Title: client.title,
                Tags: client.tags,
                FirstName: client.firstName,
                LastName: client.lastName,
                Gender: client.gender,
                CellNumber: client.cellNumber,
                WorkNumber: client.workNumber,
                Email: client.email,
                SSN: client.ssn,
                DOB: client.dob,
                AttorneyId: client.attorneyId,
                BankAttorneyId: client.bankAttorneyId,
                AddressId: client.addressId,
                OrganizationId: client.organizationId,
            },
        };
        await db.put(params);
        return params.Item;
    }

    async updateClient(client) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: client.clientId,
            },
            UpdateExpression: 'set ClientType = :ct',
            ExpressionAttributeValues: {
                ':ct': client.clientType,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        // Optional fields
        const expressionAttributeNames = {};
        if (client.title !== undefined) {
            params.ExpressionAttributeValues[':t'] = client.title;
            params.UpdateExpression += ', Title = :t';
        }
        if (client.tags !== undefined) {
            params.ExpressionAttributeValues[':ts'] = client.tags;
            params.UpdateExpression += ', #ts = :ts';
            expressionAttributeNames['#ts'] = 'Tags';
        }
        if (client.firstName !== undefined) {
            params.ExpressionAttributeValues[':f'] = client.firstName;
            params.UpdateExpression += ', FirstName = :f';
        }
        if (client.lastName !== undefined) {
            params.ExpressionAttributeValues[':l'] = client.lastName;
            params.UpdateExpression += ', LastName = :l';
        }
        if (client.gender !== undefined) {
            params.ExpressionAttributeValues[':g'] = client.gender;
            params.UpdateExpression += ', Gender = :g';
        }
        if (client.cellNumber !== undefined) {
            params.ExpressionAttributeValues[':c'] = client.cellNumber;
            params.UpdateExpression += ', CellNumber = :c';
        }
        if (client.email !== undefined) {
            params.ExpressionAttributeValues[':e'] = client.email;
            params.UpdateExpression += ', Email = :e';
        }
        if (client.ssn !== undefined) {
            params.ExpressionAttributeValues[':ssn'] = client.ssn;
            params.UpdateExpression += ', SSN = :ssn';
        }
        if (client.attorneyId !== undefined) {
            params.ExpressionAttributeValues[':a'] = client.attorneyId;
            params.UpdateExpression += ', AttorneyId = :a';
        }
        if (client.bankAttorneyId !== undefined) {
            params.ExpressionAttributeValues[':b'] = client.bankAttorneyId;
            params.UpdateExpression += ', BankAttorneyId = :b';
        }
        if (client.addressId !== undefined) {
            params.ExpressionAttributeValues[':ad'] = client.addressId;
            params.UpdateExpression += ', AddressId = :ad';
        }
        if (client.wechatAccount !== undefined) {
            params.ExpressionAttributeValues[':wc'] = client.wechatAccount;
            params.UpdateExpression += ', WechatAccount = :wc';
        }
        if (client.dob !== undefined) {
            params.ExpressionAttributeValues[':d'] = client.dob;
            params.UpdateExpression += ', DOB = :d';
        }
        if (client.workNumber !== undefined) {
            params.ExpressionAttributeValues[':w'] = client.workNumber;
            params.UpdateExpression += ', WorkNumber = :w';
        }
        if (client.organizationId !== undefined) {
            params.ExpressionAttributeValues[':o'] = client.organizationId;
            params.UpdateExpression += ', OrganizationId = :o';
        }

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const data = await db.update(params);
        return data.Attributes;
    }

    async deleteClient(clientId) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: clientId,
            },
        };
        const data = await db.delete(params);
        return data;
    }

}

module.exports = new Client();