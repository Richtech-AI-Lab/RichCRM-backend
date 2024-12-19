const User = require('./user.db');
const { userRole } = require('../types');

class UserService {
    async readUser (userEmail) {
        const data = await User.getUserByEmail(userEmail);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readAllUsers () {
        const data = await User.getAllUsers();

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createUser (user) {
        // Check if the user object is valid
        if (
            user.emailAddress === undefined ||
            user.password === undefined ||
            user.userName === undefined ||
            user.salt === undefined ||
            user.role === undefined
        ) {
            console.log('[USER-Create] Invalid user object');
            return null;
        }
        
        // Check if the role is valid
        const roleValid = Object.values(userRole).includes(user.role);
        if (!roleValid) {
            console.log('[USER-Create] Invalid role');
            return null;
        }

        const data = await User.createUser(user);
        return data;
    }

    async updateUser (user) {
        // Check if the user object is valid
        if (user.emailAddress === undefined) {
            console.log('[USER-Update] Invalid user object');
            return null;
        }

        // Check if the role is valid
        const roleValid = Object.values(userRole).includes(user.role);
        if (user.role !== undefined && user.role !== null && !roleValid) {
            console.log('[USER-Update] Invalid role');
            return null;
        }

        const data = await User.updateUser(user);
        return data;
    }

    async deleteUser (userEmail) {
        const data = await User.deleteUser(userEmail);
        return data;
    }

}

module.exports = new UserService();