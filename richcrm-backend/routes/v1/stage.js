var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var StageController = require('../../controllers/stage');

const router = express.Router();
const passport = require("../../middlewares/tokenStrategy/accessTokenStrategy");

/**
 * @api {get} v1/stage/:stageId Read a stage by stage ID
 * @apiName ReadStageById
 * @apiGroup Stage
 * 
 * @apiParam {String} stageId Stage ID.
 * 
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {String} stageType Stage Type (0 - SETUP, 1 - CONTRACT_PREPARING, 2 - CONTRACT_SIGNING, 3 - MORTGAGE, 4 - CLOSING).
 * @apiSuccess {String} stageStatus Stage Status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {Array} tasks Tasks of the Stage.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "stageId": "4812192a-1fe9-40f6-8ae3-892f9c33e0c7",
 *  "stageType": 2,
 *  "caseId": "0_f3117eaa-e3a7-4b3e-88fb-37a8741a181e_b394ec2a-24c0-4913-b065-09bcaecbeb9a",
 *  "tasks": [
 *   "21c12f23-03b6-497f-bc51-9868ad27292b",
 *   "5e354caa-62e6-4174-a12f-a8925c506679",
 *   "8c7bb9dd-852c-45af-8a9d-20c80c2e023e",
 *   "261ffddb-8f87-4674-9edf-05ffe9ec0c53",
 *   "73323b4a-bbcb-4469-b92d-3b0ddc2c58c4"
 *  ],
 *  "stageStatus": 0
 * }
 * 
 */
router.get(
    "/:stageId",
    check("stageId")
        .notEmpty()
        .withMessage("Stage ID is required"),
    validate,
    StageController.readStageById
)

/**
 * @api {get} v1/stage/:caseId/:stageType Read a stage by case ID and stage type
 * @apiName ReadStageByCaseIdAndStageType
 * @apiGroup Stage
 * 
 * @apiParam {String} caseId Case ID.
 * @apiParam {String} stageType Stage Type.
 * 
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {String} stageType Stage Type (0 - SETUP, 1 - CONTRACT_PREPARING, 2 - CONTRACT_SIGNING, 3 - MORTGAGE, 4 - CLOSING).
 * @apiSuccess {String} stageStatus Stage Status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {Array} tasks Tasks of the Stage.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "stageId": "4812192a-1fe9-40f6-8ae3-892f9c33e0c7",
 *  "stageType": 2,
 *  "caseId": "0_f3117eaa-e3a7-4b3e-88fb-37a8741a181e_b394ec2a-24c0-4913-b065-09bcaecbeb9a",
 *  "tasks": [
 *   "21c12f23-03b6-497f-bc51-9868ad27292b",
 *   "5e354caa-62e6-4174-a12f-a8925c506679",
 *   "8c7bb9dd-852c-45af-8a9d-20c80c2e023e",
 *   "261ffddb-8f87-4674-9edf-05ffe9ec0c53",
 *   "73323b4a-bbcb-4469-b92d-3b0ddc2c58c4"
 *  ],
 *  "stageStatus": 0
 * }
 * 
 */
router.get(
    "/:caseId/:stageType",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    check("stageType")
        .notEmpty()
        .withMessage("Stage Type is required"),
    validate,
    StageController.readStageByCaseIdAndStageType
)

/**
 * @api {post} v1/stage/create Create a new stage
 * @apiName CreateStage
 * @apiGroup Stage
 * 
 * @apiBody {String} stageType Stage Type.
 * @apiBody {String} caseId Case ID.
 * 
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {String} stageType Stage Type (0 - SETUP, 1 - CONTRACT_PREPARING, 2 - CONTRACT_SIGNING, 3 - MORTGAGE, 4 - CLOSING).
 * @apiSuccess {String} stageStatus Stage Status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {Array} tasks Tasks of the Stage.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "stageId": "4812192a-1fe9-40f6-8ae3-892f9c33e0c7",
 *  "stageType": 2,
 *  "caseId": "0_f3117eaa-e3a7-4b3e-88fb-37a8741a181e_b394ec2a-24c0-4913-b065-09bcaecbeb9a",
 *  "tasks": [
 *   "21c12f23-03b6-497f-bc51-9868ad27292b",
 *   "5e354caa-62e6-4174-a12f-a8925c506679",
 *   "8c7bb9dd-852c-45af-8a9d-20c80c2e023e",
 *   "261ffddb-8f87-4674-9edf-05ffe9ec0c53"
 *  ],
 *  "stageStatus": 0
 * }
 */
router.post(
    "/create",
    check("stageType")
        .notEmpty()
        .withMessage("Stage Type is required"),
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    StageController.createStage
)

/**
 * @api {post} v1/stage/update Update a stage
 * @apiName UpdateStage
 * @apiGroup Stage
 * 
 * @apiBody {String} stageId Stage ID.
 * @apiBody {String} stageStatus Stage Status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiBody {String} tasks Task orders of the Stage (TaskID not TTID!). 
 * 
 * 
 * @apiSuccess {String} stageId Stage ID.
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {String} stageType Stage Type (0 - SETUP, 1 - CONTRACT_PREPARING, 2 - CONTRACT_SIGNING, 3 - MORTGAGE, 4 - CLOSING).
 * @apiSuccess {String} stageStatus Stage Status (0 - NOT_STARTED, 1 - PENDING, 2 - FINISHED, 3 - OVERDUE).
 * @apiSuccess {Array} tasks Tasks of the Stage.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "stageId": "4812192a-1fe9-40f6-8ae3-892f9c33e0c7",
 *  "stageType": 2,
 *  "caseId": "0_f3117eaa-e3a7-4b3e-88fb-37a8741a181e_b394ec2a-24c0-4913-b065-09bcaecbeb9a",
 *  "tasks": [
 *   "21c12f23-03b6-497f-bc51-9868ad27292b",
 *   "5e354caa-62e6-4174-a12f-a8925c506679",
 *   "8c7bb9dd-852c-45af-8a9d-20c80c2e023e",
 *   "261ffddb-8f87-4674-9edf-05ffe9ec0c53",
 *   "73323b4a-bbcb-4469-b92d-3b0ddc2c58c4"
 *  ],
 *  "stageStatus": 1
 * }
 */
router.post(
    "/update",
    check("stageId")
        .notEmpty()
        .isUUID()
        .withMessage("Stage ID is required"),
    check("stageStatus")
        .optional()
        .isInt(),
    check("tasks")
        .optional()
        .isArray(),
    validate,
    StageController.updateStage
)

/**
 * @api {post} v1/stage/delete Delete a stage
 * @apiName DeleteStage
 * @apiGroup Stage
 * 
 * @apiBody {String} stageId Stage ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "[StageController][deleteStage] Stage deleted"
 * }
 */
router.post(
    "/delete",
    check("stageId")
        .notEmpty()
        .withMessage("Stage ID is required"),
    validate,
    StageController.deleteStage
)


/**
 * @api {post} v1/stage/delete/all Delete all stages in a case
 * @apiName DeleteAllStagesInCase
 * @apiGroup Stage
 * 
 * @apiBody {String} caseId Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "[StageController][deleteStagesByCaseId] Stages deleted"
 * }
 */
router.post(
    "/delete/all",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    StageController.deleteAllStagesInCase
)


module.exports = router;