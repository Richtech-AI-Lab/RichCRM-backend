const TaskService = require('../db/task/task.service');
const StageService = require('../db/stage/stage.service');
const TemplateController = require('./template');
const TaskTemplateService = require('../db/task-template/task-template.service');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class TaskController {
    async readTaskById(req, res) {
        const { taskId } = req.params;
        try {
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][readTaskById] Task not found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: task.TaskId,
                    stageId: task.StageId,
                    taskType: task.TaskType,
                    name: task.Name,
                    status: task.Status,
                    templates: task.Templates,
                    fileURL: task.FileURL,
                    ttid: task.TTID,
                }],
                message: '[TaskController][readTaskById] Task found'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][readTaskById] Internal server error: ${error}`
            });
        }
    }

    async createTask(req, res) {
        const emailAddress = req.user.EmailAddress;
        const { taskType, stageId, name, status, templates, fileURL, ttid } = req.body;
        try {
            // Check if the taskType is valid
            const taskTypeEnum = Types.castIntToEnum(Types.taskType, taskType);
            if (taskTypeEnum === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][createTask] Invalid taskType'
                });
            }

            // Check if the stageId is valid
            if (stageId === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: `[TaskController][createTask] Invalid stageId: ${stageId}`
                });
            }

            // Check if the status is valid
            const statusEnum = Types.castIntToEnum(Types.status, status);
            if (statusEnum === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][createTask] Invalid status'
                });
            }

            // Check if the templates exist
            const templateTitles = await TemplateController.validateTemplates(templates);

            const taskId = uuidv4();
            const taskObj = {
                taskId: taskId,
                stageId: stageId,
                taskType: taskType,
                name: name,
                status: status,
                templates: templateTitles,
                fileURL: fileURL,
                ttid: ttid,
            };

            // Check if TTID is valid
            if (ttid !== undefined) {
                const taskTemplate = await TaskTemplateService.readTaskTemplateByTTID(ttid);
                if (taskTemplate === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: `[TaskController][createTask] Task Template not found for ttid: ${ttid}`
                    });
                }
            } else {
                const taskTemplates = await TaskTemplateService.readTaskTemplateByTaskName(name, emailAddress);
                if (taskTemplates && taskTemplates.length > 0) {
                    taskObj.ttid = taskTemplates[0].TTID;
                } else {
                    console.log(`[TaskController][createTask] Task Template not found for taskName: ${name}`);
                }
            }

            const data = await TaskService.createTask(taskObj);
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: data.TaskId,
                    stageId: data.StageId,
                    taskType: data.TaskType,
                    name: data.Name,
                    status: data.Status,
                    templates: data.Templates,
                    fileURL: data.FileURL,
                    ttid: data.TTID,
                }],
                message: '[TaskController][createTask] Task created'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][createTask] Internal server error: ${error}`
            });
        }
    }

    async updateTask(req, res) {
        const { taskId, name, status, templates, fileURL } = req.body;
        try {
            // Check if the taskId is valid
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][updateTask] Task not found'
                });
            }

            var taskObj = {
                taskId: taskId,
                stageId: task.StageId,
                taskType: task.TaskType,
                name: task.Name,
                status: task.Status,
                templates: task.Templates,
                fileURL: task.FileURL,
                ttid: task.TTID,
            };

            // Check if the status is valid
            if (status !== undefined) {
                const statusEnum = Types.castIntToEnum(Types.status, status);
                if (statusEnum === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[TaskController][updateTask] Invalid status'
                    });
                }

                taskObj.status = status;

                // Update stage in case of status change
                // const stage = await StageService.getStageById(task.StageId);
                // if (stage === null) {
                //     console.log(`[TaskController][updateTask] Stage not found for taskId: ${taskId}`);
                // } else {
                //     const stage = await StageService.updateStage({
                //         stageId: task.StageId,
                //         stageStatus: status,
                //     });
                //     if (stage === null) {
                //         console.log(`[TaskController][updateTask] Stage not updated for taskId: ${taskId}`);
                //     }
                // }
            }

            if (name !== undefined) {
                taskObj.name = name;
            }

            if (templates !== undefined) {
                taskObj.templates = await TemplateController.validateTemplates(templates);
            }
            
            if (fileURL !== undefined) {
                taskObj.fileURL = fileURL;
            }

            const data = await TaskService.updateTask(taskObj);
            return res.status(200).json({
                status: "success",
                data: [{
                    taskId: taskObj.taskId,
                    stageId: taskObj.stageId,
                    taskType: taskObj.taskType,
                    name: taskObj.name,
                    status: taskObj.status,
                    templates: data.Templates,
                    fileURL: data.FileURL,
                    ttid: data.TTID,
                }],
                message: '[TaskController][updateTask] Task updated'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][updateTask] Internal server error: ${error}`
            });
        }
    }

    async deleteTask(req, res) {
        const { taskId } = req.body;
        try {
            const task = await TaskService.getTaskById(taskId);
            if (task === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][deleteTask] Task not found'
                });
            }
            const t = await TaskService.deleteTask(taskId);
            if (t !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[TaskController][deleteTask] Task deleted'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TaskController][deleteTask] Task not deleted successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TaskController][deleteTask] Internal server error: ${error}`
            });
        }
    }
}

module.exports = new TaskController();