const StageService = require('../db/stage/stage.service');
const CaseService = require('../db/case/case.service');
const TaskService = require('../db/task/task.service');
const TaskTemplateController = require('./task-template');
const TemplateController = require('./template');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class StageController {

    constructor () {
        this.createStage = this.createStage.bind(this);
        this.updateStage = this.updateStage.bind(this);
        this.deleteStage = this.deleteStage.bind(this);
        this.deleteAllStagesInCase = this.deleteAllStagesInCase.bind(this);
    }

    async readStageById(req, res) {
        const { stageId } = req.params;
        try {
            const stage = await StageService.getStageById(stageId);
            if (stage === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][readStageById] Stage not found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    stageId: stage.StageId,
                    stageType: stage.StageType,
                    caseId: stage.CaseId,
                    tasks: stage.Tasks,
                    stageStatus: stage.StageStatus
                }],
                message: '[StageController][readStageById] Stage found'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][readStageById] Internal server error: ${error}`
            });
        }
    }

    async readStageByCaseIdAndStageType(req, res) {
        const { caseId } = req.params;
        const stageType = parseInt(req.params.stageType);
        try {
            const stages = await StageService.getStagesByCaseIdAndStageType(caseId, stageType);
            if (stages === null || stages.length == 0) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][readStageByCaseIdAndStageType] No stages found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    stageId: stages[0].StageId,
                    stageType: stages[0].StageType,
                    caseId: stages[0].CaseId,
                    tasks: stages[0].Tasks,
                    stageStatus: stages[0].StageStatus
                }],
                message: '[StageController][readStageByCaseIdAndStageType] Stages found'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][readStageByCaseIdAndStageType] Internal server error: ${error}`
            });
        }
    }

   
    async createStageByCaseIdAndStageType(caseId, stageType, creatorId) {
        
        try {
            // Check if the caseId is valid
            const caseObj = await CaseService.readCase(caseId);
            if (caseObj === null) {
                return {
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] CaseId not found'
                };
            }

            // Check if the stageType is valid
            const stageTypeEnum = Types.castIntToEnum(Types.stage, stageType);
            if (stageTypeEnum === null) {
                return {
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] Invalid stageType'
                };
            }

            // Check if the stage already exists
            const stages = await StageService.getStagesByCaseIdAndStageType(caseId, stageType);
            if (stages !== null && stages.length > 0) {
                return {
                    status: "success",
                    data: [{
                        stageId: stages[0].StageId,
                        stageType: stages[0].StageType,
                        caseId: stages[0].CaseId,
                        tasks: stages[0].Tasks,
                        stageStatus: stages[0].StageStatus
                    }],
                    message: `[StageController][createStage] Stage already exists. CaseId: ${caseId}. StageType: ${stageTypeEnum}`
                };
            }

            

            const stageId = uuidv4();
            // IMPORTANT: Generate new tasks for this stage
            var tasks = [];
            let taskTemplates = await TaskTemplateController._getTaskTemplatesByStage(stageType, creatorId);
            // const taskConfigs = Types.stageDefaultTaskList[stageTypeEnum]
            if (!taskTemplates || taskTemplates.length == 0) {
                taskTemplates = Types.stageDefaultTaskList[stageTypeEnum];
            }
                
            for (let i = 0; i < taskTemplates.length; i++) {
                const taskId = uuidv4();

                // Check TaskTemplate exist
                const taskConfig = taskTemplates[i];

                // Check if the templates exists
                const templateTitles = await TemplateController.validateTemplates(taskConfig.Templates);

                const taskObj = {
                    taskId: taskId,
                    stageId: stageId,
                    taskType: taskConfig.taskType,
                    name: taskConfig.taskName,
                    status: 0,
                    templates: templateTitles,
                    ttid: taskConfig.ttid,
                };

                console.log("---------------", taskObj);
                const t = await TaskService.createTask(taskObj);
                tasks.push(t.TaskId);
            }

            const stage = {
                stageId: stageId,
                stageType: stageType,
                caseId: caseId,
                tasks: tasks,
                stageStatus: Types.status.NOT_STARTED,
            };

            const s = await StageService.createStage(stage);
            if (s !== null) {
                return {
                    status: "success",
                    data: [{
                        stageId: s.StageId,
                        stageType: s.StageType,
                        caseId: s.CaseId,
                        tasks: s.Tasks,
                        stageStatus: s.StageStatus
                    }],
                    message: '[StageController][createStage] Stage created'
                };
            } else {
                return {
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] Stage not created'
                };
            }
        } catch (error) {
            return {
                status: "failed",
                data: [],
                message: `[StageController][createStage] Internal server error: ${error}`
            };
        }
    }

    async createStage(req, res) {
        const emailAddress = req.user.EmailAddress;
        const { caseId, stageType } = req.body;

        const ret = await this.createStageByCaseIdAndStageType(caseId, stageType, emailAddress);
        if (ret.status === "success") {
            return res.status(200).json(ret);
        } else {
            return res.status(400).json(ret);
        };
    }

    async updateStage(req, res) {
        const { stageId, stageStatus, tasks } = req.body;

        try {
            // Check if the stageId is valid
            const stage = await StageService.getStageById(stageId);
            if (stage === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][updateStage] Stage not found'
                });
            }

            var stageObj = {
                stageId: stageId,
                stageType: stage.StageType,
                caseId: stage.CaseId,
                tasks: stage.Tasks,
                stageStatus: stage.StageStatus
            };

            // Check if the stageStatus is valid
            if (stageStatus !== undefined && stageStatus !== null) {
                const stageStatusEnum = Types.castIntToEnum(Types.status, stageStatus);
                if (stageStatusEnum === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[StageController][updateStage] Invalid stageStatus'
                    });
                }

                stageObj.stageStatus = stageStatus;
            }

            // Check if tasks are the same
            if (stageObj.tasks === undefined) {
                stageObj.tasks = [];
            }
            
            if (tasks !== undefined) {
                stageObj.tasks = await this.updateTaskList(tasks);
            }

            const s = await StageService.updateStage(stageObj);
            if (s !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [stageObj],
                    message: '[StageController][updateStage] Stage updated'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][updateStage] Stage not updated'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][updateStage] Internal server error: ${error}`
            });
        }
    }

    async deleteStage(req, res) {
        const { stageId } = req.body;
        try {
            const stage = await StageService.getStageById(stageId);
            if (stage === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][deleteStage] Stage not found'
                });
            }

            const tasks = stage.Tasks;
            for (let i = 0; i < tasks.length; i++) {
                const t = await TaskService.deleteTask(tasks[i]);
                if (t === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[StageController][deleteStage] Task not deleted'
                    });
                }
            }

            const s = await StageService.deleteStage(stageId);
            if (s !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[StageController][deleteStage] Stage deleted'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][deleteStage] Stage not deleted'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][deleteStage] Internal server error: ${error}`
            });
        }
    }

    async deleteAllStagesInCase(req, res) {
        const { caseId } = req.body;

        const ret = await this.deleteStagesByCaseId(caseId);
        if (ret.status === "success") {
            return res.status(200).json(ret);
        } else {
            return res.status(400).json(ret);
        };
    }

    async deleteStagesByCaseId(caseId) {
        try {
            const stages = await StageService.getStagesByCaseId(caseId);
            if (stages !== null) {
                for (let i = 0; i < stages.length; i++) {
                    const tasks = stages[i].Tasks;
                    for (let i = 0; i < tasks.length; i++) {
                        const t = await TaskService.deleteTask(tasks[i]);
                        if (t === null) {
                            console.log(`[StageController][deleteStagesByCaseId] Task not deleted. TaskId: ${tasks[i]}`);
                            continue;
                        }
                    }
                    const s = await StageService.deleteStage(stages[i].StageId);
                    if (s === null) {
                        console.log(`[StageController][deleteStagesByCaseId] Stage not deleted. StageId: ${stages[i].StageId}`);
                        continue;
                    }
                }
            }
            return {
                status: "success",
                data: [],
                message: '[StageController][deleteStagesByCaseId] Stages deleted'
            };
        } catch (error) {
            return {
                status: "failed",
                data: [],
                message: `[StageController][deleteStagesByCaseId] Internal server error: ${error}`
            };
        }
    }

    // Update new task to task list
    async updateTaskList(newTasks) {
        var newTaskList = [];
        for (let i = 0; i < newTasks.length; i++) {
            const newTask = newTasks[i];
            const task = await TaskService.getTaskById(newTask);
            if (task === null) {
                continue;
            }
            newTaskList.push(newTask);
        }
        return newTaskList
    }
}

module.exports = new StageController();