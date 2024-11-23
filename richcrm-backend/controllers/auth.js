var UserService = require('../db/user/user.service');
const Types = require("../db/types");
const PasswordUtil = require('../utils/Password');

class AuthController {
    async registerUser(req, res) {
        const {emailAddress, password, userName, role} = req.body;
        try {
            const existingUser = await UserService.readUser(emailAddress);
            if (existingUser !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User already exists'
                });
            }
            const salt = PasswordUtil.generateSalt();
            const encryptedPassword = PasswordUtil.encrypt(password, salt);
            const user = await UserService.createUser({emailAddress, salt, password: encryptedPassword, userName, role});
            if (user !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        emailAddress: user.EmailAddress,
                        userName: user.UserName,
                        role: user.Role,
                    }],
                    message: 'User created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async loginUser(req, res) {
        const {emailAddress, password} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }
            if (user.Password !== password) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid password'
                });
            }
            res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    password: user.Password,
                    userName: user.UserName,
                    role: user.Role,
                    uploadFolderName: user.UploadFolderName,
                }],
                message: '[AuthController][loginUser] User logged in successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[AuthController][loginUser] Internal server error'
            });
        }
        res.end();
    }

    async deleteUser(req, res) {
        const {emailAddress, password} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user.Password !== password) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][deleteUser] Invalid password'
                });
            }
            const result = await UserService.deleteUser(emailAddress);
            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][deleteUser] User deletion failed'
                });
            }
            res.status(200).json({
                status: "success",
                data: [result],
                message: '[AuthController][deleteUser] User deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[AuthController][deleteUser] Internal server error'
            });
        }
        res.end();
    }

    async changePassword(req, res) {
        const {emailAddress, currentPassword, newPassword} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][changePassword] User not found'
                });
            }
            if (user.Password !== currentPassword) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][changePassword] Current password not matched'
                });
            }
            if (newPassword === currentPassword) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][changePassword] New password cannot be the same as current password'
                });
            }
            

            const result = await UserService.updateUser({emailAddress, password: newPassword});
            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][changePassword] Password change failed'
                });
            }
            res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    password: newPassword,
                    role: user.Role,
                    userName: user.UserName,
                    uploadFolderName: user.UploadFolderName,
                }],
                message: '[AuthController][changePassword] Password changed successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[AuthController][changePassword] Internal server error'
            });
        }

    }

    async updateUser(req, res) {
        const {emailAddress, password, userName, role, uploadFolderName} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][updateUser] User not found'
                });
            }
            const userObj = {
                emailAddress: user.EmailAddress,
                password: user.Password,
                userName: user.UserName,
                role: user.Role,
                uploadFolderName: user.UploadFolderName,
            }
            if (password !== undefined && password !== userObj.password && password !== '') {
                userObj.password = password;
            }

            if (userName !== undefined && userName !== userObj.userName && userName !== '') {
                userObj.userName = userName;
            }

            if (role !== undefined && role !== userObj.role && role !== '') {
                const roleEnum = Types.castIntToEnum(Types.userRole, role);
                if (roleEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[AuthController][updateUser] Invalid role'
                    });
                }
                userObj.role = role;
            }

            if (uploadFolderName !== undefined && uploadFolderName !== userObj.uploadFolderName && uploadFolderName.trim() !== '') {
                userObj.uploadFolderName = uploadFolderName;
            }

            const result = await UserService.updateUser(userObj);
            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][updateUser] User update failed'
                });
            }
            res.status(200).json({
                status: "success",
                data: [userObj],
                message: '[AuthController][updateUser] User updated successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[AuthController][updateUser] Internal server error'
            });
        }
        res.end();
    }
}

module.exports = new AuthController();