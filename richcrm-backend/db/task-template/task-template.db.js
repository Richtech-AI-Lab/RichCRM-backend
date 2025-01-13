/**
 * Author: Eden Wu
 * Date: 2024-11-16
 * Database Model of Task Template (Linked List)
 * 
 * 
 * @typedef {object} TaskTemplate
 * @property {uuid} TTID - Task Template ID
 * @property {string} TaskName - Task name of the template used for
 * @property {stage} Stage - Stage enum of the task belongs to
 * @property {uuid} PrevTTID - Previous Task Template ID (first task to be null)
 * @property {uuid} NextTTID - Next Task Template ID (last task to be null)
 * @property {boolean} IsDefault - Default task template for the stage
 * @property {string} CreatorId - CreatorId of the task template
 * @property {taskType} TaskType - Type of task (0-ACTION, 1-CONTACT, 2-UPLOAD)
 * @property {[string]} Templates - Foreign key to Email Templates Titles
 * 
 */

const db = require('../dynamodb');
const { taskType, stage } = require('../types');


class TaskTemplate {
    constructor() {
        this.table = 'TaskTemplate';
    }

    async getTaskTemplateByTTID(ttid) {
        console.log(ttid);
        const params = {
            TableName: this.table,
            Key: {
                TTID: ttid,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async getTaskTemplateByTaskNameAndCreatorId(taskName, creatorId) {
        const params = {
            TableName: this.table,
            FilterExpression: 'TaskName = :n AND CreatorId = :c',
            ExpressionAttributeValues: {
                ':n': taskName,
                ':c': creatorId,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getTaskTemplatesByStage(stage, creatorId) {
        const params = {
            TableName: this.table,
            FilterExpression: 'Stage = :s AND CreatorId = :c',
            ExpressionAttributeValues: {
                ':s': stage,
                ':c': creatorId,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getTaskTemplateByPrevTTID(prevTtid) {
        const params = {
            TableName: this.table,
            FilterExpression: 'PrevTTID = :p',
            ExpressionAttributeValues: {
                ':p': prevTtid,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getTaskTemplateByNextTTID(nextTtid) {
        const params = {
            TableName: this.table,
            FilterExpression: 'NextTTID = :n',
            ExpressionAttributeValues: {
                ':n': nextTtid,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async createTaskTemplate(taskTemplate) {
        const params = {
            TableName: this.table,
            Item: {
                TTID: taskTemplate.ttid,
                TaskName: taskTemplate.taskName,
                Stage: taskTemplate.stage,
                PrevTTID: taskTemplate.prevTtid,
                NextTTID: taskTemplate.nextTtid,
                IsDefault: taskTemplate.isDefault,
                CreatorId: taskTemplate.creatorId,
                TaskType: taskTemplate.taskType,
                Templates: taskTemplate.templates,
            },
        };
        const data = await db.put(params);
        return params.Item;
    }

    async updateTaskTemplate(taskTemplate) {
        const params = {
            TableName: this.table,
            Key: {
                TTID: taskTemplate.ttid,
            },
            UpdateExpression: '',
            ExpressionAttributeValues: {},
            ReturnValues: 'UPDATED_NEW',
        };

        var updateExpressions = [];

        // Optional fields
        if (taskTemplate.taskName) {
            updateExpressions.push('TaskName = :n');
            params.ExpressionAttributeValues[':n'] = taskTemplate.taskName;
        }

        if (taskTemplate.stage) {
            updateExpressions.push('Stage = :s');
            params.ExpressionAttributeValues[':s'] = taskTemplate.stage;
        }

        updateExpressions.push('PrevTTID = :p');
        params.ExpressionAttributeValues[':p'] = taskTemplate.prevTtid;

        updateExpressions.push('NextTTID = :nt');
        params.ExpressionAttributeValues[':nt'] = taskTemplate.nextTtid;

        if (taskTemplate.isDefault) {
            updateExpressions.push('IsDefault = :d');
            params.ExpressionAttributeValues[':d'] = taskTemplate.isDefault;
        }

        if (taskTemplate.creatorId) {
            updateExpressions.push('CreatorId = :c');
            params.ExpressionAttributeValues[':c'] = taskTemplate.creatorId;
        }

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

        const data = await db.update(params);
        return data?.Attributes;
    }

    async deleteTaskTemplate(ttid) {
        const params = {
            TableName: this.table,
            Key: {
                TTID: ttid,
            },
        };
        const data = await db.delete(params);
        return data;
    }
}

module.exports = new TaskTemplate();