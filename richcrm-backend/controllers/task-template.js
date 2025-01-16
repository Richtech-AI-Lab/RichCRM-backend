const TaskTemplateService = require('../db/task-template/task-template.service');
const TemplateService = require('../db/template/template.service');
const TemplateController = require('./template');
const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class TaskTemplateController {

    constructor() {
        this.getTaskTemplateByTTID = this.getTaskTemplateByTTID.bind(this);
        this.getTaskTemplatesByStage = this.getTaskTemplatesByStage.bind(this);
        this._getTaskTemplatesByStage = this._getTaskTemplatesByStage.bind(this);
        this.createOrUpdateTaskTemplate = this.createOrUpdateTaskTemplate.bind(this);
        this._createOrUpdateTaskTemplate = this._createOrUpdateTaskTemplate.bind(this);
        this.createTaskTemplateWithTemplateObjs = this.createTaskTemplateWithTemplateObjs.bind(this);
        this.deleteTaskTemplate = this.deleteTaskTemplate.bind(this);
        this.createDefaultTaskTemplates = this.createDefaultTaskTemplates.bind(this);
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
            const taskTemplates = await this._getTaskTemplatesByStage(stage, creatorId);
            if (taskTemplates === undefined) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][getTaskTemplatesByStage] TaskTemplates not found",
                });
            }
            res.status(200).json({
                status: "success",
                data: taskTemplates,
                message: "[TaskTemplateController][getTaskTemplatesByStage] TaskTemplates found",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][getTaskTemplatesByStage] Internal Server Error: ${error}`,
            });
        }
    }

    async _getTaskTemplatesByStage(stage, creatorId) {
        try {
            if (stage === undefined || stage === "" || stage === null) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    console.log("[TaskTemplateController][getTaskTemplatesByStage] Invalid stage");
                    return;
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

                return sortedTaskTemplates.map(this.procTaskTamplate);
            } else {
                console.log("[TaskTemplateController][getTaskTemplatesByStage] TaskTemplates is empty");
                return [];
            }
        } catch (error) {
            console.error(error);
            console.log("[TaskTemplateController][getTaskTemplatesByStage] Internal Server Error: ", error);
            return;
        }
    }


    async createOrUpdateTaskTemplate(req, res) {
        const { taskName, stage, prevTtid, nextTtid, creatorId, taskType, templates, isDefault } = req.body;
        const taskTemplate = {
            taskName: taskName,
            stage: stage,
            prevTtid: prevTtid,
            nextTtid: nextTtid,
            creatorId: creatorId,
            taskType: taskType,
            templates: templates,
            isDefault: isDefault,
        };
        try {
            const response = await this._createOrUpdateTaskTemplate(taskTemplate);
            if (response.status === "success") {
                res.status(200).json(response);
            } else {
                res.status(400).json(response);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createOrUpdateTaskTemplate] Internal Server Error: ${error}`,
            });
        }
    }

    async _createOrUpdateTaskTemplate(taskTemplate) {
        const { taskName, stage, prevTtid, nextTtid, creatorId, taskType, templates, isDefault } = taskTemplate;
        try {
            if (stage === undefined || stage === "" || stage === null) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    return {
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid stage",
                    };
                }
            }

            if (taskType === undefined || taskType === "" || taskType === null) {
                const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
                if (taskTypeEnum === undefined) {
                    return {
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Invalid taskType",
                    };
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
                    return {
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] Loop detected in linked list",
                    };
                }

                const data = await TaskTemplateService.updateTaskTemplate(taskTemplate);
                if (data === null) {
                    return {
                        status: "failed",
                        data: [],
                        message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not updated",
                    };
                }

                // Update prev and next task templates
                await this.removeLinkedTaskTemplates(existingTaskTemplates[0].PrevTTID, existingTaskTemplates[0].NextTTID);
                await this.updateLinkedTaskTemplates(prevTtid, nextTtid, taskTemplate.ttid);

                return {
                    status: "success",
                    data: [taskTemplate],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate updated",
                };
            }

            taskTemplate.ttid = uuidv4();

            // Check for loop in linked list
            if (await this.checkForLoop(taskTemplate)) {
                return {
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplate] Loop detected in linked list",
                };
            }

            const data = await TaskTemplateService.createTaskTemplate(taskTemplate);
            if (data === null) {
                return {
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createTaskTemplate] TaskTemplate not created",
                };
            }
            const taskTemplateObj = this.procTaskTamplate(data);

            // Update prev and next task templates
            await this.updateLinkedTaskTemplates(prevTtid, nextTtid, taskTemplate.ttid);

            return {
                status: "success",
                data: [taskTemplateObj],
                message: "[TaskTemplateController][createTaskTemplate] TaskTemplate created",
            };
        } catch (error) {
            console.error(error);
            return {
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createTaskTemplate] Internal Server Error: ${error}`,
            };
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

    async createDefaultTaskTemplates(req, res) {
        const { creatorId } = req.body;

        try {
            const response = await this._createDefaultTaskTemplates(creatorId);
            if (response) {
                res.status(200).json({
                    status: "success",
                    data: [],
                    message: "[TaskTemplateController][createDefaultTaskTemplates] Default TaskTemplates created",
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TaskTemplateController][createDefaultTaskTemplates] Default TaskTemplates not created",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskTemplateController][createDefaultTaskTemplates] Internal Server Error: ${error}`,
            });
        }
    }

    async _createDefaultTaskTemplates(creatorId) {
        try {
            const stages = Types.stage;
            const stageDefaultTaskList = Types.stageDefaultTaskList;
            var stageEnums = Object.keys(stages).sort(function(a, b){
                return stages[a] - stages[b];
            });
            for (let i = 0; i < stageEnums.length; i++) {
                const stageEnum = stageEnums[i];
                const taskList = stageDefaultTaskList[stageEnum];
                let prevTtid = null;
                for (let j = 0; j < taskList.length; j++) {
                    const taskObj = taskList[j];
                    const taskTemplate = {
                        taskName: taskObj.taskName,
                        stage: i,
                        creatorId: creatorId,
                        taskType: taskObj.taskType,
                        isDefault: true,
                        prevTtid: prevTtid,
                        nextTtid: null,
                        templates: taskObj.templates ?? [],
                    };

                    const response = await this._createOrUpdateTaskTemplate(taskTemplate);
                    if (response === null || response.status === "failed") {
                        console.error(`[TaskTemplateController][createDefaultTaskTemplates] TaskTemplate not created: ${taskObj.name}`);
                        console.error(response);
                        prevTtid = null;
                        break;
                    } else {
                        console.log(response.data[0].taskName);
                        prevTtid = response.data[0].ttid;
                    }
                }
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
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
