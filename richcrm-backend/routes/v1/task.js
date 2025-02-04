var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var TaskController = require('../../controllers/task');

const router = express.Router();
const passport = require("../../middlewares/tokenStrategy/accessTokenStrategy");

/**
 * @api {post} v1/task/create Create a new task
 * @apiName CreateTask
 * @apiGroup Task
 * 
 * @apiBody {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {String} name Task name.
 * @apiBody {String} status Task status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiBody {List} templates List of templates titles.
 * @apiBody {String} ttid Task Template ID that this task is based on.
 * 
 * @apiSuccess {String} taskId Task ID.
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {String} name Task name.
 * @apiSuccess {String} status Task status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {List} templates List of templates titles.
 * @apiSuccess {String} ttid Task Template ID that this task is based on.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "taskId": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 *  "stageId": "a718bbd9-14b4-4470-9e11-0e0277cf3c8f",
 *  "taskType": 1,
 *    "name": "Customized Taskkkk",
 *    "status": 1,
 *    "templates": [
 *      "Test Email Template 1",
 *      "Test Email Template 2"
 *    ]
 *  "ttid": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 * }
 */
router.post(
    "/create",
    check("taskType")
        .notEmpty()
        .withMessage("Task Type is required"),
    check("stageId")
        .notEmpty()
        .withMessage("Stage ID is required"),
    check("name")
        .notEmpty()
        .withMessage("Name is required"),
    check("status")
        .notEmpty()
        .withMessage("Status is required"),
    check("ttid")
        .optional()
        .isUUID(),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    TaskController.createTask
)


/**
 * @api {get} v1/task/:taskId Read a task by task ID
 * @apiName ReadTaskById
 * @apiGroup Task
 * 
 * @apiParam {String} taskId Task ID.
 * 
 * @apiSuccess {String} taskId Task ID.
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {String} name Task name.
 * @apiSuccess {String} status Task status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {List} templates List of templates titles.
 * @apiSuccess {String} ttid Task Template ID that this task is based on.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "taskId": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 *  "stageId": "a718bbd9-14b4-4470-9e11-0e0277cf3c8f",
 *  "taskType": 1,
 *  "name": "Customized Taskkkk",
 *  "status": 1,
 *  "templates": [
 *   "Test Email Template 1",
 *   "Test Email Template 2"
 *  ]
 *  "ttid": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 * }
 * 
 */
router.get(
    "/:taskId",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.readTaskById
)


/**
 * @api {post} v1/task/update Update a task
 * @apiName UpdateTask
 * @apiGroup Task
 * 
 * @apiBody {String} taskId Task ID.
 * @apiBody {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiBody {String} name Task name.
 * @apiBody {String} status Task status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiBody {List} templates List of templates titles to be updated.
 * 
 * @apiSuccess {String} taskId Task ID.
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} taskType Task Type (0 - ACTION, 1 - CONTACT, 2 - UPLOAD).
 * @apiSuccess {String} name Task name.
 * @apiSuccess {String} status Task status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {List} templates List of templates titles.
 * @apiSuccess {String} fileURL URL of the uploaded file.
 * @apiSuccess {String} ttid Task Template ID that this task is based on.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "taskId": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 *  "stageId": "a718bbd9-14b4-4470-9e11-0e0277cf3c8f",
 *  "taskType": 1,
 *  "name": "Customized Taskkkk",
 *  "status": 1,
 *  "templates": [
 *   "Test Email Template 1",
 *   "Test Email Template 2",
 *   "Test Email Template 3"
 *  ]
 *  "fileURL": "https://s3.amazonaws.com/bucketname/filename",
 *  "ttid": "e29e020b-9735-40a4-a494-2b6df1949c1b",
 * }
 * 
 */
router.post(
    "/update",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.updateTask
)


/**
 * @api {post} v1/task/delete Delete a task
 * @apiName DeleteTask
 * @apiGroup Task
 * 
 * @apiBody {String} taskId Task ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "[TaskController][deleteTask] Task deleted"
 * }
 */
router.post(
    "/delete",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.deleteTask
)

module.exports = router;