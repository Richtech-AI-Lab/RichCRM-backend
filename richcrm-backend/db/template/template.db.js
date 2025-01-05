/**
 * Author: Eden Wu
 * Date: 2024-07-13
 * Database Model of Template
 * 
 * @typedef {object} Template
 * @property {string} TemplateTitle - Title of the template
 * @property {string} TemplateContent - Content of the template in sprintf-js format (e.g. 'Hello %(name)s, %(message)s')
 */

const db = require('../dynamodb');

class Template {
    constructor() {
        this.table = 'Template';
    }

    async getTemplateByTitle(templateTitle) {
        const params = {
            TableName: this.table,
            Key: {
                TemplateTitle: templateTitle,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async createTemplate(template) {
        const params = {
            TableName: this.table,
            Item: {
                TemplateTitle: template.templateTitle,
                TemplateContent: template.templateContent,
            },
        };
        console.log(params);
        await db.put(params);
        return params.Item;
    }

    async updateTemplate(template) {
        const params = {
            TableName: this.table,
            Key: {
                TemplateTitle: template.templateTitle,
            },
            UpdateExpression: 'set TemplateContent = :c',
            ExpressionAttributeValues: {
                ':c': template.templateContent,
            },
            ReturnValues: "UPDATED_NEW",
        };
        const data = await db.update(params);

        return data.Attributes;
    }

    async deleteTemplate(templateTitle) {
        const params = {
            TableName: this.table,
            Key: {
                TemplateTitle: templateTitle,
            },
        };
        const data = await db.delete(params);

        return data;
    }
}

module.exports = new Template();