var ClientService = require("../db/client/client.service");
var AddressService = require("../db/address/address.service");
var TagService = require("../db/tag/tag.service");
var OrganizationService = require("../db/organization/organization.service");
const { v4: uuidv4 } = require('uuid');
const Types = require("../db/types");

class ClientController {
    constructor () {
        this.registerClient = this.registerClient.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.getClient = this.getClient.bind(this);
        this.getAllClients = this.getAllClients.bind(this);
        this.queryClients = this.queryClients.bind(this);
        this.queryClientsByType = this.queryClientsByType.bind(this);
        this.queryClientsByTag = this.queryClientsByTag.bind(this);
        this.procClients = this.procClients.bind(this);
    }

    async registerClient(req, res) {
        const { clientId, clientType, title, tags, firstName, lastName, gender, cellNumber, email, ssn, addressId, organizationId } = req.body;

        try {
            // Check if client ID exists
            if (clientId !== undefined) {
                const existingClient = await ClientService.readClient(clientId);
                if (existingClient !== null) {
                    const clientObj = this.procClient(existingClient);
                    return res.status(200).json({
                        status: "success",
                        data: [clientObj],
                        message: '[ClientController][registerClient] Client already exists'
                    });
                }
            }
                        
            // Check if client type is valid
            if (Types.castIntToEnum(Types.clientType, clientType) === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][registerClient] Invalid client type'
                });
            }

            // Check if email exists
            if (email !== undefined) {
                var existingClients = await ClientService.readClientByEmail(email);
                if (existingClients !== null && existingClients.length > 0) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][registerClient] Client with this email already exists'
                    });
                }
            }

            // Check if cell number exists
            if (cellNumber !== undefined) {
                existingClients = await ClientService.readClientByPhoneNumber(cellNumber);
                if (existingClients !== null && existingClients.length > 0) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][registerClient] Client with this number already exists'
                    });
                }
            }
            // Check if address exists
            if (addressId !== undefined) {
                const existingAddress = await AddressService.readAddress(addressId);
                if (existingAddress === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][registerClient] Address does not exist'
                    });
                }
            }

            // Check if tags exist
            const tagList = ["Client"];
            if (tags !== undefined && tags !== null) {
                for (let i = 0; i < tags.length; i++) {
                    const label = tags[i];
                    const tag = await TagService.readTagByLabel(label);
                    if (tag !== null) {
                        tagList.push(label);
                    }
                }
            }

            // Check if title is valid
            var titleParsed = title;
            if (Types.castIntToEnum(Types.title, title) === undefined) {
                titleParsed = Types.title.NA;
            }

            // Check if the gender is valid
            var genderParsed = gender;
            if (Types.castIntToEnum(Types.gender, gender) === undefined) {
                genderParsed = Types.gender.NA;
            }

            // Check if organization exists
            if (organizationId !== undefined && organizationId !== "" && organizationId !== null) {
                const existingOrganization = await OrganizationService.readOrganization(organizationId);
                if (existingOrganization === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][registerClient] Organization does not exist'
                    });
                }
            }

            const client = await ClientService.createClient({
                clientId: uuidv4(),
                clientType: clientType,
                title: titleParsed,
                tags: tagList,
                firstName: firstName,
                lastName: lastName,
                gender: genderParsed,
                cellNumber: cellNumber,
                email: email,
                ssn: ssn,
                addressId: addressId,
                organizationId: organizationId,
            });
            if (client !== null) {
                const clientObj = this.procClient(client);
                res.status(200).json({
                    status: "success",
                    data: [clientObj],
                    message: '[ClientController][registerClient] Client created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][registerClient] Client creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][registerClient] Internal server error ${error}`
            });
        }
    }

    async getAllClients(req, res) {
        var clientList = [];
        try {
            const clients = await ClientService.readAllClients();
            if (clients !== null) {
                clientList = this.procClients(clients);
            }
            res.status(200).json({
                status: "success",
                data: clientList,
                message: '[ClientController][queryClient] Clients retrieved successfully'
            });           

        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][queryClient] Internal server error ${error}`
            });
        }
    }

    async queryClients(req, res) {
        const { keyword } = req.body;
        var clientList = [];
        try {
            const clients = await ClientService.readClientByKeyWord(keyword);
            if (clients !== null) {
                clientList = this.procClients(clients);
            }
            res.status(200).json({
                status: "success",
                data: clientList,
                message: '[ClientController][queryClient] Clients retrieved successfully'
            });           

        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][queryClient] Internal server error ${error}`
            });
        }
    }

    async queryClientsByType(req, res) {
        const { clientType } = req.body;
        var clientList = [];
        try {
            const clients = await ClientService.readClientsByType(clientType);
            if (clients !== null) {
                clientList = this.procClients(clients);
            }
            res.status(200).json({
                status: "success",
                data: clientList,
                message: '[ClientController][queryClient] Clients retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][queryClient] Internal server error ${error}`
            });
        }
    }

    async queryClientsByTag(req, res) {
        const { tag } = req.body;
        var clientList = [];
        try {
            const clients = await ClientService.readClientsByTag(tag);
            if (clients !== null) {
                clientList = this.procClients(clients);
            }
            res.status(200).json({
                status: "success",
                data: clientList,
                message: '[ClientController][queryClient] Clients retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][queryClient] Internal server error ${error}`
            });
        }
    }
                        

    async getClient(req, res) {
        var clientId;
        if (!req.params.clientId) {
            clientId = req.body.clientId;
        } else {
            clientId = req.params.clientId;
        }
        
        try {
            const client = await ClientService.readClient(clientId);

            if (client !== null) {
                const clientObj = this.procClient(client);
                res.status(200).json({
                    status: "success",
                    data: [clientObj],
                    message: '[ClientController][getClient] Client found'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][getClient] Client not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][getClient] Internal server error ${error}`
            });
        }
    }

    async updateClient(req, res) {
        const { clientId, clientType, title, tags, firstName, lastName, gender, cellNumber, workNumber, email, wechatAccount, ssn, dob, attorneyId, bankAttorneyId, addressId, organizationId } = req.body;

        try {
            // Check if client exists
            const existingClient = await ClientService.readClient(clientId);
            if (existingClient === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][updateClient] Client does not exist'
                });
            }
            var clientObj = this.procClient(existingClient);

            // Check if client type is valid
            if (Types.castIntToEnum(Types.clientType, clientType) !== undefined) {
                clientObj.clientType = clientType;
            }

            // Check if address exists
            if (addressId !== undefined && addressId !== "" && addressId !== existingClient.AddressId) {
                const existingAddress = await AddressService.readAddress(addressId);
                if (existingAddress === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][updateClient] Address does not exist'
                    });
                }
                clientObj.addressId = addressId;
            }

            // Check if tags exist
            const tagList = [];
            if (tags !== undefined && tags !== null) {
                for (let i = 0; i < tags.length; i++) {
                    const label = tags[i];
                    const tag = await TagService.readTagByLabel(label);
                    if (tag !== null) {
                        tagList.push(label);
                    }
                }
                clientObj.tags = tagList;
            }

            // Check if title is valid
            if (Types.castIntToEnum(Types.title, title) !== undefined) {
                clientObj.title = title;
            }

            // Check if gender is valid
            if (Types.castIntToEnum(Types.gender, gender) !== undefined) {
                clientObj.gender = gender;
            }

            // Check if ssn is valid
            if (ssn !== undefined && ssn !== "") {
                clientObj.ssn = ssn;
            }

            // Check if dob is valid
            if (dob !== undefined && dob !== "") {
                clientObj.dob = new Date(dob).toISOString();
            }

            // Check work number is valid
            if (workNumber !== undefined && workNumber !== "") {
                clientObj.workNumber = workNumber;
            }

            // Check if attorneyId is valid
            if (attorneyId !== undefined && attorneyId !== "") {
                clientObj.attorneyId = attorneyId;
            }

            // Check if bankAttorneyId is valid
            if (bankAttorneyId !== undefined && bankAttorneyId !== "") {
                clientObj.bankAttorneyId = bankAttorneyId;
            }

            // Check if firstName is valid
            if (firstName !== undefined && firstName !== "") {
                clientObj.firstName = firstName;
            }

            // Check if lastName is valid
            if (lastName !== undefined && lastName !== "") {
                clientObj.lastName = lastName;
            }

            // Check if cellNumber is valid
            if (cellNumber !== undefined && cellNumber !== clientObj.cellNumber && cellNumber !== "") {
                const existingClients = await ClientService.readClientByPhoneNumber(cellNumber);
                if (existingClients !== null && existingClients.length > 0) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][updateClient] Client with this number already exists'
                    });
                }
                clientObj.cellNumber = cellNumber;
            }

            // Check if email is valid
            if (email !== undefined && email !== clientObj.email && email !== "") {
                const existingClients = await ClientService.readClientByEmail(email);
                if (existingClients !== null && existingClients.length > 0) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][updateClient] Client with this email already exists'
                    });
                }
                clientObj.email = email;
            }

            // Check if wechatAccount is valid
            if (wechatAccount !== undefined && wechatAccount !== "") {
                clientObj.wechatAccount = wechatAccount;
            }

            // Check if organization exists
            if (organizationId !== undefined && organizationId !== "" && organizationId !== null && organizationId !== clientObj.organizationId) {
                const existingOrganization = await OrganizationService.readOrganization(organizationId);
                if (existingOrganization === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[ClientController][updateClient] Organization does not exist'
                    });
                }
                clientObj.organizationId = organizationId;
            }

            const client = await ClientService.updateClient(clientObj);
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [clientObj],
                    message: '[ClientController][updateClient] Client updated successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][updateClient] Client update failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][updateClient] Internal server error ${error}`
            });
        }
    }

    async deleteClient(req, res) {
        const { clientId } = req.body;
        try {
            const client = await ClientService.deleteClient(clientId);
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[ClientController][deleteClient] Client deleted successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][deleteClient] Client deletion failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[ClientController][deleteClient] Internal server error ${error}`
            });
        }
    }

    // static functions
    procClient(client) {
        return {
            clientId: client.ClientId,
            clientType: client.ClientType,
            title: client.Title,
            tags: client.Tags,
            firstName: client.FirstName,
            lastName: client.LastName,
            gender: client.Gender,
            cellNumber: client.CellNumber,
            workNumber: client.WorkNumber,
            email: client.Email,
            wechatAccount: client.WechatAccount,
            ssn: client.SSN,
            dob: client.DOB,
            addressId: client.AddressId,
            attorneyId: client.AttorneyId,
            bankAttorneyId: client.BankAttorneyId,
            organizationId: client.OrganizationId,
        };
    }

    procClients(clients) {
        var clientList = [];
        if (clients !== null) {
            for (let i = 0; i < clients.length; i++) {
                const c = clients[i];
                clientList.push(this.procClient(c));
            }
        }
        return clientList;
    }


}

module.exports = new ClientController();