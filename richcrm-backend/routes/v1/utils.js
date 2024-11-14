var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var UtilsController = require('../../controllers/utils');

const router = express.Router();

// Address

/**
 * @api {post} v1/utils/address/register Register a new address
 * @apiName RegisterClient
 * @apiGroup Utils
 * 
 * @apiBody {String} addressLine1 Address Line 1.
 * @apiBody {String} addressLine2 Address Line 2.
 * @apiBody {String} city City.
 * @apiBody {String} state State.
 * @apiBody {String} zipCode Zip Code.
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "addressId": "130 W 3RD ST, NEW YORK, NY 10012-1296 US",
 *  "addressLine1": "130 W 3RD ST",
 *  "city": "NEW YORK",
 *  "state": "NEW YORK",
 *  "zipCode": "10012",
 *  "plus4": "1296"
 * }
 * 
 */
router.post(
    "/address/register",
    check("addressLine1")
        .notEmpty()
        .withMessage("Address Line 1 is required"),
    check("city")
        .notEmpty()
        .withMessage("City is required"),
    check("state")
        .notEmpty()
        .withMessage("State is required"),
    check("zipCode")
        .notEmpty()
        .withMessage("Zip Code is required"),
    validate,
    UtilsController.registerAddress
);


/**
 * @api {post} v1/utils/address/delete Delete an address
 * @apiName DeleteAddress
 * @apiGroup Utils
 * 
 * @apiBody {String} addressId Address ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/address/delete",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    UtilsController.deleteAddress
)


/**
 * @api {get} v1/utils/address/all Get all addresses
 * @apiName GetAllAddresses
 * @apiGroup Utils
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  [
 *   {
 *    "addressId": "130 W 3RD ST, NEW YORK, NY 10012-1296 US",
 *    "addressLine1": "130 W 3RD ST",
 *    "city": "NEW YORK",
 *    "state": "NEW YORK",
 *    "zipCode": "10012",
 *    "plus4": "1296"
 *   },
 *   {...}
 *  ]
 * }
 */
router.get(
    "/address/all",
    validate,
    UtilsController.getAllAddresses
)


/**
 * @api {post} v1/utils/address/query/id Get an address by ID
 * @apiName GetAddress
 * @apiGroup Utils
 * 
 * @apiBody {String} addressId Address ID.
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "addressId": "New York NY 10012-1296",
 *    "addressLine1": "130 W 3RD ST",
 *    "city": "NEW YORK",
 *    "state": "NEW YORK",
 *    "zipCode": "10012",
 *    "plus4": "1296"
 * }
 */
router.post(
    "/address/query/id",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    UtilsController.getAddress
)


/**
 * @api {post} v1/utils/email/send Send an email
 * @apiName SendEmail
 * @apiGroup Utils
 * 
 * @apiBody {Array} toAddresses Array of email addresses.
 * @apiBody {Array} ccAddresses Array of email addresses.
 * @apiBody {String} templateTitle Email title.
 * @apiBody {String} templateContent Email content.
 * @apiBody {Array} attachments Array of attachments.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [
 *    {
 *      "ResponseMetadata": {
 *        "RequestId": "7139c14a-be13-420e-b6a3-5caa38e0bb14"
 *      },
 *      "MessageId": "010f0191f767354b-6b328197-8e2f-4529-94e9-c9bf1dda144a-000000"
 *    }
 *  ],
 *  "message": "Email sent successfully"
 * }
 */
router.post(
    "/email/send",
    check("toAddresses")
        .notEmpty()
        .isArray()
        .withMessage("To Addresses are required"),
    check("ccAddresses")
        .optional()
        .isArray()
        .withMessage("CC Addresses are required"),
    check("templateTitle")
        .notEmpty()
        .withMessage("Email Title is required"),
    check("templateContent")
        .notEmpty()
        .withMessage("Email Content is required"),
    check("attachments")
        .optional()
        .isArray(),
    validate,
    UtilsController.sendEmailResend
)

module.exports = router;