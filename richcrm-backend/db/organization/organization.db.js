/**
 * Author: Eden Wu
 * Date: 2024-10-02
 * Database Model of Organization
 * 
 * @typedef {object} Organization
 * @property {string} OrganizationId - Organization ID
 * @property {string} OrganizationName - Name of the organization
 * @property {organizationType} OrganizationType - Type of the organization
 * @property {string} CellNumber - Organization's cell phone number
 * @property {string} Email - Organization's email address
 * @property {string} Website - Organization's website
 * @property {string} AddressId - Foreign key to Address
 */

const db = require("../dynamodb");
const { organizationType } = require("../types");


class Organization {
    constructor() {
        this.table = "Organization";
    }

    async getOrganizationById(organizationId) {
        const params = {
            TableName: this.table,
            Key: {
                OrganizationId: organizationId,
            },
        };
        const data = await db.get(params);
        return data;
    }

    async getAllOrganizations() {
        const params = {
            TableName: this.table,
        };
        const data = await db.scan(params);
        return data;
    }

    async getOrganizationByType(organizationType) {
        const params = {
            TableName: this.table,
            FilterExpression: "OrganizationType = :t",
            ExpressionAttributeValues: {
                ":t": organizationType,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async getOrganizationByKeyword(keyword) {
        const params = {
            TableName: this.table,
            FilterExpression: "contains(OrganizationName, :k)",
            ExpressionAttributeValues: {
                ":k": keyword,
            },
        };
        const data = await db.scan(params);
        return data;
    }

    async createOrganization(organization) {
        const params = {
            TableName: this.table,
            Item: {
                OrganizationId: organization.organizationId,
                OrganizationName: organization.organizationName,
                OrganizationType: organization.organizationType,
                CellNumber: organization.cellNumber,
                Email: organization.email,
                Website: organization.website,
                AddressId: organization.addressId,
            },
        };
        await db.put(params);
        return params.Item;
    }

    async updateOrganization(organization) {
        const params = {
            TableName: this.table,
            Key: {
                OrganizationId: organization.organizationId,
            },
            UpdateExpression: "set OrganizationType = :t",
            ExpressionAttributeValues: {
                ":t": organization.organizationType,
            },
            ReturnValues: "UPDATED_NEW",
        };
        // Optional fields
        if (organization.organizationName) {
            params.UpdateExpression += ", OrganizationName = :n";
            params.ExpressionAttributeValues[":n"] = organization.organizationName;
        }
        if (organization.cellNumber) {
            params.UpdateExpression += ", CellNumber = :c";
            params.ExpressionAttributeValues[":c"] = organization.cellNumber;
        }
        if (organization.email) {
            params.UpdateExpression += ", Email = :e";
            params.ExpressionAttributeValues[":e"] = organization.email;
        }
        if (organization.website) {
            params.UpdateExpression += ", Website = :w";
            params.ExpressionAttributeValues[":w"] = organization.website;
        }
        if (organization.addressId) {
            params.UpdateExpression += ", AddressId = :a";
            params.ExpressionAttributeValues[":a"] = organization.addressId;
        }

        const data = await db.update(params);
        return data.Attributes;
    }

    async deleteOrganization(organizationId) {
        const params = {
            TableName: this.table,
            Key: {
                OrganizationId: organizationId,
            },
        };
        const data = await db.delete(params);
        return data;
    }
}

module.exports = new Organization();