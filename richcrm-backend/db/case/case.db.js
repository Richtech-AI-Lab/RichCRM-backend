/**
 * Author: Eden Wu
 * Date: 2024-07-11
 * Database Model of Case
 * 
 * @typedef {object} Case
 * @property {string} CaseId - Case ID
 * @property {string} CreatorId - Foreign key to User who created this case
 * @property {string} PremisesId - Foreign key to Premises
 * @property {string} PremisesName - Name of the premises (for searching purposes)
 * @property {caseType} CaseType - Is this case for buyside or sellside clients? (0-PURCHASING, 1-SELLING)
 * @property {clientType} ClientType - Client Type (0-INDIVIDUAL, 1-COMPANY, 2-TRUST)
 * @property {string} ClientId - Foreign key to Buyers or Sellers
 * @property {string} OrganizationId - Foreign key to Organization
 * @property {string} ClientName - Name of the client (for searching purposes)
 * @property {Date} CreateAt - When this case was created
 * @property {Date} CloseAt - When this case was closed
 * @property {Date} ClosingDate - When this case should be closed
 * @property {Date} MortgageContingencyDate - When should the mortgage contingency be removed
 * @property {stage} Stage - The stage of this case(0-SETUP, 1-CONTRACT_PREPARING, 2-CONTRACT_SIGNING, 3-MORTGAGE, 4-CLOSING)
 * @property {array} AdditionalClients - Additional clients in this case
 * @property {array} Contacts - Contacts in this case (e.g. attorney, bank attorney, realtors)
 * @property {array} AdditionalOrganizations - Additional organizations in this case
 * @property {float} PurchaserPrice - Purchaser's price
 * @property {float} DownPayment - Down payment
 * @property {float} MortgageAmount - Mortgage amount
 * @property {float} SellersConcession - Seller's concession
 * @property {string} Referral - Referral in this case
 * @property {string} Bank - Bank in this case
 * @property {string} PersonalNote - Personal note for this case
 */

const db = require("../dynamodb");
const { stage, caseType, clientType } = require("../types");

class Case {
    constructor() {
        this.table = "Case";
    }

