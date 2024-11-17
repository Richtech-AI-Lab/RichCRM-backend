const TaskTemplate = require('./task-template.db');

class TaskTemplateService {
    async readTaskTemplateByName(taskName) {
        const data = await TaskTemplate.getTaskTemplateByName(taskName);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async createTaskTemplate(taskTemplate) {
        if (taskTemplate.taskName === undefined ||
            taskTemplate.taskName === ""
        ) {
            console.log("[TASK-TEMPLATE-Create] taskName and templates are required");
            return null;
        }
        const data = await TaskTemplate.createTaskTemplate(taskTemplate);
        return data;
    }

    async updateTaskTemplate(taskTemplate) {
        if (taskTemplate.taskName === undefined ||
            taskTemplate.taskName === ""
        ) {
            console.log("[TASK-TEMPLATE-Update] taskName is required");
            return null;
        }
        const data = await TaskTemplate.updateTaskTemplate(taskTemplate);

        return data;
    }

    async deleteTaskTemplate(taskName) {
        if (taskName === undefined || taskName === "") {
            console.log("[TASK-TEMPLATE-Delete] taskName is required");
            return null;
        }
        const data = await TaskTemplate.deleteTaskTemplate(taskName);

        return data;
    }
}

module.exports = new TaskTemplateService();