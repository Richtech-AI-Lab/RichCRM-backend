const TaskTemplate = require('./task-template.db');

class TaskTemplateService {
    async readTaskTemplateByTTID(ttid) {
        const data = await TaskTemplate.getTaskTemplateByTTID(ttid);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readTaskTemplateByTaskName(taskName, creatorId) {
        if (taskName === undefined || taskName === "" || creatorId === undefined || creatorId === "") {
            console.log("[TASK-TEMPLATE-Read] taskName and creatorId are required");
            return null;
        }

        const data = await TaskTemplate.getTaskTemplateByTaskNameAndCreatorId(taskName, creatorId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readTaskTemplatesByStage(stage, creatorId) {
        if (stage === undefined || stage === "" || creatorId === undefined || creatorId === "") {
            console.log("[TASK-TEMPLATE-Read] stage and creatorId are required");
            return null;
        }

        const data = await TaskTemplate.getTaskTemplatesByStage(stage, creatorId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readTaskTemplateByPrevTTID(prevTtid) {
        const data = await TaskTemplate.getTaskTemplateByPrevTTID(prevTtid);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readTaskTemplateByNextTTID(nextTtid) {
        const data = await TaskTemplate.getTaskTemplateByNextTTID(nextTtid);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createTaskTemplate(taskTemplate) {
        if (taskTemplate.ttid === undefined ||
            taskTemplate.ttid === "" ||
            taskTemplate.taskName === undefined ||
            taskTemplate.taskName === "" ||
            taskTemplate.stage === undefined ||
            taskTemplate.stage === ""
        ) {
            console.log("[TASK-TEMPLATE-Create] taskName and templates are required");
            return null;
        }
        const data = await TaskTemplate.createTaskTemplate(taskTemplate);
        return data;
    }

    async updateTaskTemplate(taskTemplate) {
        if (taskTemplate.ttid === undefined || taskTemplate.ttid === "" ||
            taskTemplate.taskName === undefined || taskTemplate.taskName === ""
        ) {
            console.log("[TASK-TEMPLATE-Update] taskName is required");
            return null;
        }
        const data = await TaskTemplate.updateTaskTemplate(taskTemplate);

        return data;
    }

    async deleteTaskTemplate(ttid) {
        if (ttid === undefined || ttid === "") {
            console.log("[TASK-TEMPLATE-Delete] taskName is required");
            return null;
        }
        const data = await TaskTemplate.deleteTaskTemplate(ttid);

        return data;
    }
}

module.exports = new TaskTemplateService();