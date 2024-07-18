/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of Client
 * 
 * @typedef {object} Client
 * @property {string} ClientId - Client ID
 * @property {title} Title - Client's title
 * @property {string} FirstName - Client's first name
 * @property {string} LastName - Client's last name
 * @property {gender} Gender - Client's gender
 * @property {string} CellNumber - Client's cell phone number
 * @property {string} WorkNumber - Client's work phone number
 * @property {string} Email - Client's email address
 * @property {string} WeChatAccount - Client's WeChat Account
 * @property {string} SSN - Client's Social Security Number
 * @property {Date} DOB - Client's date of birth
 * @property {string} AttorneyId - Foreign key to Attorney
 * @property {string} BankAttorneyId - Foreign key to Bank Attorney
 * @property {string} AddressId - Foreign key to Address
 */

const db = require('../dynamodb');
const { title, gender } = require('../types');

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
        const data = await db.get(params).promise();
        return data;
    }

    async createClient(client) {
        const params = {
            TableName: this.table,
            Item: {
                ClientId: client.clientId,
                Title: client.title,
                FirstName: client.firstName,
                LastName: client.lastName,
                CellNumber: client.cellNumber,
                WorkNumber: client.workNumber,
                Email: client.email,
                SSN: client.ssn,
                DOB: client.dob,
                AttorneyId: client.attorneyId,
                BankAttorneyId: client.bankAttorneyId,
                AddressId: client.addressId,
            },
        };
        console.log('Client params:', params);
        await db.put(params).promise();
        return params.Item;
    }

    async updateClient(client) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: client.clientId,
            },
            UpdateExpression: 'set Title = :t, FirstName = :f, LastName = :l, CellNumber = :c, WorkNumber = :w, Email = :e, WeChatAccount = :wc, DOB = :d, AttorneyId = :a, BankAttorneyId = :b, AddressId = :ad',
            ExpressionAttributeValues: {
                ':t': client.title,
                ':f': client.firstName,
                ':l': client.lastName,
                ':c': client.cellNumber,
                ':w': client.workNumber,
                ':e': client.email,
                ':wc': client.wechatAccount,
                ':d': client.dob,
                ':a': client.attorneyId,
                ':b': client.bankAttorneyId,
                ':ad': client.addressId,
            },
            ReturnValues: 'UPDATED_NEW',
        };
        const data = await db.update(params).promise();
        return data;
    }

    async deleteClient(clientId) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: clientId,
            },
        };
        const data = await db.delete(params).promise();
        return data;
    }

}

module.exports = new Client();