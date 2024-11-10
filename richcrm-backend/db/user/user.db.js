/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of User
 * 
 * @typedef {object} User
 * @property {string} EmailAddress - User's email address (Primary Key)
 * @property {string} Password - User's password
 * @property {string} UserName - User's name
 * @property {enum} Role - User's role (ADMIN, ATTORNEY, CLIENT)
 */

const db = require('../dynamodb');

class User {
    constructor () {
        this.table = 'User';
    }

    async getUserByEmail (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: emailAddress
            }
        };
        const user = await db.get(params).promise();
        return user;
    }

    async getAllUsers () {
        const params = {
            TableName: this.table
        };
        const users = await db.scan(params).promise();
        return users;
    }

    async createUser (user) {
        const params = {
            TableName: this.table,
            Item: {
                EmailAddress: user.emailAddress,
                Password: user.password,
                UserName: user.userName,
                Role: user.role
            }
        };
        await db.put(params).promise();
        
        return params.Item;
    }

    async updateUser (user) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: user.emailAddress
            },
            UpdateExpression: "",
            ExpressionAttributeValues: {},
            ReturnValues: 'UPDATED_NEW'
        };

        var updateExpressions = [];
        var expressionAttributeNames = {};
        // Optional fields
        if (user.password !== undefined) {
            updateExpressions.push("Password = :p");
            params.ExpressionAttributeValues[':p'] = user.password;
        }
        if (user.userName !== undefined) {
            updateExpressions.push("UserName = :u");
            params.ExpressionAttributeValues[':u'] = user.userName;
        }
        if (user.role !== undefined) {
            updateExpressions.push("#r = :r");
            expressionAttributeNames['#r'] = 'Role';
            params.ExpressionAttributeValues[':r'] = user.role;
        }

        if (updateExpressions.length > 0) {
            params.UpdateExpression = "SET " + updateExpressions.join(", ");
        } else {
            return null;
        }
        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }
        const update = await db.update(params).promise();
        return update.Attributes;
    }

    async deleteUser (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: emailAddress
            }
        };
        return await db.delete(params).promise();
    }
}

module.exports = new User();