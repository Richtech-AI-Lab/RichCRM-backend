var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var PremisesController = require('../../controllers/premises');

const router = express.Router();

/**
 * @api {post} v1/premises/register Register a new premises
 * @apiName RegisterPremises
 * @apiGroup Premises
 * 
 * @apiBody {String} name Name of the Premises.
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * @apiBody {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {String} addressId Address ID of the Premises.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "name": "RichCRM",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "propertyType": 2
 * }
 * 
 */
router.post(
    "/register",
    check("name")
        .notEmpty()
        .withMessage("Name is required"),
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    check("propertyType")
        .notEmpty()
        .isInt()
        .withMessage("Property Type is required"),
    validate,
    PremisesController.createPremises
);


/**
 * @api {post} v1/premises/query/id Query premises by Premises ID
 * @apiName ReadPremises
 * @apiGroup Premises
 * 
 * @apiBody {String} premisesId Premises ID.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {Number} assessmentsPer Assessments Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * @apiSuccess {String} twoFamilyFirstFloorTenantId Client ID of the First Floor of the Two Family Premises.
 * @apiSuccess {String} twoFamilySecondFloorTenantId Client ID of the Second Floor of the Two Family Premises.
 * @apiSuccess {Boolean} needInspection Need Inspection.
 * @apiSuccess {Date} inspectionDate Inspection Date.
 * @apiSuccess {Date} receivedDate Inspection Received Date.
 * @apiSuccess {Boolean} needTermitesInspection Need Termites Inspection.
 * @apiSuccess {Number} annualPropertyTax Annual property tax.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"1820 NW 21st St #6A COMMERCIAL",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPer": 2,
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": true,
 *  "twoFamilyFirstFloorTenantId": "689f5eac-22ea-4363-bbe3-b8216abf0076",
 *  "twoFamilySecondFloorTenantId": "738ffc97-299b-423a-b759-2116a402b18d",
 *  "needInspection": true,
 *  "inspectionDate": "2024-07-20T20:24:24.740Z",
 *  "receivedDate": "2024-07-20T20:24:24.740Z",
 *  "needTermitesInspection": true,
 *  "annualPropertyTax": 10000
 * }
 * 
 */
router.post(
    "/query/id",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.getPremises
);


/**
 * @api {get} v1/premises/:premisesId Get a premises by Premises ID
 * @apiName GetPremises
 * @apiGroup Premises
 * 
 * @apiParam {String} premisesId Premises ID.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {Number} assessmentsPer Assessments Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * @apiSuccess {String} twoFamilyFirstFloorTenantId Client ID of the First Floor of the Two Family Premises.
 * @apiSuccess {String} twoFamilySecondFloorTenantId Client ID of the Second Floor of the Two Family Premises.
 * @apiSuccess {Boolean} needInspection Need Inspection.
 * @apiSuccess {Date} inspectionDate Inspection Date.
 * @apiSuccess {Date} receivedDate Inspection Received Date.
 * @apiSuccess {Boolean} needTermitesInspection Need Termites Inspection.
 * @apiSuccess {Number} annualPropertyTax Annual property tax.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"1820 NW 21st St #6A COMMERCIAL",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPer": 2,
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": true,
 *  "twoFamilyFirstFloorTenantId": "689f5eac-22ea-4363-bbe3-b8216abf0076",
 *  "twoFamilySecondFloorTenantId": "738ffc97-299b-423a-b759-2116a402b18d",
 *  "needInspection": true,
 *  "inspectionDate": "2024-07-20T20:24:24.740Z",
 *  "receivedDate": "2024-07-20T20:24:24.740Z",
 *  "needTermitesInspection": true,
 *  "annualPropertyTax": 10000
 * }
 * 
 */
router.get(
    "/:premisesId",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.getPremises
)


/**
 * @api {post} v1/premises/query/address Query premises by Address ID
 * @apiName QueryPremisesByAddressId
 * @apiGroup Premises
 * 
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {String} addressId Address ID of the Premises.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {Number} assessmentsPer Assessments Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * @apiSuccess {String} twoFamilyFirstFloorTenantId Client ID of the First Floor of the Two Family Premises.
 * @apiSuccess {String} twoFamilySecondFloorTenantId Client ID of the Second Floor of the Two Family Premises.
 * @apiSuccess {Boolean} needInspection Need Inspection.
 * @apiSuccess {Date} inspectionDate Inspection Date.
 * @apiSuccess {Date} receivedDate Inspection Received Date.
 * @apiSuccess {Boolean} needTermitesInspection Need Termites Inspection.
 * @apiSuccess {Number} annualPropertyTax Annual property tax.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"1820 NW 21st St #6A COMMERCIAL",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPer": 2,
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": true,
 *  "twoFamilyFirstFloorTenantId": "689f5eac-22ea-4363-bbe3-b8216abf0076",
 *  "twoFamilySecondFloorTenantId": "738ffc97-299b-423a-b759-2116a402b18d",
 *  "needInspection": true,
 *  "inspectionDate": "2024-07-20T20:24:24.740Z",
 *  "receivedDate": "2024-07-20T20:24:24.740Z",
 *  "needTermitesInspection": true,
 *  "annualPropertyTax": 10000
 * }
 * 
 */
