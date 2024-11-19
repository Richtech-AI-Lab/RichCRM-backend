const CaseService = require('../db/case/case.service');
const UserService = require('../db/user/user.service');
const PremisesService = require('../db/premises/premises.service');
const ClientService = require('../db/client/client.service');
const ContactService = require('../db/contact/contact.service');
const StageService = require('../db/stage/stage.service');
const OrganizationService = require('../db/organization/organization.service');
const StageController = require('./stage');
const Types = require("../db/types");
const { v4: uuidv4 } = require('uuid');

class CaseController {

    constructor () {
        this.createCase = this.createCase.bind(this);
        this.updateCase = this.updateCase.bind(this);
        this.closeCase = this.closeCase.bind(this);
        this.deleteCase = this.deleteCase.bind(this);
        this.procCases = this.procCases.bind(this);
        this.readCase = this.readCase.bind(this);
        this.readAllCasesByCreatorId = this.readAllCasesByCreatorId.bind(this);
        this.readAllCasesByClientId = this.readAllCasesByClientId.bind(this);
        this.readAllCasesByContactId = this.readAllCasesByContactId.bind(this);
        this.readAllCasesByKeyword = this.readAllCasesByKeyword.bind(this);
    }

    async readCase(req, res) {
        const {caseId} = req.params;
        if (caseId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][readCase] Invalid case id'
            });
        }
        try {
            const c = await CaseService.readCase(caseId);
            if (c !== null) {
                const caseObj = await this.procCase(c);
                res.status(200).json({
                    status: "success",
                    data: [caseObj],
                    message: '[CaseController][readCase] Case retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][readCase] Case does not exist'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][readCase] Internal server error: ${error}`
            });
        }
    }

    async readAllCasesByCreatorId(req, res) {
        const { creatorId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByCreatorId(creatorId, closed);
            if (cases !== null) {
                caseList = await this.procCases(cases);
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByCreatorId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByCreatorId] Internal server error'
            });
        }
    }

    async readAllCasesByClientId(req, res) {
        const { clientId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByClientId(clientId, closed);
            if (cases !== null) {
                caseList = await this.procCases(cases);
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByClientId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByClientId] Internal server error'
            });
        }

    }

    async readAllCasesByContactId(req, res) {
        const { contactId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByContactId(contactId, closed);
            if (cases !== null) {
                caseList = await this.procCases(cases);
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByContactId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByContactId] Internal server error'
            });
        }

    }

    async readAllCasesByKeyword(req, res) {
        const { keyword, closed } = req.body;

        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByKeyword(keyword, closed);
            if (cases !== null) {
                caseList = await this.procCases(cases);
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByContactId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByContactId] Internal server error'
            });
        }
    }
    
    async createCase(req, res) {
        const {creatorId, premisesId, caseType, clientType, clientId, organizationId, stage, additionalClients, contacts, additionalOrganizations} = req.body;
        // Create the case object
        var caseObj = {
            creatorId: creatorId,
            createAt: new Date().toISOString(),
        }
        // Check if the creator id is valid
        if (creatorId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid creator id'
            });
        } else {
            try {
                const creator = await UserService.readUser(creatorId);
                if (creator === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Creator does not exist'
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Internal server error'
                });
            }
        }

        // Check if the case already exists
        var existingCase;
        if (clientId !== undefined && clientId !== "") {
            existingCase = await CaseService.readCaseByPresmisesIdAndClientId(premisesId, clientId);
        } else if (organizationId !== undefined && organizationId !== "") {
            existingCase = await CaseService.readCaseByPresmisesIdAndClientId(premisesId, organizationId);
        }
        if (existingCase !== null && existingCase.length > 0) {
            return res.status(400).json({
                status: "failed",
                data: [{
                    caseId: existingCase[0].CaseId,
                }],
                message: '[CaseController][createCase] Case already exists'
            });
        }

        // Check if the premises id is valid
        var premisesName;
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Premises does not exist'
                });
            }
            caseObj.premisesId = premisesId;
            caseObj.premisesName = premises.Name;
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] readPremises internal server error'
            });
        }

        // Check if the stage is valid
        const stageEnum = Types.castIntToEnum(Types.stage, stage);
        if (stageEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid stage'
            });
        }
        caseObj.stage = stage;

        // Check if the client type is valid
        const caseTypeEnum = Types.castIntToEnum(Types.caseType, caseType);
        if (caseTypeEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid case type'
            });
        }
        caseObj.caseType = caseType;

        // Check Client Type
        const clientTypeEnum = Types.castIntToEnum(Types.clientType, clientType);
        if (clientTypeEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid client type [INDIVIDUAL, COMPANY, TRUST]'
            });
        }
        caseObj.clientType = clientType;

        // Check if the buyerId / SellerId is valid -> Generate caseId
        try {
            switch (clientType) {
                case Types.clientType.INDIVIDUAL:
                    if (clientId === undefined || clientId === "") {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Client id is required [INDIVIDUAL]'
                        });
                    }
                    const client = await ClientService.readClient(clientId);
                    if (client === undefined || client === null) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Invalid Client id [INDIVIDUAL]'
                        });
                    } else {
                        caseObj.clientName = client.LastName + ", " + client.FirstName;
                        caseObj.clientId = clientId;
                        caseObj.caseId = generateCaseId(caseType, clientId, premisesId);
                        console.log(`[CaseController][createCase] Generated case id: ${caseObj.caseId}`);
                    }
                    break;
                case Types.clientType.COMPANY:
                case Types.clientType.TRUST:
                    if (organizationId === undefined || organizationId === "") {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Organization id is required [COMPANY, TRUST]'
                        });
                    }
                    const organization = await OrganizationService.readOrganization(organizationId);
                    if (organization === null || organization === undefined) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Invalid Organization id [COMPANY, TRUST]'
                        });
                    } else {
                        caseObj.clientName = organization.OrganizationName;
                        caseObj.organizationId = organizationId;
                        caseObj.caseId = generateCaseId(caseType, organizationId, premisesId);
                        console.log(`[CaseController][createCase] Generated case id: ${caseObj.caseId}`);
                    }
                    break;
                default:
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Invalid client type'
                    });
            }

            // Update additional clients list 
            if (additionalClients !== undefined && additionalClients.length > 0) {
                caseObj.additionalClients = await this.updateAdditionalClients(additionalClients);
            } else {
                caseObj.additionalClients = [];
            }

            // Update contacts list
            if (contacts !== undefined && contacts.length > 0) {
                caseObj.contacts = await this.updateAdditionalContacts(contacts);
            } else {
                caseObj.contacts = [];
            }

            // Update additional organizations list
            if (additionalOrganizations !== undefined && additionalOrganizations.length > 0) {
                caseObj.additionalOrganizations = await this.updateAdditionalOrganizations(additionalOrganizations);
            } else {
                caseObj.additionalOrganizations = [];
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][createCase] readClient internal server error: ${error}`
            });
        }
        
        

        try {
            const c = await CaseService.createCase(caseObj);
            if (c !== null) {

                // Create the stage
                var stageObj;
                const stageRet = await StageController.createStageByCaseIdAndStageType(c.CaseId, c.Stage);
                if (stageRet.status === "success") {
                    console.log(`[CaseController][createCase] Stage created successfully`);
                    stageObj = stageRet.data[0];
                } else {
                    await CaseService.deleteCase(c.CaseId);
                    return res.status(400).json(stageRet);
                }

                const caseProc = await this.procCase(c);
                res.status(200).json({
                    status: "success",
                    data: [caseProc],
                    message: '[CaseController][createCase] Case created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Case creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            await CaseService.deleteCase(caseObj.caseId);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][createCase] Internal server error: ${error}`
            });
        }
        res.end();
    }

    async updateCase(req, res) {
        const {
            caseId,
            creatorId,
            stage,
            premisesId,
            closeAt,
            closingDate,
            mortgageContingencyDate,
            additionalClients,
            contacts,
            additionalOrganizations,
            purchaserPrice,
            downPayment,
            mortgageAmount,
            sellersConcession,
            referral,
            bank,
            personalNote,
        } = req.body;

        // Check if the case id is valid
        if (caseId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid case id'
            });
        }
        try {
            // Check if the creator id is valid
            if (creatorId !== undefined) {
                const creator = await UserService.readUser(creatorId);
                if (creator === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Creator does not exist'
                    });
                }
            }

            // Get the existing case
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Case does not exist'
                });
            }

            var caseObj = {
                caseId: caseId,
                creatorId: creatorId,
                premisesId: existingCase.PremisesId,
                stage: existingCase.Stage,
                closingDate: existingCase.ClosingDate,
                closeAt: existingCase.CloseAt,
                mortgageContingencyDate: existingCase.MortgageContingencyDate,
                additionalClients: existingCase.AdditionalClients,
                contacts: existingCase.Contacts,
                caseType: existingCase.CaseType,
                clientType: existingCase.ClientType,
                clientId: existingCase.ClientId,
                clientName: existingCase.ClientName,
                organizationId: existingCase.OrganizationId,
                additionalOrganizations: existingCase.AdditionalOrganizations,
                purchaserPrice: existingCase.PurchaserPrice,
                downPayment: existingCase.DownPayment,
                mortgageAmount: existingCase.MortgageAmount,
                sellersConcession: existingCase.SellersConcession,
                referral: existingCase.Referral,
                bank: existingCase.Bank,
                personalNote: existingCase.PersonalNote,
            }

            console.log(caseObj);

            // Check if the stage is valid
            var stageObj;
            if (stage !== undefined) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Invalid stage'
                    });
                }

                // Update the stage
                if (stage !== existingCase.Stage) {
                    const stageRet = await StageController.createStageByCaseIdAndStageType(existingCase.CaseId, stage);
                    if (stageRet.status === "success") {
                        console.log(`[CaseController][updateCase] Stage created successfully`);
                        stageObj = stageRet.data[0];
                    } else {
                        return res.status(400).json(stageRet);
                    }
                } else {
                    const stages = await StageService.getStagesByCaseIdAndStageType(existingCase.CaseId, stage);
                    if (stages === null || stages.length === 0) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][updateCase] Stage does not exist'
                        });
                    } else {
                        stageObj = stages[0];
                    }
                }
                caseObj.stage = stage;
            } else {
                stageObj = await StageService.getStagesByCaseIdAndStageType(existingCase.CaseId, existingCase.Stage);
                if (stageObj === null || stageObj.length === 0) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Stage does not exist'
                    });
                } else {
                    stageObj = stageObj[0];
                }
            }

            // Check if the premises id is valid
            if (premisesId !== undefined && premisesId !== "") {
                const premises = await PremisesService.readPremises(premisesId);
                if (premises === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Premises does not exist'
                    });
                }
                caseObj.premisesId = premisesId;
                caseObj.premisesName = premises.Name;
            }

            // Check if the closing date is valid
            if (closingDate !== undefined && closingDate !== "") {
                caseObj.closingDate = new Date(closingDate).toISOString();
            }

            // Check if the close at date is valid
            if (closeAt !== undefined && closeAt !== "") {
                caseObj.closeAt = new Date(closeAt).toISOString();
            }

            // Check if the mortgage contingency date is valid
            if (mortgageContingencyDate !== undefined && mortgageContingencyDate !== "") {
                caseObj.mortgageContingencyDate = new Date(mortgageContingencyDate).toISOString();
            }

            // Update additional clients list 
            if (additionalClients !== undefined && additionalClients.length > 0) {
                caseObj.additionalClients = await this.updateAdditionalClients(additionalClients);
            }

            // Update contacts list
            if (contacts !== undefined && contacts.length > 0) {
                caseObj.contacts = await this.updateAdditionalContacts(contacts);
            }

            // Update additional organizations list
            if (additionalOrganizations !== undefined && additionalOrganizations.length > 0) {
                caseObj.additionalOrganizations = await this.updateAdditionalOrganizations(additionalOrganizations);
            }

            // Update purchaser price
            if (purchaserPrice !== undefined && purchaserPrice !== "" && purchaserPrice > 0) {
                caseObj.purchaserPrice = purchaserPrice;
            }

            // Update down payment
            if (downPayment !== undefined && downPayment !== "" && downPayment > 0) {
                caseObj.downPayment = downPayment;
            }

            // Update mortgage amount
            if (mortgageAmount !== undefined && mortgageAmount !== "" && mortgageAmount > 0) {
                caseObj.mortgageAmount = mortgageAmount;
            }

            // Update sellers concession
            if (sellersConcession !== undefined && sellersConcession !== "" && sellersConcession > 0) {
                caseObj.sellersConcession = sellersConcession;
            }

            // Update referral
            if (referral !== undefined && referral !== "") {
                caseObj.referral = referral;
            }

            // Update bank
            if (bank !== undefined && bank !== "") {
                caseObj.bank = bank;
            }

            // Update personal note
            if (personalNote !== undefined && personalNote !== "") {
                caseObj.personalNote = personalNote;
            }


            // Update the case
            const c = await CaseService.updateCase(caseObj);
            if (c !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [caseObj],
                    message: '[CaseController][updateCase] Case updated successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Case update failed'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][updateCase] Internal server error: ${error}`
            });
        }
    }

    async closeCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CaseController][closeCase] Invalid case id");
            return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][closeCase] Case does not exist'
                });
            }
            const c = await CaseService.updateCase({
                caseId: caseId,
                creatorId: existingCase.CreatorId,
                closeAt: new Date().toISOString()
            });
            if (c !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": caseId,
                        "creatorId": existingCase.CreatorId,
                        "premisesId": existingCase.PremisesId,
                        "premisesName": existingCase.PremisesName,
                        "stage": existingCase.Stage,
                        "caseType": existingCase.CaseType,
                        "clientType": existingCase.ClientType,
                        "clientId": existingCase.ClientId,
                        "organizationId": existingCase.OrganizationId,
                        "clientName": existingCase.ClientName,
                        "createAt": existingCase.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": existingCase.ClosingDate,
                        "mortgageContingencyDate": existingCase.MortgageContingencyDate,
                        "additionalClients": existingCase.AdditionalClients,
                        "contacts": existingCase.Contacts,
                        "additionalOrganizations": existingCase.AdditionalOrganizations,
                        "purchaserPrice": existingCase.PurchaserPrice,
                        "downPayment": existingCase.DownPayment,
                        "mortgageAmount": existingCase.MortgageAmount,
                        "sellersConcession": existingCase.SellersConcession,
                        "referral": existingCase.Referral,
                        "bank": existingCase.Bank,
                        "personalNote": existingCase.PersonalNote
                    }],
                    message: '[CaseController][closeCase] Case closed successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][closeCase] Case close failed'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][closeCase] Internal server error: ${error}`
            });
        }
    }

    async deleteCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CaseController][deleteCase] Invalid case id");
            return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][deleteCase] Case does not exist'
                });
            }
            await CaseService.deleteCase(caseId);
            // Delete all stages in the case
            await StageController.deleteStagesByCaseId(caseId);
            return res.status(200).json({
                status: "success",
                data: [],
                message: '[CaseController][deleteCase] Case deleted successfully'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][deleteCase] Internal server error: ${error}`
            });
        }
    }

    // [Debugging Functions]
    async deleteAllCases(req, res) {
        const { creatorId } = req.body;
        if (creatorId === undefined) {
            console.log("[CaseController][DeleteAllCases] Invalid creator id");
            return null;
        }
        try {
            var cases = await CaseService.readAllCasesByCreatorId(creatorId, false);
            if (cases !== null) {
                for (let i = 0; i < cases.length; i++) {
                    await CaseService.deleteCase(cases[i].CaseId);
                    await StageController.deleteStagesByCaseId(cases[i].CaseId);
                }
            }
            cases = await CaseService.readAllCasesByCreatorId(creatorId, true);
            if (cases !== null) {
                for (let i = 0; i < cases.length; i++) {
                    await CaseService.deleteCase(cases[i].CaseId);
                    await StageController.deleteStagesByCaseId(cases[i].CaseId);
                }
            }
            return res.status(200).json({
                status: "success",
                data: [],
                message: '[CaseController][DeleteAllCases] Cases deleted successfully'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][DeleteAllCases] Internal server error: ${error}`
            });
        }
    }

    // Update additional clients list
    async updateAdditionalClients(additionalClients) {
        if (additionalClients === undefined || additionalClients === null) {
            additionalClients = [];
        }
        var additionalClientIds = [];
        for (let i = 0; i < additionalClients.length; i++) {
            const client = await ClientService.readClient(additionalClients[i]);
            if (client === null) {
                console.log(`[CaseController][updateAdditionalClients] Invalid additional client id ${additionalClients[i]}`);
            } else {
                additionalClientIds.push(additionalClients[i]);
            }
        }
        return additionalClientIds;
    }

    // Update contacts list
    async updateAdditionalContacts(contacts) {
        var contactIds = [];
        if (contacts === undefined || contacts === null) {
            contacts = [];
        }
        for (let i = 0; i < contacts.length; i++) {
            const contact = await ContactService.readContact(contacts[i]);
            if (contact === null) {
                console.log(`[CaseController][updateAdditionalContacts] Invalid contact id ${contacts[i]}`);
            } else {
                contactIds.push(contacts[i]);
            }
        }
        return contactIds;
    }

    // Update additional organizations list
    async updateAdditionalOrganizations(additionalOrganizations) {
        if (additionalOrganizations === undefined || additionalOrganizations === null) {
            additionalOrganizations = [];
        }
        var additionalOrganizationIds = [];
        for (let i = 0; i < additionalOrganizations.length; i++) {
            const organization = await OrganizationService.readOrganization(additionalOrganizations[i]);
            if (organization === null) {
                console.log(`[CaseController][updateAdditionalOrganizations] Invalid additional organization id ${additionalOrganizations[i]}`);
            } else {
                additionalOrganizationIds.push(additionalOrganizations[i]);
            }
        }
        return additionalOrganizationIds;
    }

    // Extract case from list
    async procCase(c) {
        const stage = await StageService.getStagesByCaseIdAndStageType(c.CaseId, c.Stage);
        if (stage === null || stage.length === 0) {
            console.log(`[CaseController][procCase] Stage does not exist for case: ${c.CaseId}`);
        }
        return {
            "caseId": c.CaseId,
            "creatorId": c.CreatorId,
            "premisesId": c.PremisesId,
            "premisesName": c.PremisesName,
            "stage": c.Stage,
            "caseStatus": stage[0].StageStatus,
            "stageId": stage[0].StageId,
            "caseType": c.CaseType,
            "clientType": c.ClientType,
            "clientId": c.ClientId,
            "clientName": c.ClientName,
            "organizationId": c.OrganizationId,
            "createAt": c.CreateAt,
            "closeAt": c.CloseAt,
            "closingDate": c.ClosingDate,
            "mortgageContingencyDate": c.MortgageContingencyDate,
            "additionalClients": c.AdditionalClients,
            "contacts": c.Contacts,
            "additionalOrganizations": c.AdditionalOrganizations,
            "purchaserPrice": c.PurchaserPrice,
            "downPayment": c.DownPayment,
            "mortgageAmount": c.MortgageAmount,
            "sellersConcession": c.SellersConcession,
            "referral": c.Referral,
            "bank": c.Bank,
            "personalNote": c.PersonalNote,
        };
    }
    async procCases(cases) {
        var caseList = [];
        if (cases !== null) {
            for (let i = 0; i < cases.length; i++) {
                const c = cases[i];
                caseList.push(await this.procCase(c));
            }
        }
        return caseList;
    }
}

const generateCaseId = (caseType, clientId, premisesId) => {
    console.log(`[CaseController][generateCaseId] Generating case id for client type: ${caseType}, client id: ${clientId}, premises id: ${premisesId}`);
    // return `${caseType}_${clientId}_${premisesId}`;
    return uuidv4();
}

module.exports = new CaseController();
