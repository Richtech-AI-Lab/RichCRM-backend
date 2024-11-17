const TaskTemplateService = require('../db/task-template/task-template.service');
const TemplateService = require('../db/template/template.service');
const TemplateController = require('./template');
const Types = require('../db/types');

class TaskTemplateController {

    constructor() {
        this.getTaskTemplateByName = this.getTaskTemplateByName.bind(this);
        this.createOrUpdateTaskTemplate = this.createOrUpdateTaskTemplate.bind(this);
        this.createTaskTemplateWithTemplateObjs = this.createTaskTemplateWithTemplateObjs.bind(this);
        this.updateTaskTemplate = this.updateTaskTemplate.bind(this);
        this.deleteTaskTemplate = this.deleteTaskTemplate.bind(this);
    }

    async getTaskTemplateByName(req, res) {
        const { taskName } = req.body;
        try {
            const taskTemplate = await TaskTemplateService.readTaskTemplateByName(taskName);
            if (taskTemplate === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][getTaskTemplateByName] TaskTemplate not found",
                });
            }
            const taskTemplateObj = this.procTaskTamplate(taskTemplate);
            res.status(200).json({
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][getTaskTemplateByName] TaskTemplate found",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][getTaskTemplateByName] Internal Server Error: ${error}`,
            });
        }
    }

    async createOrUpdateTaskTemplate(req, res) {
        const { taskName, taskType, templates } = req.body;
        const taskTemplate = {
            taskName: taskName,
            taskType: taskType,
            templates: templates,
        };
        try {
            if (taskType === undefined || taskType === "" || taskType === null) {
                const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
                if (taskTypeEnum === undefined) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid taskType",
                    });
                }
            }
            if (templates !== undefined || templates.length !== 0) {
                taskTemplate.templates = await TemplateController.validateTemplates(templates);
            }

            // Check if taskTemplate exists, if it does, update it
            const existingTaskTemplate = await TaskTemplateService.readTaskTemplateByName(taskName);
            if (existingTaskTemplate !== null) {
                const data = await TaskTemplateService.updateTaskTemplate(taskTemplate);
                if (data === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not updated",
                    });
                }
                res.status(200).json({
                    status: "success",
                    data: [taskTemplate],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate updated",
                });
            }

            const data = await TaskTemplateService.createTaskTemplate(taskTemplate);
            if (data === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not created",
                });
            }
            const taskTemplateObj = this.procTaskTamplate(data);
            res.status(200).json({
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][createTaskTemplate] TaskTemplate created",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createTaskTemplate] Internal Server Error: ${error}`,
            });
        }
    }

    async createTaskTemplateWithTemplateObjs(req, res) {
        const { taskName, taskType, templateObjs } = req.body;
        try {
            // Create templates
            const templateTitles = [];
            for (let i = 0; i < templateObjs.length; i++) {
                const templateObj = templateObjs[i];
                const template = await TemplateService.createTemplate(templateObj);
                if (template === null) {
                    console.error(`[TaskTemplateController][createTaskTemplateWithTemplateObjs] Template not created: ${templateObj.templateTitle}`);
                }
                templateTitles.push(templateObj.templateTitle);
            };

            const taskTemplate = {
                taskName: taskName,
                taskType: taskType,
                templates: templateTitles,
            };
            
            // Check if taskTemplate exists, if it does, update it
            const existingTaskTemplate = await TaskTemplateService.readTaskTemplateByName(taskName);
            if (existingTaskTemplate !== null) {
                const data = await TaskTemplateService.updateTaskTemplate(taskTemplate);
                if (data === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplateWithTemplateObjs] TaskTemplate not updated",
                    });
                }
                res.status(200).json({
                    status: "success",
                    data: [taskTemplate],
                    message: "[TaskTemplateController][createTaskTemplateWithTemplateObjs] TaskTemplate updated",
                });
                return;
            }

            const data = await TaskTemplateService.createTaskTemplate(taskTemplate);
            if (data === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplateWithTemplateObjs] TaskTemplate not created",
                });
            }
            const taskTemplateObj = this.procTaskTamplate(data);
            res.status(200).json({
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][createTaskTemplateWithTemplateObjs] TaskTemplate created",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createTaskTemplateWithTemplateObjs] Internal Server Error: ${error}`,
            });
        }
    }

                

    async updateTaskTemplate(req, res) {
        const { taskName, taskType, templates } = req.body;
        try {
            const existingTaskTemplate = await TaskTemplateService.readTaskTemplateByName(taskName);
            if (existingTaskTemplate === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][updateTaskTemplate] TaskTemplate not found",
                });
            }
            const taskTemplateObj = {
                taskName: existingTaskTemplate.TaskName,
                taskType: existingTaskTemplate.TaskType,
                templates: existingTaskTemplate.Templates,
            };
            if (taskType !== undefined || taskType !== "" || taskType !== null) {
                const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
                if (taskTypeEnum === undefined) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid taskType",
                    });
                }
                taskTemplateObj.taskType = taskType;
            }

            if (templates !== undefined || templates.length !== 0) {
                taskTemplateObj.templates = await TemplateController.validateTemplates(templates);
            }

            const data = await TaskTemplateService.updateTaskTemplate(taskTemplateObj);
            if (data === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][updateTaskTemplate] TaskTemplate not updated",
                });
            }
            res.status(200).json({
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][updateTaskTemplate] TaskTemplate updated",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][updateTaskTemplate] Internal Server Error: ${error}`,
            });
        }
    }

    async deleteTaskTemplate(req, res) {
        const { taskName } = req.body;
        try {
            const data = await TaskTemplateService.deleteTaskTemplate(taskName);
            if (data === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][deleteTaskTemplate] TaskTemplate not deleted",
                });
            }
            res.status(200).json({
                status: "success",
                data: [],
                message: "[TaskTemplateController][deleteTaskTemplate] TaskTemplate deleted",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][deleteTaskTemplate] Internal Server Error: ${error}`,
            });
        }
    }

    procTaskTamplate(taskTemplate) {
        return {
            taskName: taskTemplate.TaskName,
            taskType: taskTemplate.TaskType,
            templates: taskTemplate.Templates,
        }
    }

}

module.exports = new TaskTemplateController();
