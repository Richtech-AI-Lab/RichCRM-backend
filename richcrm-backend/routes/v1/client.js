var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var ClientController = require('../../controllers/client');

const router = express.Router();
const passport = require('../../middlewares/tokenStrategy/accessTokenStrategy')

/**
 * @api {post} v1/client/register Register a new client
 * @apiName RegisterClient
 * @apiGroup Client
 * 
 * @apiBody {String} clientId [Optional] Existing Client ID (will return the an existing client).
 * @apiBody {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiBody {String} firstName First Name of the Client.
 * @apiBody {String} lastName Last Name of the Client.
 * @apiBody {String} cellNumber [Optional] Cell Number of the Client.
 * @apiBody {String} email [Optional] Email of the Client.
 * @apiBody {String} organizationId [Optional] Organization ID of the Client.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {Number} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientId":"123-45-6789",
 *  "clientType": 0,
 *  "title": 0,
 *  "tags": ["Client"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }
 * 
 */
router.post(
    "/register",
    check("clientId")
        .optional()
        .isUUID()
        .withMessage("Client ID should be a valid UUID"),
    check("clientType")
        .notEmpty()
        .withMessage("Client Type is required"),
    check("tags")
        .optional()
        .isArray()
        .withMessage("Tags should be an array"),
    check("firstName")
        .notEmpty()
        .withMessage("First Name is required"),
    check("lastName")
        .notEmpty()
        .withMessage("Last Name is required"),
    check("cellNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Cell Number should be a valid phone number"),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Email should be a valid email address"),
    check("organizationId")
        .optional()
        .isUUID()
        .withMessage("Organization ID should be a valid UUID"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.registerClient
);

/**
 * @api {get} v1/client/all Get all clients
 * @apiName GetAllClients
 * @apiGroup Client
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 *  "clientId":"123-45-6789",
 *  "clientType": 1,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }]
 * 
 */
router.get(
    "/all",
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.getAllClients

)

/**
 * @api {post} v1/client/query Query clients
 * @apiName QueryClients
 * @apiGroup Client
 * 
 * @apiBody {String} keyword Keyword to search for.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 *  "clientId":"123-45-6789",
 *  "clientType": 1,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }]
 * 
 */
router.post(
    "/query",
    check("keyword")
        .notEmpty()
        .withMessage("Keyword is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.queryClients
);


/**
 * @api {post} v1/client/query/type Query clients by type
 * @apiName QueryClientsByType
 * @apiGroup Client
 * 
 * @apiBody {String} clientType Client Type.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 *  "clientId":"123-45-6789",
 *  "clientType": 1,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }]
 * 
 */
router.post(
    "/query/type",
    check("clientType")
        .notEmpty()
        .withMessage("Client Type is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.queryClientsByType
)

/**
 * @api {post} v1/client/query/id Query client by ID
 * @apiName QueryClientById
 * @apiGroup Client
 * 
 * @apiBody {String} clientId Client ID.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientId":"123-45-6789",
 *  "clientType": 1,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }
 * 
 */
router.post(
    "/query/id",
    check("clientId")
        .notEmpty()
        .withMessage("Client ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.getClient
);


/**
 * @api {get} v1/client/:clientId Get a client by ID
 * @apiName GetClient
 * @apiGroup Client
 * 
 * @apiParam {String} clientId Client ID.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientId":"123-45-6789",
 *  "clientType": 1,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }
 * 
 */
router.get(
    "/:clientId",
    check("clientId")
        .notEmpty()
        .withMessage("Client ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.getClient
)


/**
 * @api {post} v1/client/update Update a client
 * @apiName UpdateClient
 * @apiGroup Client
 * 
 * @apiBody {String} clientId Client ID.
 * @apiBody {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiBody {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiBody {Array} tags Tags of the Client.
 * @apiBody {String} firstName First Name of the Client.
 * @apiBody {String} lastName Last Name of the Client.
 * @apiBody {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiBody {String} cellNumber Cell Number of the Client.
 * @apiBody {String} workNumber Work Number of the Client.
 * @apiBody {String} email Email of the Client.
 * @apiBody {String} wechatAccount Wechat Account of the Client.
 * @apiBody {String} dob Date of Birth of the Client.
 * @apiBody {String} attorneyId Attorney ID of the Client.
 * @apiBody {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiBody {String} addressId Address ID of the Client.
 * @apiBody {String} organizationId Organization ID of the Client.
 * 
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {Array} tags Tags of the Client.
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {Number} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiSuccess {String} organizationId Organization ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientType": 2,
 *  "title": 0,
 *  "tags": ["Tag1", "Tag2"],
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2,
 *  "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299"
 * }
 * 
 */
router.post(
    "/update",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    check("tags")
        .optional()
        .isArray()
        .withMessage("Tags should be an array"),
    check("organizationId")
        .optional()
        .isUUID()
        .withMessage("Organization ID should be a valid UUID"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.updateClient
)


/**
 * @api {post} v1/client/delete Delete a client
 * @apiName DeleteClient
 * @apiGroup Client
 * 
 * @apiBody {String} clientId Client ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/delete",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    ClientController.deleteClient
)

module.exports = router;