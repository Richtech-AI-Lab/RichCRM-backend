var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var TaskTemplateController = require('../../controllers/task-template');

const router = express.Router();


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
 * @apiBody {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {List} templates List of templates titles.
 * 
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "templates": [
 * "Test Email Template 1",
 * "Test Email Template 2"
 * ]
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


/**
 * @api {post} v1/task-template/create/template Create a new task template with template objects
 * @apiName CreateTaskTemplateWithTemplateObjs
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} taskName Task Name.
 * @apiBody {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {List} templateObjs List of template objects (templateTitle, templateContent).
 * 
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "templates": [
 * "Test Email Template 1",
 * "Test Email Template 2"
 * ]
 * }
 */
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
 * @api {post} v1/task-template/read Read a task template by task name
 * @apiName ReadTaskTemplateByName
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} taskName Task Name.
 * 
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "templates": [
 * "Test Email Template 1",
 * "Test Email Template 2"
 * ]
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
 * @api {post} v1/task-template/update Update a task template by task name
 * @apiName UpdateTaskTemplate
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} taskName Task Name.
 * @apiBody {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {List} templates List of templates titles.
 * 
 * @apiSuccess {String} taskName Task Name.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {List} templates List of templates titles.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "taskName": "Customized Task",
 * "taskType": 1,
 * "templates": [
 * "Test Email Template 1",
 * "Test Email Template 2"
 * ]
 * }
 */
router.post(
    "/update",
    check("taskName")
        .notEmpty()
        .withMessage("Task Name is required"),
    check("taskType")
        .optional()
        .isInt()
        .withMessage("Task Type is required"),
    check("templates")
        .optional()
        .isArray()
        .withMessage("Templates is required"),
    validate,
    TaskTemplateController.updateTaskTemplate
)


/**
 * @api {post} v1/task-template/delete Delete a task template by task name
 * @apiName DeleteTaskTemplate
 * @apiGroup TaskTemplate
 * 
 * @apiBody {String} taskName Task Name.
 * 
 * @apiSuccess {String} taskName Task Name.
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