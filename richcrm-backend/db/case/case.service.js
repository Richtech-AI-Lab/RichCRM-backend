const Case = require("./case.db");

class CaseService {
    async readCase(caseId) {
        const data = await Case.getCaseById(caseId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllCasesByCreatorId(creatorId, closed) {
        const data = await Case.getAllCasesByCreatorId(creatorId, closed);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesByClientId(clientId, creatorId, closed) {
        const data = await Case.getCasesByClientId(clientId, creatorId, closed);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesByContactId(contactId, creatorId, closed) {
        const data = await Case.getCasesByContactId(contactId, creatorId, closed);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesByOrganizationId(organizationId, creatorId, closed) {
        const data = await Case.getCasesByOrganizationId(organizationId, creatorId, closed);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readCaseByPresmisesIdAndClientId(premisesId, clientId, creatorId) {
        const data = await Case.getCaseByPremisesIdAndClientId(premisesId, clientId, creatorId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesByKeyword(keyword, creatorId, closed) {
        const data = await Case.getCasesByKeyword(keyword, creatorId, closed);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCases(creatorId) {
        const data = await Case.getAllCases(creatorId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createCase(c) {
        // Check if the case object is valid
        if (c.creatorId === undefined ||
            c.caseId === undefined ||
            c.premisesId === undefined ||
            c.stage === undefined ||
            c.caseType === undefined ||
            c.clientType === undefined
        ) {
            console.log("[CASE-Create] Invalid case object");
            return null;
        }

        const data = await Case.createCase(c);
        return data;
    }

    async updateCase(c) {
        // Check if the case object is valid
        if (c.caseId === undefined) {
            console.log("[CASE-Update] Invalid case object");
            return null;
        }

        const data = await Case.updateCase(c);
        return data;
    }

    async deleteCase(caseId) {
        // Check if the case ID is valid
        if (caseId === undefined) {
            console.log("[CASE-Delete] Invalid case ID");
            return null;
        }

        const data = await Case.deleteCase(caseId);
        return data;
    }
};

module.exports = new CaseService();