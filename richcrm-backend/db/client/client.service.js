const Client = require("./client.db")

class ClientService {
    async readClient(clientId) {
        const data = await Client.getClientById(clientId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllClients() {
        const data = await Client.getAllClients();

        if (data.Items !== undefined) {
            return data.Items;
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
        const keywords = keyword.split(/[\s,]+/).map(kw => kw.trim()).filter(Boolean);

        const data = await Client.getClientsByKeywords(keywords);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readClientsByTag(tag) {
        if (tag === undefined || tag === "") {
            console.log("[ClientService][readClientsByTag] Invalid tag");
            return null;
        }
        const data = await Client.getClientsByTag(tag);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readClientsByTags(tags) {
        if (tags === undefined || tags === "") {
            console.log("[ClientService][readClientsByTags] Invalid tags");
            return null;
        }
        const data = await Client.getClientsByTags(tags);

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