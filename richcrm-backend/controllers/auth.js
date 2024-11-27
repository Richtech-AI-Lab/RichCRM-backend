var UserService = require('../db/user/user.service');
const Types = require("../db/types");
const PasswordUtil = require('../utils/Password');
const JwTokenUtil = require('../utils/JwToken');
const ses = require('../services/ses');

const PASSWORD_RESET_EXP_LENGTH = 10 * 60 * 1000; // 10 minutes

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

            if (!PasswordUtil.isValidPassword(user.Password, password, user.Salt)) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid password'
                });
            }

            const userPayload = {
                UserName: user.UserName,
                Role: user.Role,
                EmailAddress: user.EmailAddress,
            }

            let accessToken, refreshToken = undefined;
            accessToken = JwTokenUtil.generateToken(userPayload, process.env.ACCESS_TOKEN_KEY, process.env.ACCESS_TOKEN_TIME_EXPIRATION);
            refreshToken = JwTokenUtil.generateToken(userPayload, process.env.REFRESH_TOKEN_KEY, process.env.REFRESH_TOKEN_TIME_EXPIRATION);
            if (accessToken === undefined || refreshToken === undefined) {
                throw new Error('token generation failed');
            }

            const tokenResult = await UserService.updateUser({
                emailAddress: user.EmailAddress,
                refreshToken
            });
            if (tokenResult === undefined || tokenResult === null) {
                throw new Error('refresh token update failed');
            }

            res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    userName: user.UserName,
                    role: user.Role,
                    uploadFolderName: user.UploadFolderName,
                    token: {
                        access: accessToken,
                        refresh: refreshToken
                    }
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
        const emailAddress = req.user.EmailAddress;
        const {currentPassword, newPassword} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[AuthController][changePassword] User not found'
                });
            }
            if (!PasswordUtil.isValidPassword(user.Password, currentPassword, user.Salt)) {
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
            
            const newSalt = PasswordUtil.generateSalt();
            const newEncryptedPassword = PasswordUtil.encrypt(newPassword, newSalt);
            const result = await UserService.updateUser({
                emailAddress, 
                password: newEncryptedPassword,
                salt: newSalt
            });
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

    async me(req, res) {
        const emailAddress = req.user.EmailAddress;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: 'User info failed'
                });
            } 
            return res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    userName: user.UserName,
                    role: user.Role
                }],
                message: 'User info successfully'
            });
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

    async refresh(req, res) {
        const token = req.body.refreshToken;
        try {
            const tokenPayload = await JwTokenUtil.verify(token, process.env.REFRESH_TOKEN_KEY); 

            const user = await UserService.readUser(tokenPayload.EmailAddress);
            if (user === null ) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User invalid error'
                });
            }

            if (user.RefreshToken !== token) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Token invalid error'
                });
            }

            const userPayload = {
                UserName: user.UserName,
                Role: user.Role,
                EmailAddress: user.EmailAddress,
            }

            let accessToken = JwTokenUtil.generateToken(userPayload, process.env.ACCESS_TOKEN_KEY, process.env.ACCESS_TOKEN_TIME_EXPIRATION);

            res.status(200).json({
                status: "success",
                data: [{
                    token: {
                        access: accessToken
                    }
                }],
                message: 'Token refreshed successfully'
            });

        } catch (error) {
            console.error(error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: "failed",
                    data: [],
                    message: 'Token expired error'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid token error'
                });
            }

            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }

        res.end();
    }

    async resetPasswordRequest(req, res) {
        const { email } = req.body;
        try {   
            const user = await UserService.readUser(email);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }

            const verificationCode = PasswordUtil.generateVerificationCode(6);
            var expDate = new Date();
            expDate.setTime(expDate.getTime() + PASSWORD_RESET_EXP_LENGTH);
            const result = await UserService.updateUser({
                emailAddress: user.EmailAddress,
                verificationCode: verificationCode,
                verificationExp: expDate
            });

            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User reset password request failed'
                });  
            }

            // TODO: need a better template format for email verification
            const returnData = await ses.sendEmail({
                toAddresses: [user.EmailAddress],
                templateContent: `Dear customer ${user.UserName},\n\nPlease use the following verification code to reset your password: ${verificationCode}\nThis code will expire in 10 minutes.\nIf you did not request a password reset, please ignore this email.\nThank you for using our service!\n\nSincerely,\nRichCRM Team`,
                templateTitle: 'Password reset request verification'
            });

            return res.status(200).json({
                status: "success",
                data: [],
                message: 'User reset password request successfully'
            });
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

    async resetPassword(req, res) {
        const { email, verificationCode, newPassword } = req.body;
        try {
            const user = await UserService.readUser(email);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }

            if (user.verificationCode !== verificationCode) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid verification code'
                });
            }

            if (user.VerificationExp < new Date()) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Verification code expired'
                });
            }

            const salt = PasswordUtil.generateSalt();
            const encryptedPassword = PasswordUtil.encrypt(newPassword, salt);
            const result = await UserService.updateUser({
                emailAddress: user.EmailAddress,
                password: encryptedPassword,
                salt: salt
            });

            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User reset password failed'
                });
            }

            res.status(200).json({
                status: "success",
                data: [],
                message: 'User reset password successfully'
            });
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
}

module.exports = new AuthController();