    async getCaseById(caseId) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: caseId,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async getAllCasesByCreatorId(creatorId, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "CreatorId = :c",
            ExpressionAttributeValues: {
                ":c": creatorId,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        } else {
            params.FilterExpression += " AND NOT attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getCasesByClientId(clientId, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "(ClientId = :c OR contains(AdditionalClients, :c))",
            ExpressionAttributeValues: {
                ":c": clientId,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        } else {
            params.FilterExpression += " AND NOT attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getCasesByOrganizationId(organizationId, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "OrganizationId = :o OR contains(AdditionalOrganizations, :o)",
            ExpressionAttributeValues: {
                ":o": organizationId,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        } else {
            params.FilterExpression += " AND NOT attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getCasesByContactId(contactId, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "(contains(Contacts, :c) OR contains(AdditionalClients, :c) OR ClientId = :c OR OrganizationId = :c OR contains(AdditionalOrganizations, :c))",
            ExpressionAttributeValues: {
                ":c": contactId,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        } else {
            params.FilterExpression += " AND NOT attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getCaseByPremisesIdAndClientId(premisesId, clientId) {
        const params = {
            TableName: this.table,
            FilterExpression: "PremisesId = :p AND (ClientId = :c OR OrganizationId = :c)",
            ExpressionAttributeValues: {
                ":p": premisesId,
                ":c": clientId,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async getCasesByKeyword(keyword, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "(contains(ClientName, :k) OR contains(PremisesName, :k))",
            ExpressionAttributeValues: {
                ":k": keyword,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        } else {
            params.FilterExpression += " AND NOT attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getAllCases() {
        const params = {
            TableName: this.table,
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async createCase(c) {
        const params = {
            TableName: this.table,
            Item: {
                CaseId: c.caseId,
                CreatorId: c.creatorId,
                PremisesId: c.premisesId,
                PremisesName: c.premisesName,
                CaseType: c.caseType,
                ClientId: c.clientId,
                ClientName: c.clientName,
                ClientType: c.clientType,
                OrganizationId: c.organizationId,
                CreateAt: c.createAt,
                CloseAt: c.closeAt,
                ClosingDate: c.closingDate,
                MortgageContingencyDate: c.mortgageContingencyDate,
                Stage: c.stage,
                AdditionalClients: c.additionalClients,
                Contacts: c.contacts,
                AdditionalOrganizations: c.additionalOrganizations,
            },
        };
        await db.put(params).promise();
        return params.Item;
    }

    async updateCase(c) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: c.caseId,
            },
            UpdateExpression: "",
            ExpressionAttributeValues: {},
            ReturnValues: "UPDATED_NEW",
        };
        var updateExpressions = [];
        // Optional fields
        if (c.creatorId !== undefined) {
            params.ExpressionAttributeValues[':c'] = c.creatorId;
            updateExpressions.push('CreatorId = :c');
        }

        if (c.premisesId !== undefined) {
            params.ExpressionAttributeValues[':p'] = c.premisesId;
            updateExpressions.push('PremisesId = :p');
        }

        if (c.premisesName !== undefined) {
            params.ExpressionAttributeValues[':pn'] = c.premisesName;
            updateExpressions.push('PremisesName = :pn');
        }

        if (c.ClientName !== undefined) {
            params.ExpressionAttributeValues[':cn'] = c.clientName;
            updateExpressions.push('ClientName = :cn');
        }

        if (c.closeAt !== undefined) {
            params.ExpressionAttributeValues[':ca'] = c.closeAt;
            updateExpressions.push('CloseAt = :ca');
        }

        if (c.closingDate !== undefined) {
            params.ExpressionAttributeValues[':cd'] = c.closingDate;
            updateExpressions.push('ClosingDate = :cd');
        }

        if (c.mortgageContingencyDate !== undefined) {
            params.ExpressionAttributeValues[':mc'] = c.mortgageContingencyDate;
            updateExpressions.push('MortgageContingencyDate = :mc');
        }

        if (c.stage !== undefined) {
            params.ExpressionAttributeValues[':s'] = c.stage;
            updateExpressions.push('#stg = :s');
            params.ExpressionAttributeNames = {'#stg': "Stage"};
        }

        if (c.additionalClients !== undefined) {
            params.ExpressionAttributeValues[':ac'] = c.additionalClients;
            updateExpressions.push('AdditionalClients = :ac');
        }

        if (c.contacts !== undefined) {
            params.ExpressionAttributeValues[':ct'] = c.contacts;
            updateExpressions.push('Contacts = :ct');
        }

        if (c.clientId !== undefined) {
            params.ExpressionAttributeValues[':ci'] = c.clientId;
            updateExpressions.push('ClientId = :ci');
        }

        if (c.organizationId !== undefined) {
            params.ExpressionAttributeValues[':oi'] = c.organizationId;
            updateExpressions.push('OrganizationId = :oi');
        }

        if (c.additionalOrganizations !== undefined) {
            params.ExpressionAttributeValues[':ao'] = c.additionalOrganizations;
            updateExpressions.push('AdditionalOrganizations = :ao');
        }

        if (c.purchaserPrice !== undefined) {
            params.ExpressionAttributeValues[':pp'] = c.purchaserPrice;
            updateExpressions.push('PurchaserPrice = :pp');
        }

        if (c.downPayment !== undefined) {
            params.ExpressionAttributeValues[':dp'] = c.downPayment;
            updateExpressions.push('DownPayment = :dp');
        }

        if (c.mortgageAmount !== undefined) {
            params.ExpressionAttributeValues[':ma'] = c.mortgageAmount;
            updateExpressions.push('MortgageAmount = :ma');
        }

        if (c.sellersConcession !== undefined) {
            params.ExpressionAttributeValues[':sc'] = c.sellersConcession;
            updateExpressions.push('SellersConcession = :sc');
        }

        if (c.referral !== undefined) {
            params.ExpressionAttributeValues[':rf'] = c.referral;
            updateExpressions.push('Referral = :rf');
        }

        if (c.bank !== undefined) {
            params.ExpressionAttributeValues[':b'] = c.bank;
            updateExpressions.push('Bank = :b');
        }

        if (c.personalNote !== undefined) {
            params.ExpressionAttributeValues[':pn'] = c.personalNote;
            updateExpressions.push('PersonalNote = :pn');
        }


        if (updateExpressions.length > 0) {
            params.UpdateExpression = "SET " + updateExpressions.join(", ");
        } else {
            return null;
        }
        const data = await db.update(params).promise();
        return data.Attributes;
    }

    async deleteCase(caseId) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: caseId,
            },
        };
        await db.delete(params).promise();
    }

}

module.exports = new Case();