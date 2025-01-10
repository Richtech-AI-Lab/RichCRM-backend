const TaskTemplateService = require('../db/task-template/task-template.service');
const TemplateService = require('../db/template/template.service');
const TemplateController = require('./template');
const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class TaskTemplateController {

    constructor() {
        this.getTaskTemplateByTTID = this.getTaskTemplateByTTID.bind(this);
        this.getTaskTemplatesByStage = this.getTaskTemplatesByStage.bind(this);
        this.createOrUpdateTaskTemplate = this.createOrUpdateTaskTemplate.bind(this);
        this.createTaskTemplateWithTemplateObjs = this.createTaskTemplateWithTemplateObjs.bind(this);
        this.deleteTaskTemplate = this.deleteTaskTemplate.bind(this);
        this.updateLinkedTaskTemplates = this.updateLinkedTaskTemplates.bind(this);
        this.removeLinkedTaskTemplates = this.removeLinkedTaskTemplates.bind(this);
    }

    async getTaskTemplateByTTID(req, res) {
        const { ttid } = req.body;
        try {
            const taskTemplate = await TaskTemplateService.readTaskTemplateByTTID(ttid);
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

    async getTaskTemplatesByStage(req, res) {
        const { stage, creatorId } = req.body;

        try {
            if (stage === undefined || stage === "" || stage === null) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][getTaskTemplatesByStage] Invalid stage",
                    });
                }
            }
            const taskTemplates = await TaskTemplateService.readTaskTemplatesByStage(stage, creatorId);
            if (taskTemplates !== null && taskTemplates.length > 0) {
                const sortedTaskTemplates = [];
                let currentTaskTemplate = null;
                if (taskTemplates.filter(template => !template.PrevTTID).length > 1) {
                    currentTaskTemplate = taskTemplates.find(template => !template.PrevTTID && !template.IsDefault);
                } else {
                    currentTaskTemplate = taskTemplates.find(template => !template.PrevTTID);
                }

                while (currentTaskTemplate) {
                    // console.log("Current Task Template: ", currentTaskTemplate);
                    sortedTaskTemplates.push(currentTaskTemplate);
                    currentTaskTemplate = taskTemplates.find(template => template.TTID === currentTaskTemplate.NextTTID);
                }

                res.status(200).json({
                    status: "success",
                    data: sortedTaskTemplates.map(this.procTaskTamplate),
                    message: "[TaskTemplateController][readTaskTemplateByTaskNameAndCreatorId] TaskTemplates found",
                });
            } else {
                res.status(400).json({
                    status: "success",
                    data: [],
                    message: "[TaskTemplateController][readTaskTemplateByTaskNameAndCreatorId] TaskTemplates is empty",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][readTaskTemplateByTaskNameAndCreatorId] Internal Server Error: ${error}`,
            });
        }
    }

    async createOrUpdateTaskTemplate(req, res) {
        const { taskName, stage, prevTtid, nextTtid, creatorId, taskType, templates, isDefault } = req.body;
        try {
            if (stage === undefined || stage === "" || stage === null) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid stage",
                    });
                }
            }

            if (taskType === undefined || taskType === "" || taskType === null) {
                const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
                if (taskTypeEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid taskType",
                    });
                }
            }

            const taskTemplate = {
                taskName: taskName,
                stage: stage,
                prevTtid: prevTtid ?? null,
                nextTtid: nextTtid ?? null,
                creatorId: creatorId,
                taskType: taskType,
                templates: templates,
                isDefault: isDefault ?? false,
            };

            if (taskType === Types.taskType.CONTACT && templates) {
                taskTemplate.templates = await TemplateController.validateTemplates(templates);
            }

            // Check if taskTemplate exists, if it does, update it
            const existingTaskTemplates = await TaskTemplateService.readTaskTemplateByTaskName(taskName, creatorId);
            if (existingTaskTemplates !== null && existingTaskTemplates.length > 0) {
                taskTemplate.ttid = existingTaskTemplates[0].TTID;

                // Check for loop in linked list is introduced
                if (await this.checkForLoop(taskTemplate, true)) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Loop detected in linked list",
                    });
                }

                const data = await TaskTemplateService.updateTaskTemplate(taskTemplate);
                if (data === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not updated",
                    });
                }

                // Update prev and next task templates
                await this.removeLinkedTaskTemplates(existingTaskTemplates[0].PrevTTID, existingTaskTemplates[0].NextTTID);
                await this.updateLinkedTaskTemplates(prevTtid, nextTtid, taskTemplate.ttid);

                return res.status(200).json({
                    status: "success",
                    data: [taskTemplate],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate updated",
                });
            }

            taskTemplate.ttid = uuidv4();

            // Check for loop in linked list
            if (await this.checkForLoop(taskTemplate)) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplate] Loop detected in linked list",
                });
            }

            const data = await TaskTemplateService.createTaskTemplate(taskTemplate);
            if (data === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not created",
                });
            }
            const taskTemplateObj = this.procTaskTamplate(data);

            // Update prev and next task templates
            await this.updateLinkedTaskTemplates(prevTtid, nextTtid, taskTemplate.ttid);

            return res.status(200).json({
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][createTaskTemplate] TaskTemplate created",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createTaskTemplate] Internal Server Error: ${error}`,
            });
        }
    }

    async checkForLoop(taskTemplate, isUpdate = false) {
        const { ttid, prevTtid, nextTtid, stage, creatorId } = taskTemplate;
        const taskTemplateObj = {
            TTID: ttid,
            TaskName: taskTemplate.taskName,
            Stage: stage,
            PrevTTID: prevTtid,
            NextTTID: nextTtid
        };

        try {
            let taskTemplates = await TaskTemplateService.readTaskTemplatesByStage(stage, creatorId);

            if (isUpdate) {
                const existingTaskTemplate = taskTemplates.find(template => template.TTID === ttid);
                if (existingTaskTemplate === null) {
                    console.error(`[TaskTemplateController][checkForLoop] TaskTemplate not found: ${ttid}`);
                    return true;
                }
                taskTemplates = taskTemplates.map(template => {
                    if (template.TTID === existingTaskTemplate.PrevTTID) {
                        return { ...template, NextTTID: existingTaskTemplate.NextTTID };
                    } else if (template.TTID === existingTaskTemplate.NextTTID) {
                        return { ...template, PrevTTID: existingTaskTemplate.PrevTTID };
                    }
                    return template;
                });
            }
            taskTemplates = taskTemplates.map(template => {
                if (template.TTID === prevTtid) {
                    return { ...template, NextTTID: ttid };
                } else if (template.TTID === nextTtid) {
                    return { ...template, PrevTTID: ttid };
                } else if (template.TTID === ttid) {
                    return taskTemplateObj;
                }
                return template;
            });

            if (!isUpdate) {
                taskTemplates.push(taskTemplateObj);
            }

            let slow = taskTemplateObj;
            let fast = taskTemplateObj;

            while (fast && fast.NextTTID) {
                slow = taskTemplates.find(template => template.TTID === slow.NextTTID);
                fast = taskTemplates.find(template => template.TTID === fast.NextTTID);
                if (fast) {
                    fast = taskTemplates.find(template => template.TTID === fast.NextTTID);
                }
                if (slow && fast && slow.TTID === fast.TTID) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error(error);
            return true;
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

    async deleteTaskTemplate(req, res) {
        const { ttid } = req.body;
        try {
            const taskTemplate = await TaskTemplateService.readTaskTemplateByTTID(ttid);
            if (taskTemplate !== null) {
                await this.removeLinkedTaskTemplates(taskTemplate.PrevTTID ?? null, taskTemplate.NextTTID ?? null);
            }

            const data = await TaskTemplateService.deleteTaskTemplate(ttid);
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
            ttid: taskTemplate.TTID,
            taskName: taskTemplate.TaskName,
            stage: taskTemplate.Stage,
            prevTtid: taskTemplate.PrevTTID,
            nextTtid: taskTemplate.NextTTID,
            creatorId: taskTemplate.CreatorId,
            taskType: taskTemplate.TaskType,
            templates: taskTemplate.Templates,
            isDefault: taskTemplate.IsDefault,
        }
    }

    async updateLinkedTaskTemplates(prevTtid, nextTtid, currentTtid) {
        if (prevTtid) {
            const prevTaskTemplate = await TaskTemplateService.readTaskTemplateByTTID(prevTtid);
            if (prevTaskTemplate) {
                const prevTaskObj = this.procTaskTamplate(prevTaskTemplate);
                prevTaskObj.nextTtid = currentTtid;
                await TaskTemplateService.updateTaskTemplate(prevTaskObj);
            }
        }
        if (nextTtid) {
            const nextTaskTemplate = await TaskTemplateService.readTaskTemplateByTTID(nextTtid);
            if (nextTaskTemplate) {
                const nextTaskObj = this.procTaskTamplate(nextTaskTemplate);
                nextTaskObj.prevTtid = currentTtid;
                await TaskTemplateService.updateTaskTemplate(nextTaskObj);
            }
        }
    }

    async removeLinkedTaskTemplates(prevTtid, nextTtid) {
        console.log("Removing linked task templates: ", prevTtid, nextTtid);
        if (prevTtid) {
            const prevTaskTemplate = await TaskTemplateService.readTaskTemplateByTTID(prevTtid);
            if (prevTaskTemplate) {
                const prevTaskObj = this.procTaskTamplate(prevTaskTemplate);
                prevTaskObj.nextTtid = nextTtid;
                await TaskTemplateService.updateTaskTemplate(prevTaskObj);
            }
        }
        if (nextTtid) {
            const nextTaskTemplate = await TaskTemplateService.readTaskTemplateByTTID(nextTtid);
            if (nextTaskTemplate) {
                const nextTaskObj = this.procTaskTamplate(nextTaskTemplate);
                nextTaskObj.prevTtid = prevTtid;
                await TaskTemplateService.updateTaskTemplate(nextTaskObj);
            }
        }
    }



}

module.exports = new TaskTemplateController();
