var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var CaseController = require('../../controllers/case');


const router = express.Router();
const passport = require("../../middlewares/tokenStrategy/accessTokenStrategy");

/**
 * @api {get} v1/case/:caseId Get a case by ID
 * @apiName GetCase
 * @apiGroup Case
 *
 * @apiParam {String} caseId [REQUIRED] Case ID.
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST.
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 1,
 *  "caseType": 0,
 *  "buyerId": 98765,
 *  "clientName": "Woooo, Larry",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }
 */
router.get(
    "/:caseId",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.readCase
);

/**
 * @api {post} v1/case/all Get all cases
 * @apiName GetAllCases
 * @apiGroup Case
 * 
 * @apiBody {String} creatorId [REQUIRED] Creator ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {Number} caseStatus Status of the case (0-WAITING, 1-FINISHED, 2-WARNING).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST.
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "clientType": 0,
 *  "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }]
 * 
 */
router.post(
    "/all",
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    check("closed")
        .default(false),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.readAllCasesByCreatorId
);


/**
 * @api {post} v1/case/query/client Get all cases by client ID
 * @apiName GetAllCasesByClientId
 * @apiGroup Case
 * 
 * @apiBody {String} clientId [REQUIRED] Seller ID, Buyer ID, or Additional Client ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} caseStatus Status of the case (0-WAITING, 1-FINISHED, 2-WARNING).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST.
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "clientType": 0,
 *  "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }]
 * 
 */
router.post(
    "/query/client",
    check("clientId")
        .notEmpty()
        .withMessage("Client ID is required"),
    check("closed")
        .default(false),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.readAllCasesByClientId
)


/**
 * @api {post} v1/case/query/contact Get all cases by contact ID
 * @apiName GetAllCasesByContactId
 * @apiGroup Case
 * 
 * @apiBody {String} contactId [REQUIRED] Contact ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} caseStatus Status of the case (0-WAITING, 1-FINISHED, 2-WARNING).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST.
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "clientType": 1,
 *  "organizationId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *  "clientName": "Test Company",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }]
 * 
 */
router.post(
    "/query/contact",
    check("contactId")
        .notEmpty()
        .withMessage("Contact ID is required"),
    check("closed")
        .default(false),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.readAllCasesByContactId
)


/**
 * @api {post} v1/case/query/keyword Get all cases by keyword (within ClientName and PremisesName)
 * @apiName GetAllCasesByKeyword
 * @apiGroup Case
 * 
 * @apiBody {String} keyword [REQUIRED] Keyword to search.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} caseStatus Status of the case (0-WAITING, 1-FINISHED, 2-WARNING).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {Number} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST.
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "clientType": 0,
 *  "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }]
 * 
 */
router.post(
    "/query/keyword",
    check("keyword")
        .notEmpty()
        .withMessage("Keyword is required"),
    check("closed")
        .default(false),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.readAllCasesByKeyword
)


/**
 * @api {post} v1/case/create Create a new case
 * @apiName CreateCase
 * @apiGroup Case
 * @apiDescription Create a new case, **the stage object will be created accordingly, its stageId will be returned**!
 *
 * @apiBody {String} premisesId [REQUIRED] Premises ID.
 * @apiBody {String} creatorId [REQUIRED] Creator ID.
 * @apiBody {Number} caseType [REQUIRED] Client Type (0-PURCHASING, 1-SELLING).
 * @apiBody {String} clientType [REQUIRED] Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiBody {String} clientId [REQUIRED WHEN clientType 0] Client ID for buyer or seller.
 * @apiBody {String} organizationId [REQUIRED WHEN clientType 1 and 2] Organization ID if type is COMPANY or TRUST.
 * @apiBody {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiBody {Array} additionalClients Additional clients in this case.
 * @apiBody {Array} contacts Contacts in this case.
 * @apiBody {Array} additionalOrganizations Additional organizations in this case.
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} clientType Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} clientId Client ID for buyer or seller.
 * @apiSuccess {String} organizationId Organization ID if type is COMPANY or TRUST. 
 * @apiSuccess {String} clientName Client Name (For display and search).
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId Stage ID created by input stage.
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "clientType": 0,
 *  "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *  "clientName": "Woooo, Larry",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ]
 * }
 */
