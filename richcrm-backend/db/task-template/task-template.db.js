/**
 * Author: Eden Wu
 * Date: 2024-11-16
 * Database Model of Task Template
 * 
 * 
 * @typedef {object} TaskTemplate
 * @property {string} TaskName - Task name of the template used for
 * @property {taskType} TaskType - Type of task (0-ACTION, 1-CONTACT, 2-UPLOAD)
 * @property {[string]} Templates - Foreign key to Email Templates Titles
 * 
 */

const db = require('../dynamodb');
const { taskType } = require('../types');


class TaskTemplate {
    constructor() {
        this.table = 'TaskTemplate';
    }

    async getTaskTemplateByName(taskName) {
        console.log(taskName);
        const params = {
            TableName: this.table,
            Key: {
                TaskName: taskName,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async createTaskTemplate(taskTemplate) {
        console.log(taskTemplate);
        const params = {
            TableName: this.table,
            Item: {
                TaskName: taskTemplate.taskName,
                TaskType: taskTemplate.taskType,
                Templates: taskTemplate.templates,
            },
        };
        const data = await db.put(params).promise();
        return params.Item;
    }

    async updateTaskTemplate(taskTemplate) {
        const params = {
            TableName: this.table,
            Key: {
                TaskName: taskTemplate.taskName,
            },
            UpdateExpression: '',
            ExpressionAttributeValues: {},
            ReturnValues: 'UPDATED_NEW',
        };

        var updateExpressions = [];
        var expressionAttributeNames = {};

        // Optional fields
        if (taskTemplate.taskType) {
            updateExpressions.push('TaskType = :t');
            params.ExpressionAttributeValues[':t'] = taskTemplate.taskType;
        }

        if (taskTemplate.templates) {
            updateExpressions.push('Templates = :ts');
            params.ExpressionAttributeValues[':ts'] = taskTemplate.templates;
        }

        if (updateExpressions.length > 0) {
            params.UpdateExpression = 'SET ' + updateExpressions.join(', ');
        } else {
            return null;
        }
        console.log(params);
        const data = await db.update(params).promise();
        return data?.Attributes;
    }

    async deleteTaskTemplate(taskName) {
        const params = {
            TableName: this.table,
            Key: {
                TaskName: taskName,
            },
        };
        const data = await db.delete(params).promise();
        return data;
    }
}

module.exports = new TaskTemplate();