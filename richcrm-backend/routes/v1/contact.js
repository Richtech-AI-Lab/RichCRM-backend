var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var ContactController = require('../../controllers/contact');

const router = express.Router();


/**
 * @api {get} v1/contact/all Get all contacts
 * @apiName GetAllContacts
 * @apiGroup Contact
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {Array} tags Tag Labels (foreign key to Tag).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * 
 * @apiSuccessExample Success-Response:
 * [{
 * "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 * "contactType": 0,
 * "tags": ["Tag1", "Tag2"],
 * "firstName": "Lawson",
 * "lastName": "Wu",
 * "company": "RichTech",
 * "position": "CTO",
 * "cellNumber": "0912345678",
 * "email": "test@gmail.com",
 * "mailingAddress": "Framingham MA 01701-4607",
 * "wechatAccount": "lawsonwu",
 * "note": "This is a test contact."
 * }]
 * 
 */
router.get(
    "/all",
    ContactController.getAllContacts
);


/**
 * @api {get} v1/contact/:contactId Get a contact
 * @apiName GetContact
 * @apiGroup Contact
 * 
 * @apiParam {String} contactId Contact ID.
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {Array} tags Tag Labels (foreign key to Tag).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * 
 * @apiSuccessExample Success-Response:
 * {
 *  "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *  "contactType": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "Lawson",
 *  "lastName": "Wu",
 *  "company": "RichTech",
 *  "position": "CTO",
 *  "cellNumber": "0912345678",
 *  "email": "test@gmail.com",
 *  "mailingAddress": "Framingham MA 01701-4607",
 *  "wechatAccount": "lawsonwu",
 *  "note": "This is a test contact."
 * }
 */
router.get(
    "/:contactId",
    check("contactId")
        .notEmpty()
        .isUUID()
        .withMessage("Contact ID is required, or should be a valid UUID"),
    validate,
    ContactController.getContact
);



/**
 * @api {post} v1/contact/register Register a new contact
 * @apiName RegisterContact
 * @apiGroup Contact
 * 
 * @apiBody {String} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiBody {Array} tags [Optional] Tag Labels (foreign key to Tag).
 * @apiBody {String} firstName First Name of the Contact.
 * @apiBody {String} lastName [Optional] Last Name of the Contact.
 * @apiBody {String} company [Optional] Company name.
 * @apiBody {String} position [Optional] Position of the Contact in the company.
 * @apiBody {String} cellNumber [Optional] Cell phone number of the Contact.
 * @apiBody {String} email [Optional] Email address of the Contact.
 * @apiBody {String} mailingAddress [Optional] Mailing address of the Contact (**The AddressID return from register address**).
 * @apiBody {String} wechatAccount [Optional] WeChat Account of the Contact.
 * @apiBody {String} note [Optional] Note for this Contact.
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {Array} tags Tag Labels (foreign key to Tag).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * 
 * @apiSuccessExample Success-Response:
 * {
 *  "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *  "contactType": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "Lawson",
 *  "lastName": "Wu",
 *  "company": "RichTech",
 *  "position": "CTO",
 *  "cellNumber": "0912345678",
 *  "email": "test@gmail.com",
 *  "mailingAddress": "Framingham MA 01701-4607",
 *  "wechatAccount": "lawsonwu",
 *  "note": "This is a test contact."
 * }
 */
router.post(
    "/register",
    check("contactType")
        .notEmpty()
        .withMessage("Contact Type is required"),
    check("tags")
        .isArray()
        .optional()
        .withMessage("Tags should be an array"),
    check("firstName")
        .notEmpty()
        .withMessage("First Name is required"),
    check("lastName")
        .optional(),
    check("company")
        .optional(),
    check("position")
        .optional(),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Email should be a valid email address"),
    check("mailingAddress")
        .optional(),
    check("wechatAccount")
        .optional(),
    check("note")
        .optional(),
    validate,
    ContactController.registerContact
);


/**
 * @api {post} v1/contact/query Query contacts
 * @apiName QueryContacts
 * @apiGroup Contact
 * 
 * @apiBody {String} keyword Keyword to search for.
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {Array} tags Tag Labels (foreign key to Tag).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * 
 * @apiSuccessExample Success-Response:
 * [{
 *  "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *  "contactType": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "Lawson",
 *  "lastName": "Wu",
 *  "company": "RichTech",
 *  "position": "CTO",
 *  "cellNumber": "0912345678",
 *  "email": "test@gmail.com",
 *  "mailingAddress": "Framingham MA 01701-4607",
 *  "wechatAccount": "lawsonwu",
 *  "note": "This is a test contact."
 * }]
 */
router.post(
    "/query",
    check("keyword")
        .notEmpty()
        .withMessage("Keyword is required"),
    validate,
    ContactController.queryContacts
);


/**
 * @api {post} v1/contact/query/type Query contacts by type
 * @apiName QueryContactsByType
 * @apiGroup Contact
 * 
 * @apiBody {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {Array} tags Tag Labels (foreign key to Tag).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * 
 * @apiSuccessExample Success-Response:
 * [{
 *  "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *  "contactType": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "Lawson",
 *  "lastName": "Wu",
 *  "company": "RichTech",
 *  "position": "CTO",
 *  "cellNumber": "0912345678",
 *  "email": "test@gmail.com",
 *  "mailingAddress": "Framingham MA 01701-4607",
 *  "wechatAccount": "lawsonwu",
 *  "note": "This is a test contact."
 * }]
 */
