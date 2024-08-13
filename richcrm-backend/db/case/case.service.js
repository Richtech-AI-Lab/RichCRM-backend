const Case = require("./case.db");

class CaseService {
    async readCase(caseId) {
        const data = await Case.getCaseById(caseId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllCasesByBuyerId(buyerId) {
        const data = await Case.getAllCasesByBuyerId(buyerId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesBySellerId(sellerId) {
        const data = await Case.getAllCasesBySellerId(sellerId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCasesByCreatorId(creatorId) {
        const data = await Case.getAllCasesByCreatorId(creatorId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllCases() {
        const data = await Case.getAllCases();

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
            c.caseType === undefined) {
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