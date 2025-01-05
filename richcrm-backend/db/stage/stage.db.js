/**
 * Author: Eden Wu
 * Date: 2024-07-13
 * Database Model of Stage
 * 
 * @typedef {object} Stage
 * @property {UUID} StageId - Stage ID
 * @property {stage} StageType - Type of stage (0-SETUP, 1-CONTRACT_PREPARING, 2-CONTRACT_SIGNING, 3-MORTGAGE, 4-CLOSING)
 * @property {UUID} CaseId - Foreign key to Case
 * @property {[UUID]} Tasks - List of foreign key to Task
 * @property {UUID} stageStatus - Status of stage (0-WAITING, 1-FINISHED, 2-WARNING)
 */

const db = require('../dynamodb');
const { stage } = require('../types');

class Stage {
    constructor() {
        this.table = 'Stage';
    }

    async getStageById(stageId) {
        const params = {
            TableName: this.table,
            Key: {
                StageId: stageId,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async getStagesByCaseId(caseId) {
        const params = {
            TableName: this.table,
            FilterExpression: "CaseId = :c",
            ExpressionAttributeValues: {
                ":c": caseId,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getStagesByCaseIdAndStageType(caseId, stageType) {
        const params = {
            TableName: this.table,
            FilterExpression: "CaseId = :c AND StageType = :s",
            ExpressionAttributeValues: {
                ":c": caseId,
                ":s": stageType,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async createStage(stage) {
        const params = {
            TableName: this.table,
            Item: {
                StageId: stage.stageId,
                StageType: stage.stageType,
                CaseId: stage.caseId,
                Tasks: stage.tasks,
                StageStatus: stage.stageStatus,
            },
        };
        await db.put(params);
        return params.Item;
    }

    async updateStage(stage) {
        const params = {
            TableName: this.table,
            Key: {
                StageId: stage.stageId,
            },
            UpdateExpression: 'set #s = :s',
            ExpressionAttributeNames: {
                '#s': 'StageStatus',
            },
            ExpressionAttributeValues: {
                ':s': stage.stageStatus,
            },
            ReturnValues: "UPDATED_NEW",
        };

        // Optional fields
        if (stage.tasks !== undefined) {
            params.ExpressionAttributeValues[':ts'] = stage.tasks;
            params.UpdateExpression += ', Tasks = :ts';
        }
        const data = await db.update(params);
        
        return data.Attributes;
    }

    async deleteStage(stageId) {
        const params = {
            TableName: this.table,
            Key: {
                StageId: stageId,
            },
        };
        await db.delete(params);
    }
}

module.exports = new Stage();