router.post(
    "/query/type",
    check("contactType")
        .notEmpty()
        .withMessage("Contact Type is required"),
    validate,
    ContactController.queryContactsByType
)

/**
 * @api {post} v1/contact/query/case Query contacts by case ID and contact type
 * @apiName QueryContactsByCaseAndType
 * @apiGroup Contact
 * 
 * @apiBody {String} caseId [REQUIRED] Case ID.
 * @apiBody {Number} contactType [REQUIRED] Contact Type (0-REALTOR, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * 
 * @apiSuccessExample Success-Response:
 * [
 *  {
 *    "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *    "contactType": 0,
 *    "tags": ["Tag1", "Tag2"],
 *    "firstName": "Larry",
 *    "lastName": "Woooo",
 *    "company": "RichTech",
 *    "position": null,
 *    "cellNumber": "0912345678",
 *    "email": "otter@gmail.com",
 *    "mailingAddress": "Salt Lake City UT 84103-1112",
 *    "wechatAccount": "lawsjsonwu",
 *    "note": "This is a test contact."
 *  },
 * ]
 */
router.post(
    "/query/caseandtype",
    check("caseId")
        .notEmpty()
        .isUUID()
        .withMessage("Case ID is required and should be an UUID"),
    check("contactType")
        .notEmpty()
        .isInt()
        .withMessage("Contact Type is required"),
    validate,
    ContactController.queryContactsByCaseAndType
)


/**
 * @api {post} v1/contact/update Update a contact
 * @apiName UpdateContact
 * @apiGroup Contact
 * 
 * @apiBody {String} contactId Contact ID.
 * @apiBody {String} contactType [Optional] Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiBody {Array} tags [Optional] Tag Labels (foreign key to Tag).
 * @apiBody {String} firstName [Optional] First Name of the Contact.
 * @apiBody {String} lastName [Optional] Last Name of the Contact.
 * @apiBody {String} company [Optional] Company name.
 * @apiBody {String} position [Optional] Position of the Contact in the company.
 * @apiBody {String} cellNumber [Optional] Cell phone number of the Contact.
 * @apiBody {String} email [Optional] Email address of the Contact.
 * @apiBody {String} mailingAddress [Optional] Mailing address of the Contact.
 * @apiBody {String} wechatAccount [Optional] WeChat Account of the Contact.
 * @apiBody {String} note [Optional] Note for this Contact.
 * 
 * @apiSuccess {String} contactId Contact ID.
 * @apiSuccess {Number} contactType Contact Type (0-BROKER, 1-ATTORNEY, 2-TITLE, 3-LENDER, 4-CLIENT, 5-OTHER).
 * @apiSuccess {String} firstName First Name of the Contact.
 * @apiSuccess {String} lastName Last Name of the Contact.
 * @apiSuccess {String} company Company name.
 * @apiSuccess {String} position Position of the Contact in the company.
 * @apiSuccess {String} cellNumber Cell phone number of the Contact.
 * @apiSuccess {String} email Email address of the Contact.
 * @apiSuccess {String} mailingAddress Mailing address of the Contact.
 * @apiSuccess {String} wechatAccount WeChat Account of the Contact.
 * @apiSuccess {String} note Note for this Contact.
 * 
 * @apiSuccessExample Success-Response:
 * {
 *  "contactId": "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *  "contactType": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "Lawson",
 *  "lastName": "Wu",
 *  "company": "RichTech",
 *  "position": "CTO",
 *  "cellNumber": "0912345678",
 *  "email": "test@gmail.com",
 *  "mailingAddress": "Framingham MA 01701-4607",
 *  "wechatAccount": "lawsonwu",
 *  "note": "This is a test contact."
 * }
 * 
 */
router.post(
    "/update",
    check("contactId")
        .notEmpty()
        .withMessage("Contact ID is required"),
    check("contactType")
        .optional(),
    check("tags")
        .isArray()
        .optional()
        .withMessage("Tags should be an array"),
    check("firstName")
        .optional(),
    check("lastName")
        .optional(),
    check("company")
        .optional(),
    check("position")
        .optional(),
    check("cellNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Cell Number should be a valid phone number"),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Email should be a valid email address"),
    check("mailingAddress")
        .optional(),
    check("wechatAccount")
        .optional(),
    check("note")
        .optional(),
    validate,
    ContactController.updateContact
)


/**
 * @api {post} v1/contact/delete Delete a contact
 * @apiName DeleteContact
 * @apiGroup Contact
 * 
 * @apiBody {String} contactId Contact ID.
 * 
 * @apiSuccess {String} contactId Contact ID.
 * 
 * @apiSuccessExample Success-Response:
 * {}
 */
router.post(
    "/delete",
    check("contactId")
        .notEmpty()
        .withMessage("Contact ID is required"),
    validate,
    ContactController.deleteContact
)

module.exports = router;