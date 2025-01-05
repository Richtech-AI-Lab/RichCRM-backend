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
 * @property {string} UploadFolderName - User's upload folder name
 * @property {string} Salt - User's salt for password encryption
 * @property {string} refreshToken - User's renew token
 * @property {string} VerificationCode - User's verification code
 * @property {number} VerificationExp - User's verification expiration time
 * @property {boolean} EmailVerified - User's email verification status
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
        const user = await db.get(params);
        return user;
    }

    async getAllUsers () {
        const params = {
            TableName: this.table
        };
        const users = await db.scan(params);
        return users;
    }

    async createUser (user) {
        const params = {
            TableName: this.table,
            Item: {
                EmailAddress: user.emailAddress,
                Password: user.password,
                Salt: user.salt,
                UserName: user.userName,
                Role: user.role,
                EmailVerified: user.emailVerified ?? false,
                UploadFolderName: user.uploadFolderName
            }
        };
        await db.put(params);
        
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
        if (user.password !== undefined && user.salt !== undefined) {
            updateExpressions.push("Password = :p");
            updateExpressions.push("Salt = :s");
            params.ExpressionAttributeValues[':p'] = user.password;
            params.ExpressionAttributeValues[':s'] = user.salt;
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

        if (user.uploadFolderName !== undefined) {
            updateExpressions.push("UploadFolderName = :ufn");
            params.ExpressionAttributeValues[':ufn'] = user.uploadFolderName;
        }

        if (user.verificationCode !== undefined && user.verificationExp !== undefined) {
            updateExpressions.push("verificationCode = :v"),
            updateExpressions.push("verificationExp = :e"),
            params.ExpressionAttributeValues[':v'] = user.verificationCode;
            params.ExpressionAttributeValues[':e'] = String(user.verificationExp.getTime());
        }

        if (user.refreshToken !== undefined) {
            updateExpressions.push("RefreshToken = :t");
            params.ExpressionAttributeValues[':t'] = user.refreshToken;
        }

        if (user.emailVerified === true) {
            updateExpressions.push("EmailVerified = :ev");
            params.ExpressionAttributeValues[':ev'] = user.emailVerified;
        }

        if (updateExpressions.length > 0) {
            params.UpdateExpression = "SET " + updateExpressions.join(", ");
        } else {
            return null;
        }

        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }

        const update = await db.update(params);
        return update.Attributes;
    }

    async deleteUser (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: emailAddress
            }
        };
        return await db.delete(params);
    }
}

module.exports = new User();