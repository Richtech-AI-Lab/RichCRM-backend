/**
 * Author: Eden Wu
 * Date: 2024-07-11
 * Database Model of Address
 * 
 * @typedef {object} Address
 * @property {string} AddressId - Address ID
 * @property {string} AddressLine1 - Address line 1
 * @property {string} AddressLine2 - Address line 2
 * @property {string} City - US City
 * @property {string} State - US state
 * @property {int} ZipCode - Zip code
 * @property {int} Plus4 - Plus 4
 */

const db = require('../dynamodb');

class Address {
    constructor () {
        this.table = 'Address';
    }

    async getAddressById (addressId) {
        const params = {
            TableName: this.table,
            Key: {
                AddressId: addressId
            }
        };
        const address = await db.get(params);
        return address;
    }

    async queryAllAddressesBatch (addressIds) {
        const params = {
            RequestItems: {
                [this.table]: {
                    Keys: addressIds.map(addressId => ({ AddressId: addressId }))
                }
            }
        };
        const addresses = await db.batchGet(params);
        return addresses;
    }

    async getAllAddresses () {
        const params = {
            TableName: this.table
        };
        const addresses = await db.scan(params);
        return addresses;
    }

    async createAddress (address) {
        const params = {
            TableName: this.table,
            Item: {
                AddressId: address.addressId,
                AddressLine1: address.addressLine1,
                AddressLine2: address.addressLine2,
                City: address.city,
                State: address.state,
                ZipCode: address.zipCode,
                Plus4: address.plus4
            }
        };
        await db.put(params);
        
        return params.Item;
    }

    async updateAddress (address) {
        const params = {
            TableName: this.table,
            Key: {
                AddressId: address.addressId
            },
            UpdateExpression: 'set AddressLine1 = :l1, AddressLine2 = :l2, City = :c, State = :s, ZipCode = :z, Plus4 = :p',
            ExpressionAttributeValues: {
                ':l1': address.addressLine1,
                ':l2': address.addressLine2,
                ':c': address.city,
                ':s': address.state,
                ':z': address.zipCode,
                ':p': address.plus4
            }
        };
        await db.update(params);
        
        return params.Item;
    }

    async deleteAddress (addressId) {
        const params = {
            TableName: this.table,
            Key: {
                AddressId: addressId
            }
        };
        await db.delete(params);
    }
}

module.exports = new Address();