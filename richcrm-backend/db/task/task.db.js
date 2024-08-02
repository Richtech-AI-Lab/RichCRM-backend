/**
 * Author: Eden Wu
 * Date: 2024-07-13
 * Database Model of Task
 * 
 * @typedef {object} Task
 * @property {UUID} TaskId - Task ID
 * @property {taskType} TaskType - Type of task (0-ACTION, 1-CONTACT, 2-UPLOAD)
 * @property {string} Name - Task name
 * @property {status} Status - Status of task (0-NOT_STARTED, 1-PENDING, 2-FINISHED, 3-OVERDUE)
 * @property {[UUID]} Templates - Foreign key to Email Template
 * @property {string} FileURL - URL of the uploaded file
 */

const db = require('../dynamodb');
const { taskType, status } = require('../types');

class Task {
    constructor() {
        this.table = 'Task';
    }

    async getTaskById(taskId) {
        const params = {
            TableName: this.table,
            Key: {
                TaskId: taskId,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async createTask(task) {
        const params = {
            TableName: this.table,
            Item: {
                TaskId: task.taskId,
                TaskType: task.taskType,
                Name: task.name,
                Status: task.status,
                Templates: task.templates,
                FileURL: task.fileURL,
            },
        };
        console.log(params);
        await db.put(params).promise();
        return params.Item;
    }

    async updateTask(task) {
        const params = {
            TableName: this.table,
            Key: {
                TaskId: task.taskId,
            },
            UpdateExpression: 'set #n = :n, #s = :s, TaskType = :t',
            ExpressionAttributeNames: {
                '#n': 'Name',
                '#s': 'Status',
            },
            ExpressionAttributeValues: {
                ':n': task.name,
                ':t': task.taskType,
                ':s': task.status,
            },
            ReturnValues: "UPDATED_NEW",
        };

        // Optional fields
        if (task.templates !== undefined)  { 
            params.ExpressionAttributeValues[':ts'] = task.templates;
            params.UpdateExpression  += ", Templates = :ts"; 
        }

        if (task.fileURL !== undefined)  {
            params.ExpressionAttributeValues[':f'] = task.fileURL;
            params.UpdateExpression  += ", FileURL = :f";
        }
        
        const data = await db.update(params).promise();

        return data.Attributes;
    }

    async deleteTask(taskId) {
        const params = {
            TableName: this.table,
            Key: {
                TaskId: taskId,
            },
        };
        await db.delete(params).promise();
    }
}

module.exports = new Task();