router.post(
    "/query/address",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    PremisesController.readAllPremisesByAddressId
);


/**
 * @api {post} v1/premises/update Update a premises
 * @apiName UpdatePremises
 * @apiGroup Premises
 * 
 * @apiBody {String} premisesId Premises ID.
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * @apiBody {String} name Name of the Premises.
 * @apiBody {Number} block Block of the Premises.
 * @apiBody {Number} lot Lot of the Premises.
 * @apiBody {Number} section Section of the Premises.
 * @apiBody {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiBody {Boolean} vacantAtClosing Vacant at Closing.
 * @apiBody {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiBody {Boolean} hoa HOA.
 * @apiBody {Number} parkingSpaces Number of Parking Spaces.
 * @apiBody {Number} maintenanceFee Maintenance Fee.
 * @apiBody {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiBody {Number} assessments Assessments.
 * @apiBody {Number} assessmentsPer Assessments Per (0-Month, 1-Quarter, 2-Year).
 * @apiBody {String} managingCompany Managing Company.
 * @apiBody {Boolean} isTwoFamily Is Two Family.
 * @apiBody {String} twoFamilyFirstFloorTenantId Client ID of the First Floor of the Two Family Premises.
 * @apiBody {String} twoFamilySecondFloorTenantId Client ID of the Second Floor of the Two Family Premises.
 * @apiBody {Boolean} needInspection Need Inspection.
 * @apiBody {Date} inspectionDate Inspection Date.
 * @apiBody {Date} receivedDate Inspection Received Date.
 * @apiBody {Boolean} needTermitesInspection Need Termites Inspection.
 * @apiBody {Number} annualPropertyTax Annual property tax.
 * 
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} addressId Address ID of the Premises.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-HOUSE_SINGLE, 1-HOUSE_MULTI, 2-CONDO, 3-COMMERCIAL, 4-LAND, 5-CO_OP, 6-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {Number} assessmentsPer Assessments Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * @apiSuccess {String} twoFamilyFirstFloorTenantId Client ID of the First Floor of the Two Family Premises.
 * @apiSuccess {String} twoFamilySecondFloorTenantId Client ID of the Second Floor of the Two Family Premises.
 * @apiSuccess {Boolean} needInspection Need Inspection.
 * @apiSuccess {Date} inspectionDate Inspection Date.
 * @apiSuccess {Date} receivedDate Inspection Received Date.
 * @apiSuccess {Boolean} needTermitesInspection Need Termites Inspection.
 * @apiSuccess {Number} annualPropertyTax Annual property tax.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"1820 NW 21st St #6A COMMERCIAL",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPer": 2,
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": true,
 *  "twoFamilyFirstFloorTenantId": "689f5eac-22ea-4363-bbe3-b8216abf0076",
 *  "twoFamilySecondFloorTenantId": "738ffc97-299b-423a-b759-2116a402b18d",
 *  "needInspection": true,
 *  "inspectionDate": "2024-07-20T20:24:24.740Z",
 *  "receivedDate": "2024-07-20T20:24:24.740Z",
 *  "needTermitesInspection": true,
 *  "annualPropertyTax": 10000
 * }
 */
router.post(
    "/update",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    check("name")
        .notEmpty()
        .withMessage("Name is required"),
    check("section")
        .optional()
        .isInt()
        .withMessage("Section must be an integer"),
    check("propertyType")
        .optional()
        .isInt()
        .withMessage("Property Type must be an integer"),
    check("lot")
        .optional()
        .isInt()
        .withMessage("Lot must be an integer"),
    check("block")
        .optional()
        .isInt()
        .withMessage("Block must be an integer"),
    check("parkingSpaces")
        .optional()
        .isInt()
        .withMessage("Parking Spaces must be an integer"),
    check("maintenanceFee")
        .optional()
        .isInt()
        .withMessage("Maintenance Fee must be an integer"),
    check("maintenanceFeePer")
        .optional()
        .isInt()
        .withMessage("Maintenance Fee Per must be an integer"),
    check("assessments")
        .optional()
        .isInt()
        .withMessage("Assessments must be an integer"),
    check("assessmentsPer")
        .optional()
        .isInt()
        .withMessage("Assessments Per must be an integer"),
    check("twoFamilyFirstFloorTenantId")
        .optional()
        .isUUID()
        .withMessage("First Floor Tenant ID must be a UUID"),
    check("twoFamilySecondFloorTenantId")
        .optional()
        .isUUID()
        .withMessage("Second Floor Tenant ID must be a UUID"),
    check("needInspection")
        .optional()
        .isBoolean()
        .withMessage("Need Inspection must be a boolean"),
    check("needTermitesInspection")
        .optional()
        .isBoolean()
        .withMessage("Need Termites Inspection must be a boolean"),
    check("annualPropertyTax")
        .optional()
        .isNumeric()
        .withMessage("Annual Property Tax must be an integer"),
    validate,
    PremisesController.updatePremises
)


/**
 * @api {post} v1/premises/delete Delete a premises
 * @apiName DeletePremises
 * @apiGroup Premises
 * 
 * @apiBody {String} premisesId Premises ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 * 
 */
router.post(
    "/delete",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.deletePremises
);


module.exports = router;