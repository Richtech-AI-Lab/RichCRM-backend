var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var TaskTemplateController = require('../../controllers/task-template');

const router = express.Router();


/**
 * @api {post} v1/task-template/read/stage Read a task template by stage
 * @apiName ReadTaskTemplateByStage
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} stage Stage.
 * @apiBody {String} creatorId Creator ID.
 * 
 * @apiSuccess {UUID} ttid Task Template ID.
 * @apiSuccess {String} creatorId Creator ID.
 * @apiSuccess {Number} stage Stage.
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {Number} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {UUID} prevTtid Previous Task Template ID.
 * @apiSuccess {UUID} nextTtid Next Task Template ID.
 * @apiSuccess {Boolean} isDefault Default task template for the stage.
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 *  "ttid": "123e4567-e89b-12d3-a456-426614174000",
 *  "creatorId": "test1@gmail.com",
 *  "stage": 1,
 *  "taskName": "Customized Task",
 *  "taskType": 1,
 *  "prevTtid": "123e4567-e89b-12d3-a456-426614174001",
 *  "nextTtid": null,
 *  "isDefault": false,
 *  "templates": [
 *      "Test Email Template 1",
 *      "Test Email Template 2"
 *  ]
 * }]
 */
router.post(
    "/read/stage",
    check("stage")
        .notEmpty()
        .isInt()
        .withMessage("Stage is required"),
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    validate,
    TaskTemplateController.getTaskTemplatesByStage
)

/**
 * @api {post} v1/task-template/create Create a new task template
 * @apiName CreateTaskTemplate
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} taskName Task Name.
 * @apiBody {String} creatorId Creator ID.
 * @apiBody {Number} stage Stage.
 * @apiBody {Boolean} isDefault Default task template for the stage.
 * @apiBody {UUID} prevTtid Previous Task Template ID.
 * @apiBody {UUID} nextTtid Next Task Template ID.
 * @apiBody {Number} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {List} templates List of templates titles.
 * 
 * @apiSuccess {UUID} ttid Task Template ID.
 * @apiSuccess {String} creatorId Creator ID.
 * @apiSuccess {Number} stage Stage.
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {Number} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {UUID} prevTtid Previous Task Template ID.
 * @apiSuccess {UUID} nextTtid Next Task Template ID.
 * @apiSuccess {Boolean} isDefault Default task template for the stage.
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "ttid": "123e4567-e89b-12d3-a456-426614174000",
 * "creatorId": "test1@gmail.com",
 * "stage": 1,
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "prevTtid": "123e4567-e89b-12d3-a456-426614174001",
 * "nextTtid": null,
 * "isDefault": false,
 * "templates": [],
 * }
 */
router.post(
    "/create",
    check("taskName")
        .notEmpty()
        .withMessage("Task Name is required"),
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    check("stage")
        .notEmpty()
        .isInt()
        .withMessage("Stage is required"),
    check("isDefault")
        .default(false)
        .isBoolean(),
    check("prevTtid")
        .optional({ nullable: true })
        .isUUID()
        .withMessage("Prev Task Template ID must be a UUID or null"),
    check("nextTtid")
        .optional({ nullable: true })
        .isUUID()
        .withMessage("Next Task Template ID must be a UUID or null"),
    check("taskType")
        .notEmpty()
        .isInt()
        .withMessage("Task Type is required"),
    check("templates")
        .optional()
        .isArray()
        .withMessage("Templates is required"),
    validate,
    TaskTemplateController.createOrUpdateTaskTemplate
)


router.post(
    "/create/template",
    check("taskName")
        .notEmpty()
        .withMessage("Task Name is required"),
    check("taskType")
        .notEmpty()
        .isInt()
        .withMessage("Task Type is required"),
    check("templateObjs")
        .notEmpty()
        .isArray()
        .withMessage("Template Objects are required"),
    validate,
    TaskTemplateController.createTaskTemplateWithTemplateObjs
)


/**
 * @api {post} v1/task-template/read Read a task template by ttid
 * @apiName ReadTaskTemplateByTTID
 * @apiGroup TaskTemplate
 * 
 * @apiBody {UUID} ttid Task Template ID.
 * 
 * @apiSuccess {UUID} ttid Task Template ID.
 * @apiSuccess {String} creatorId Creator ID.
 * @apiSuccess {Number} stage Stage.
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {Number} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {UUID} prevTtid Previous Task Template ID.
 * @apiSuccess {UUID} nextTtid Next Task Template ID.
 * @apiSuccess {Boolean} isDefault Default task template for the stage.
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "ttid": "123e4567-e89b-12d3-a456-426614174000",
 * "creatorId": "test1@gmail.com",
 * "stage": 1,
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "prevTtid": "123e4567-e89b-12d3-a456-426614174001",
 * "nextTtid": null,
 * "isDefault": false,
 * "templates": [],
 * }
 */
router.post(
    "/read",
    check("ttid")
        .notEmpty()
        .isUUID()
        .withMessage("ttid is required"),
    validate,
    TaskTemplateController.getTaskTemplateByTTID
)

/**
 * @api {post} v1/task-template/delete Delete a task template by ttid
 * @apiName DeleteTaskTemplate
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} ttid Task Template ID.
 * 
 * @apiSuccess {String} ttid Task Template ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * }
 */
router.post(
    "/delete",
    check("ttid")
        .notEmpty()
        .isUUID()
        .withMessage("ttid is required"),
    validate,
    TaskTemplateController.deleteTaskTemplate
)

module.exports = router;