router.post(
    "/create",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    check("caseType")
        .notEmpty()
        .withMessage("Client Type is required"),
    check("clientType")
        .notEmpty()
        .withMessage("Client Type is required"),
    check("clientId")
        .optional()
        .isUUID()
        .withMessage("Client ID should be a valid UUID"),
    check("organizationId")
        .optional()
        .isUUID()
        .withMessage("Organization ID should be a valid UUID"),
    check("stage")
        .notEmpty()
        .withMessage("Stage is required"),
    check("additionalClients")
        .optional()
        .isArray()
        .withMessage("Additional Clients should be an array"),
    check("additionalOrganizations")
        .optional()
        .isArray()
        .withMessage("Additional Organizations should be an array"),
    check("contacts")
        .optional()
        .isArray()
        .withMessage("Contacts should be an array"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.createCase
);


/**
 * @api {post} v1/case/update Update a case
 * @apiName UpdateCase
 * @apiGroup Case
 * @apiDescription Update a case by ID, **if the stage is updated, the new stage will be created and the stageId will be returned**!
 *
 * @apiBody {String} caseId [REQUIRED] Case ID.
 * @apiBody {String} creatorId Creator ID.
 * @apiBody {String} premisesId Premises ID.
 * @apiBody {Number} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiBody {String} closeAt Date when the case was closed.
 * @apiBody {String} closingDate Closing date of the case.
 * @apiBody {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiBody {Array} additionalClients Additional clients in this case.
 * @apiBody {Array} contacts Contacts in this case.
 * @apiBody {Array} additionalOrganizations Additional organizations in this case.
 * @apiBody {Number} purchaserPrice Purchaser price.
 * @apiBody {Number} downPayment Down payment.
 * @apiBody {Number} mortgageAmount Mortgage amount.
 * @apiBody {Number} sellersConcession Seller's concession.
 * @apiBody {String} referral Referral.
 * @apiBody {String} bank Bank.
 * @apiBody {String} personalNote Personal note.
 * 
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} premisesName Premises Name (For display and search).
 * @apiSuccess {Number} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId new Stage ID created or old Stage ID if the stage remain unchanged.
 * @apiSuccess {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * @apiSuccess {Array} additionalOrganizations Additional organizations in this case.
 * @apiSuccess {Number} purchaserPrice Purchaser price.
 * @apiSuccess {Number} downPayment Down payment.
 * @apiSuccess {Number} mortgageAmount Mortgage amount.
 * @apiSuccess {Number} sellersConcession Seller's concession.
 * @apiSuccess {String} referral Referral.
 * @apiSuccess {String} bank Bank.
 * @apiSuccess {String} personalNote Personal note.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *  "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *  "stage": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "status": 0,
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-18T19:52:16.672Z",
 *  "mortgageContingencyDate": "2024-07-18T19:52:16.672Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }
 */
router.post(
    "/update",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    check("additionalClients")
        .optional()
        .isArray()
        .withMessage("Additional Clients should be an array"),
    check("contacts")
        .optional()
        .isArray()
        .withMessage("Contacts should be an array"),
    check("additionalOrganizations")
        .optional()
        .isArray()
        .withMessage("Additional Organizations should be an array"),
    check("purchaserPrice")
        .optional()
        .isNumeric()
        .withMessage("Purchaser Price should be a number"),
    check("sellerPrice")
        .optional()
        .isNumeric()
        .withMessage("Seller Price should be a number"),
    check("downPayment")
        .optional()
        .isNumeric()
        .withMessage("Down Payment should be a number"),
    check("mortgageAmount")
        .optional()
        .isNumeric()
        .withMessage("Mortgage Amount should be a number"),
    check("sellersConcession")
        .optional()
        .isNumeric()
        .withMessage("Sellers Concession should be a number"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.updateCase
);


/**
 * @api {post} v1/case/close Close a case
 * @apiName CloseCase
 * @apiGroup Case
 * 
 * @apiBody {String} caseId [REQUIRED] Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *     "caseId": "2443b04b-a4d8-43d1-843b-a31b0dd3c1a9",
 *     "creatorId": "test1@gmail.com",
 *     "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *     "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *     "stage": 0,
 *     "caseType": 1,
 *     "clientType": 0,
 *     "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *     "clientName": "Woooo, Larry",
 *     "createAt": "2024-09-14T20:45:29.767Z",
 *     "closeAt": "2024-09-14T21:15:41.199Z",
 *     "closingDate": "2024-07-20T20:24:24.740Z",
 *     "mortgageContingencyDate": "2024-07-20T20:24:24.740Z",
 *     "additionalClients": [
 *       "738ffc97-299b-423a-b759-2116a402b18d",
 *       "86a6d1d3-9644-40cc-bec5-e2710567d882",
 *       "26ea9b74-b431-4b08-88cd-436ba25486bb"
 *     ],
 *     "contacts": [
 *       "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *       "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *     ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }
 */
router.post(
    "/close",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.closeCase
)

/**
 * @api {post} v1/case/reopen Reopen a case
 * @apiName ReopenCase
 * @apiGroup Case
 * 
 * @apiBody {String} caseId [REQUIRED] Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *     "caseId": "2443b04b-a4d8-43d1-843b-a31b0dd3c1a9",
 *     "creatorId": "test1@gmail.com",
 *     "premisesId": "8e5ac210-7c07-4dde-8ed2-f0d2b9f23699",
 *     "premisesName": "130 W 3rd St # 1203_New York NY 10012-1296",
 *     "stage": 0,
 *     "caseType": 1,
 *     "clientType": 0,
 *     "clientId": "bdddb23a-e4bb-4cb1-84d4-077c8b209395",
 *     "clientName": "Woooo, Larry",
 *     "createAt": "2024-09-14T20:45:29.767Z",
 *     "closeAt": null,
 *     "closingDate": "2024-07-20T20:24:24.740Z",
 *     "mortgageContingencyDate": "2024-07-20T20:24:24.740Z",
 *     "additionalClients": [
 *       "738ffc97-299b-423a-b759-2116a402b18d",
 *       "86a6d1d3-9644-40cc-bec5-e2710567d882",
 *       "26ea9b74-b431-4b08-88cd-436ba25486bb"
 *     ],
 *     "contacts": [
 *       "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *       "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *     ],
 *  "additionalOrganizations": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *   "purchaserPrice": 1000000,
 *   "downPayment": 200000,
 *   "mortgageAmount": 800000,
 *   "sellersConcession": 10000,
 *   "referral": "Jack",
 *   "bank": "Chase",
 *   "personalNote": "This is a test case",
 * }
 */
router.post(
    "/reopen",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.reopenCase
)

/**
 * @api {post} v1/case/delete Delete a case
 * @apiName DeleteCase
 * @apiGroup Case
 * @apiDescription Delete a case by ID. **Note that all stages and tasks related to the case will be deleted as well**!
 *
 * @apiBody {String} caseId [REQUIRED] Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/delete",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.deleteCase
)


router.post(
    "/delete/all",
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    CaseController.deleteAllCases
)

module.exports = router;