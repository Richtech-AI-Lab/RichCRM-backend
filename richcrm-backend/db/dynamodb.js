const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

let clientConfig = {
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
    },
};

if (process.env.NODE_ENV === 'local') {
    clientConfig.endpoint = process.env.ENDPOINT;
}

const client = new DynamoDBClient(clientConfig);
const doc = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });

const db = {
    get: async (params) => {
        const command = new GetCommand(params);
        return await doc.send(command);
    },

    scan: async (params) => {
        const command = new ScanCommand(params);
        return await doc.send(command);
    },

    put: async (params) => {
        const command = new PutCommand(params);
        return await doc.send(command);
    },

    update: async (params) => {
        const command = new UpdateCommand(params);
        return await doc.send(command);
    },

    delete: async (params) => {
        const command = new DeleteCommand(params);
        return await doc.send(command);
    },
}

module.exports = db;
