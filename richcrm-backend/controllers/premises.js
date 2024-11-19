const PremisesService = require('../db/premises/premises.service');
const AddressService = require('../db/address/address.service');
const ClientService = require('../db/client/client.service');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class PremisesController {

    constructor() {
        this.readAllPremisesByAddressId = this.readAllPremisesByAddressId.bind(this);
        this.getPremises = this.getPremises.bind(this);
        this.createPremises = this.createPremises.bind(this);
        this.updatePremises = this.updatePremises.bind(this);
        this.deletePremises = this.deletePremises.bind(this);
        this.procPremisesList = this.procPremisesList.bind(this);
    }

    async readAllPremisesByAddressId(req, res) {
        const { addressId } = req.body;
        try {
            var premisesList = [];
            const premises = await PremisesService.readPremisesByAddressId(addressId);
            if (premises !== null) {
                premisesList = await this.procPremisesList(premises);
            }
            res.status(200).json({
                status: "success",
                data: premisesList,
                message: '[PremisesController][readAllPremisesByAddressId] Successfully retrieved all premises by addressId',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][readAllPremisesByAddressId] Internal server error',
            });
        }
    }


    async getPremises(req, res) {
        var premisesId;
        if (!req.params.premisesId) {
            premisesId = req.body.premisesId;
        } else {
            premisesId = req.params.premisesId;
        }
        
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][getPremises] Premises not found',
                });
            }
            const premisesObj = await this.procPremises(premises);
            res.status(200).json({
                status: "success",
                data: [premisesObj],
                message: '[PremisesController][getPremises] Successfully retrieved premises',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][getPremises] Internal server error',
            });
        }
    }

    async createPremises(req, res) {
        const {
            name,
            addressId,
            propertyType,
        } = req.body;

        try {
            // Check if the address exists
            const address = await AddressService.readAddress(addressId);
            if (address === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Address not found',
                });
            }

            // Check if the property type is valid
            const propertyTypeEnum = Types.castIntToEnum(Types.propertyType, propertyType);
            if (propertyTypeEnum === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Invalid property type',
                });
            }

            // Parse premises ID and name
            var addressLine2 = address.AddressLine2;
            if (addressLine2 === undefined) {
                addressLine2 = '';
            }
            const premisesName = `${address.AddressLine1}`;

            const premises = {
                premisesId: uuidv4(),
                name: premisesName,
                addressId: addressId,
                propertyType: propertyType,
            };

            const p = await PremisesService.createPremises(premises);
            if (p !== null) {
                const premisesObj = await this.procPremises(p);
                res.status(200).json({
                    status: "success",
                    data: [premisesObj],
                    message: '[PremisesController][createPremises] Successfully created premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Internal server error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[PremisesController][createPremises] Internal server error: ${error}`,
            });
        }
    }

    async updatePremises(req, res) {
        const {
            premisesId,
            name,
            addressId,
            block,
            lot,
            section,
            propertyType,
            vacantAtClosing,
            subjectToTenancy,
            hoa,
            parkingSpaces,
            maintenanceFee,
            maintenanceFeePer,
            assessments,
            assessmentsPer,
            managingCompany,
            isTwoFamily,
            twoFamilyFirstFloorTenantId,
            twoFamilySecondFloorTenantId,
            needInspection,
            inspectionDate,
            receivedDate,
            needTermitesInspection,
            annualPropertyTax,
        } = req.body;

        try {
            // Get the premises object
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][updatePremises] Premises not found',
                });
                return;
            }

            var premisesObj = {
                premisesId: premisesId,
                name: premises.Name,
                addressId: premises.AddressId,
                block: premises.Block,
                lot: premises.Lot,
                section: premises.Section,
                propertyType: premises.PropertyType,
                vacantAtClosing: premises.VacantAtClosing,
                subjectToTenancy: premises.SubjectToTenancy,
                hoa: premises.HOA,
                parkingSpaces: premises.ParkingSpaces,
                maintenanceFee: premises.MaintenanceFee,
                maintenanceFeePer: premises.MaintenanceFeePer,
                assessments: premises.Assessments,
                assessmentsPer: premises.AssessmentsPer,
                managingCompany: premises.ManagingCompany,
                isTwoFamily: premises.IsTwoFamily,
                twoFamilyFirstFloorTenantId: premises.TwoFamilyFirstFloorTenantId,
                twoFamilySecondFloorTenantId: premises.TwoFamilySecondFloorTenantId,
                annualPropertyTax: premises.AnnualPropertyTax,
            };

            console.log(premisesObj);


            // Check if the premises exists
            if (premisesId !== undefined) {
                const premises = await PremisesService.readPremises(premisesId);
                if (premises === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Premises not found',
                    });
                    return;
                }
                premisesObj.premisesId = premisesId;
            }

            // Check if the address exists
            if (addressId !== undefined) {
                const address = await AddressService.readAddress(addressId);
                if (address === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Address not found',
                    });
                    return;
                }
                premisesObj.addressId = addressId;
            }

            // Check if the property type is valid
            if (propertyType !== undefined) {
                const propertyTypeEnum = Types.castIntToEnum(Types.propertyType, propertyType);
                if (propertyTypeEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Invalid property type',
                    });
                }
                premisesObj.propertyType = propertyType;
            }

            // Update name
            if (name !== undefined) {
                premisesObj.name = name;
            }

            // Update block
            if (block !== undefined) {
                premisesObj.block = block;
            }

            // Update lot
            if (lot !== undefined) {
                premisesObj.lot = lot;
            }

            // Update section
            if (section !== undefined) {
                premisesObj.section = section;
            }

            // Update vacantAtClosing
            if (vacantAtClosing !== undefined) {
                premisesObj.vacantAtClosing = vacantAtClosing;
            }

            // Update subjectToTenancy
            if (subjectToTenancy !== undefined) {
                premisesObj.subjectToTenancy = subjectToTenancy;
            }

            // Update hoa
            if (hoa !== undefined) {
                premisesObj.hoa = hoa;
            }

            // Update parkingSpaces
            if (parkingSpaces !== undefined) {
                premisesObj.parkingSpaces = parkingSpaces;
            }

            // Update maintenanceFee
            if (maintenanceFee !== undefined) {
                premisesObj.maintenanceFee = maintenanceFee;
            }

            // Update maintenanceFeePer
            if (maintenanceFeePer !== undefined) {
                const maintenanceFeePerEnum = Types.castIntToEnum(Types.maintenanceFeePer, maintenanceFeePer);
                if (maintenanceFeePerEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Invalid maintenance fee per',
                    });
                }

                premisesObj.maintenanceFeePer = maintenanceFeePer;
            }

            // Update assessments
            if (assessments !== undefined) {
                premisesObj.assessments = assessments;
            }

            // Update assessmentsPer
            if (assessmentsPer !== undefined) {
                const assessmentsPerEnum = Types.castIntToEnum(Types.maintenanceFeePer, assessmentsPer);
                if (assessmentsPerEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Invalid assessments per',
                    });
                }

                premisesObj.assessmentsPer = assessmentsPer;
            }

            // Update managingCompany
            if (managingCompany !== undefined) {
                premisesObj.managingCompany = managingCompany;
            }

            // Update isTwoFamily
            if (isTwoFamily !== undefined) {
                premisesObj.isTwoFamily = isTwoFamily;
            }

            // Update twoFamilyFirstFloorTenantId
            if (twoFamilyFirstFloorTenantId !== undefined) {
                const client = await ClientService.readClient(twoFamilyFirstFloorTenantId);
                if (client === null) {
                    // res.status(400).json({
                    //     status: "failed",
                    //     data: [],
                    //     message: '[PremisesController][updatePremises] Two-family first floor tenant not found',
                    // });
                    console.log("[PremisesController][updatePremises] Two-family first floor tenant not found");
                } else {
                    premisesObj.twoFamilyFirstFloorTenantId = twoFamilyFirstFloorTenantId;
                }
            }

            // Update twoFamilySecondFloorTenantId
            if (twoFamilySecondFloorTenantId !== undefined) {
                const client = await ClientService.readClient(twoFamilySecondFloorTenantId);
                if (client === null) {
                    // res.status(400).json({
                    //     status: "failed",
                    //     data: [],
                    //     message: '[PremisesController][updatePremises] Two-family second floor tenant not found',
                    // });
                    console.log("[PremisesController][updatePremises] Two-family second floor tenant not found");
                } else {
                    premisesObj.twoFamilySecondFloorTenantId = twoFamilySecondFloorTenantId;
                }
            }

            // Update needInspection
            if (needInspection !== undefined) {
                premisesObj.needInspection = needInspection;
            }

            // Update inspectionDate
            if (inspectionDate !== undefined && inspectionDate !== "") {
                premisesObj.inspectionDate = new Date(inspectionDate).toISOString();
            }

            // Update receivedDate
            if (receivedDate !== undefined && receivedDate !== "") {
                premisesObj.receivedDate = new Date(receivedDate).toISOString();
            }

            // Update needTermitesInspection
            if (needTermitesInspection !== undefined) {
                premisesObj.needTermitesInspection = needTermitesInspection;
            }

            // Update annualPropertyTax
            // Update annual property tax
            if (annualPropertyTax !== undefined && annualPropertyTax !== "" && annualPropertyTax > 0) {
                premisesObj.annualPropertyTax = annualPropertyTax;
            }

            const p = await PremisesService.updatePremises(premisesObj);
            if (p !== null) {
                res.status(200).json({
                    status: "success",
                    data: [premisesObj],
                    message: '[PremisesController][updatePremises] Successfully updated premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][updatePremises] Internal server error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][updatePremises] Internal server error',
            });
        }
    }

    async deletePremises(req, res) {
        const { premisesId } = req.body;
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][deletePremises] Premises not found',
                });
            }

            const data = await PremisesService.deletePremises(premisesId);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[PremisesController][deletePremises] Successfully deleted premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][deletePremises] DeletePremises error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][deletePremises] Internal server error',
            });
        }
    }

    // Extract premises data
    async procPremises(p) {
        return {
            premisesId: p.PremisesId,
            addressId: p.AddressId,
            name: p.Name,
            block: p.Block,
            lot: p.Lot,
            section: p.Section,
            propertyType: p.PropertyType,
            vacantAtClosing: p.VacantAtClosing,
            subjectToTenancy: p.SubjectToTenancy,
            hoa: p.HOA,
            parkingSpaces: p.ParkingSpaces,
            maintenanceFee: p.MaintenanceFee,
            maintenanceFeePer: p.MaintenanceFeePer,
            assessments: p.Assessments,
            assessmentsPer: p.AssessmentsPer,
            managingCompany: p.ManagingCompany,
            isTwoFamily: p.IsTwoFamily,
            twoFamilyFirstFloorTenantId: p.TwoFamilyFirstFloorTenantId,
            twoFamilySecondFloorTenantId: p.TwoFamilySecondFloorTenantId,
            needInspection: p.NeedInspection,
            inspectionDate: p.InspectionDate,
            receivedDate: p.ReceivedDate,
            needTermitesInspection: p.NeedTermitesInspection,
            annualPropertyTax: p.AnnualPropertyTax,
        };
    }

    async procPremisesList(premises) {
        var premisesList = [];
        if (premises !== null) {
            for (let i = 0; i < premises.length; i++) {
                const p = premises[i];
                premisesList.push(await this.procPremises(p));
            }
        }
        return premisesList;
    }
}

module.exports = new PremisesController();