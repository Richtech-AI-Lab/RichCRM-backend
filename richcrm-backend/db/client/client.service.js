const Client = require("./client.db")

class ClientService {
    async readClient(clientId) {
        const data = await Client.getClientById(clientId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readClientsByType(clientType) {
        const data = await Client.getClientsByType(clientType);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readClientByKeyWord(keyword) {
        if (keyword === undefined || keyword === "") {
            console.log("[ClientService][readClientByKeyWord] Invalid keyword");
            return null;
        }
        const data = await Client.getClientsByKeyword(keyword);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readClientByPhoneNumber(phoneNumber) {
        const data = await Client.getClientByPhoneNumber(phoneNumber);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readClientByEmail(email) {
        const data = await Client.getClientByEmail(email);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createClient(client) {
        // Check if the client object is valid
        if (client.clientId === undefined ||
            client.firstName === undefined ||
            client.lastName === undefined) {
            console.log('[ClientService][createClient] Invalid client object');
            return null;
        }

        const data = await Client.createClient(client);
        return data;
    }

    async updateClient(client) {
        // Check if the client object is valid
        if (client.clientId === undefined) {
            console.log('[ClientService][updateClient] Invalid client object');
            return null;
        }

        const data = await Client.updateClient(client);
        return data;
    }

    async deleteClient(clientId) {
        const data = await Client.deleteClient(clientId);
        return data;
    }
}

module.exports = new ClientService();