/**
 * Author: Eden Wu
 * Date: 2024-11-10
 * Database Model of Tag
 * 
 * @typedef {object} Tag
 * @property {string} Label - Tag's label
 * @property {string} Color1 - Tag's color1 in hex
 * @property {string} Color2 - Tag's color2 in hex
 * @property {tagType} TagType - Tag's type  
 */

const db = require('../dynamodb');
const { tagType } = require("../types");

class Tag {
    constructor() {
        this.table = 'Tag';
    }

    async getTagByLabel(label) {
        const params = {
            TableName: this.table,
            Key: {
                Label: label,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async getTagByType(tagType) {
        const params = {
            TableName: this.table,
            FilterExpression: 'TagType = :t',
            ExpressionAttributeValues: {
                ':t': tagType,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async getAllTags() {
        const params = {
            TableName: this.table,
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async createTag(tag) {
        const params = {
            TableName: this.table,
            Item: {
                Label: tag.label,
                Color1: tag.color1,
                Color2: tag.color2,
                TagType: tag.tagType,
            },
        };
        const data = await db.put(params).promise();
        return params.Item;
    }

    async updateTag(tag) {
        const params = {
            TableName: this.table,
            Key: {
                Label: tag.label,
            },
            UpdateExpression: '',
            ExpressionAttributeValues: {},
            ReturnValues: 'UPDATED_NEW',
        };

        var updateExpressions = [];
        var expressionAttributeNames = {};
        // Optional fields

        if (tag.color1 !== undefined) {
            params.ExpressionAttributeValues[':c1'] = tag.color1;
            expressionAttributeNames['#c1'] = 'Color1';
            updateExpressions.push('#c1 = :c1');
        }

        if (tag.color2 !== undefined) {
            params.ExpressionAttributeValues[':c2'] = tag.color2;
            expressionAttributeNames['#c2'] = 'Color2';
            updateExpressions.push('#c2 = :c2');
        }

        if (tag.tagType !== undefined) {
            params.ExpressionAttributeValues[':t'] = tag.tagType;
            expressionAttributeNames['#t'] = 'TagType';
            updateExpressions.push('#t = :t');
        }
        if (updateExpressions.length > 0) {
            params.UpdateExpression = "SET " + updateExpressions.join(", ");
        } else {
            return null;
        }
        if (Object.keys(expressionAttributeNames).length > 0) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }
        const data = await db.update(params).promise();
        return data.Attributes;
    }

    async deleteTag(label) {
        const params = {
            TableName: this.table,
            Key: {
                Label: label,
            },
        };
        const data = await db.delete(params).promise();
        return data;
    }
}

module.exports = new Tag();