var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var TagController = require('../../controllers/tag');

const router = express.Router();


/**
 * @api {post} v1/tag/label
 * @apiName GetTagByLabel
 * @apiGroup Tag
 * 
 * @apiBody {String} label [REQUIRED] Tag's label
 * 
 * @apiSuccess {String} Label Tag's label
 * @apiSuccess {String} Color1 Tag's color1 in hex
 * @apiSuccess {String} Color2 Tag's color2 in hex
 * @apiSuccess {tagType} TagType Tag's type
 * 
 * @apiSuccessExample Example data on success:
 * {
 *   "Label": "Tag1",
 *   "Color1": "#FFFFFF",
 *   "Color2": "#000000",
 *   "TagType": 1
 * }
 */
router.post(
    '/label',
    check('label')
        .notEmpty()
        .isString()
        .withMessage('Label is required'),
    validate,
    TagController.readTagByLabel
);


/**
 * @api {post} v1/tag/all Get all Tags
 * @apiName GetAllTags
 * @apiGroup Tag
 * 
 * @apiSuccess {UUID} TagId Tag's ID
 * @apiSuccess {String} Label Tag's label
 * @apiSuccess {String} Color1 Tag's color1 in hex
 * @apiSuccess {String} Color2 Tag's color2 in hex
 * @apiSuccess {tagType} TagType Tag's type
 * 
 * @apiSuccessExample Example data on success:
 * [
 *   {
 *     "TagId": "123e4567-e89b-12d3-a456-426614174000",
 *     "Label": "Tag1",
 *     "Color1": "#FFFFFF",
 *     "Color2": "#000000",
 *     "TagType": 1
 *   },
 * ]
 * 
 */
router.post(
    '/all',
    TagController.readAllTags
)

/**
 * @api {post} v1/tag/type Get Tag by Type
 * @apiName GetTagByType
 * @apiGroup Tag
 * 
 * @apiBody {tagType} tagType [REQUIRED] Tag's type (0: OTHER, 1: CONTACT)
 * 
 * @apiSuccess {String} Label Tag's label
 * @apiSuccess {String} Color1 Tag's color1 in hex
 * @apiSuccess {String} Color2 Tag's color2 in hex
 * @apiSuccess {tagType} TagType Tag's type
 * 
 * @apiSuccessExample Example data on success:
 * [
 *   {
 *     "Label": "Tag1",
 *     "Color1": "#FFFFFF",
 *     "Color2": "#000000",
 *     "TagType": 1
 *   },
 * ]
 * 
 */
router.post(
    '/type',
    check('tagType')
        .notEmpty()
        .isInt()
        .withMessage('TagType is required and must be an integer'),
    validate,
    TagController.readTagsByType
);

/**
 * @api {post} v1/tag/create Create Tag
 * @apiName CreateTag
 * @apiGroup Tag
 * 
 * @apiBody {String} label [REQUIRED] Tag's label
 * @apiBody {String} color1 [REQUIRED] Tag's color1 in hex
 * @apiBody {String} color2 Tag's color2 in hex
 * @apiBody {tagType} tagType [REQUIRED] Tag's type (0: OTHER, 1: CONTACT)
 * 
 * @apiSuccess {String} Label Tag's label
 * @apiSuccess {String} Color1 Tag's color1 in hex
 * @apiSuccess {String} Color2 Tag's color2 in hex
 * @apiSuccess {tagType} TagType Tag's type
 * 
 * @apiSuccessExample Example data on success:
 * {
 *     "Label": "Tag1",
 *     "Color1": "#FFFFFF",
 *     "Color2": "#000000",
 *     "TagType": 1
 * }
 * 
 */
router.post(
    '/create',
    check('label')
        .notEmpty()
        .isString()
        .withMessage('Label is required'),
    check('color1')
        .notEmpty()
        .withMessage('Color1 is required'),
    check('color2')
        .optional(),
    check('tagType')
        .notEmpty()
        .isInt()
        .withMessage('TagType is required and must be an integer'),
    validate,
    TagController.createTag
);

/**
 * @api {post} v1/tag/update Update Tag
 * @apiName UpdateTag
 * @apiGroup Tag
 * 
 * @apiBody {String} label [REQUIRED] Tag's label
 * @apiBody {String} color1 Tag's color1 in hex
 * @apiBody {String} color2 Tag's color2 in hex
 * @apiBody {tagType} tagType Tag's type (0: OTHER, 1: CONTACT)
 * 
 * @apiSuccessExample Example data on success:
 * {
 *     "Label": "Tag1",
 *     "Color1": "#FFFFFF",
 *     "Color2": "#000000",
 *     "TagType": 1
 * }
 * 
 */
router.post(
    '/update',
    check('label')
        .notEmpty()
        .isString()
        .withMessage('Label is required'),
    check('color1')
        .optional(),
    check('color2')
        .optional(),
    check('tagType')
        .optional()
        .isInt(),
    validate,
    TagController.updateTag
);

/**
 * @api {post} v1/tag/delete Delete Tag
 * @apiName DeleteTag
 * @apiGroup Tag
 * 
 * @apiBody {string} label [REQUIRED] Tag's label
 * 
 * @apiSuccessExample Example data on success:
 * {
 *     "Label": "Tag1",
 *     "Color1": "#FFFFFF",
 *     "Color2": "#000000",
 *     "TagType": 1
 * }
 * 
 */
router.post(
    '/delete',
    check('label')
        .notEmpty()
        .isString()
        .withMessage('Label is required'),
    validate,
    TagController.deleteTag
);


module.exports = router;