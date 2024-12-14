var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var AuthController = require('../../controllers/auth');
const passport = require('../../middlewares/tokenStrategy/accessTokenStrategy');

const router = express.Router();

/**
 * @api {post} v1/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiBody {String} emailAddress Email address of the User.
 * @apiBody {String} password Password of the User.
 * @apiBody {String} userName User name of the User.
 * @apiBody {Number} role Role of the User (0-Admin, 1-Attorney).
 *
 * @apiSuccess {String} emailAddress Email address of the User.
 * @apiSuccess {String} password Password of the User.
 * @apiSuccess {String} userName User name of the User.
 * @apiSuccess {Number} role Role of the User (0-Admin, 1-Attorney).
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "emailAddress": "test@test.com",
 *  "password": "password",
 *  "userName": "Test User",
 *  "role": 0
 * }
 */
router.post(
    "/register",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    check("userName")
        .notEmpty()
        .withMessage("User name is required"),
    check("role")
        .notEmpty()
        .withMessage("Role is required"),
    validate,
    AuthController.registerUser
);

/**
 * @api {post} v1/auth/login Login a user
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} emailAddress Email address of the User.
 * @apiBody {String} password Password of the User.
 *
 * @apiSuccess {String} emailAddress Email address of the User.
 * @apiSuccess {String} password Password of the User.
 * @apiSuccess {String} userName User name of the User.
 * @apiSuccess {Number} role Role of the User (0-Admin, 1-Attorney).
 * @apiSuccess {String} uploadFolderName Folder name for user uploads.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "emailAddress": "test@test.com",
 *  "password": "password",
 *  "userName": "Test User",
 *  "role": 0,
 *  "uploadFolderName": "MG",
 * }
 */
router.post(
    "/login",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password invalid"),
    validate,
    AuthController.loginUser
);


/**
 * @api {post} v1/auth/delete Delete a user
 * @apiName DeleteUser
 * @apiGroup Auth
 *
 * @apiBody {String} emailAddress Email address of the User.
 * @apiBody {String} password Password of the User.
 *
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/delete",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is invalid, must provide password to delete user"),
    validate,
    AuthController.deleteUser
);

/**
 * @api {post} v1/auth/update Update a user
 * @apiName UpdateUser
 * @apiGroup Auth
 *
 * @apiBody {String} emailAddress Email address of the User.
 * @apiBody {String} password Password of the User.
 * @apiBody {String} userName User name of the User.
 * @apiBody {Number} role Role of the User (0-Admin, 1-Attorney).
 * @apiBody {String} uploadFolderName Folder name for user uploads.
 *
 * @apiSuccess {String} password Password of the User.
 * @apiSuccess {String} userName User name of the User.
 * @apiSuccess {Number} role Role of the User (0-Admin, 1-Attorney).
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "password": "password",
 *  "userName": "Test User",
 *  "role": 0,
 *  "uploadFolderName": "MG"
 * }
 */
router.post(
    "/update",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is invalid, must provide password to update user"),
    check("userName")
        .notEmpty()
        .withMessage("User name is required"),
    check("role")
        .notEmpty()
        .withMessage("Role is required"),
    check("uploadFolderName")
        .optional(),
    validate,
    AuthController.updateUser
);

/**
 * @api {post} v1/auth/change-password Change a user's password
 * @apiName ChangePassword
 * @apiGroup Auth
 * 
 * @apiHeader {String} Authorization Bearer token to authenticate the user.
 *
 * @apiBody {String} currentPassword Old password of the User.
 * @apiBody {String} newPassword New password of the User.
 *
 * @apiSuccess {String} emailAddress Email address of the User.
 * @apiSuccess {String} password Password of the User.
 * @apiSuccess {String} userName User name of the User.
 * @apiSuccess {Number} role Role of the User (0-Admin, 1-Attorney).
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "emailAddress": "test@gmail.com",
 *  "password": "newpassword",
 *  "userName": "Test User",
 *  "role": 0,
 * }
 */
router.post(
    "/change-password",
    passport.authenticate("user-jwtStrategy", {session: false}),
    check("currentPassword")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Invalid old password, must be at least 8 characters long"),
    check("newPassword")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Invalid new password, must be at least 8 characters long"),
    validate,
    AuthController.changePassword
);

/**
 * @api {post} v1/auth/refresh Refresh access token
 * @apiName RefreshAccessToken
 * @apiGroup Auth
 * 
 * @apiBody {String} Authorization refresh token to authenticate the user.
 * 
 * @apiSuccess {String} new Access token of the User.
 * 
 * @apiError Unauthorized The user is not authenticated.
 */
router.post(
    "/refresh",
    check('refreshToken')
        .notEmpty()
        .isJWT()
        .withMessage('invalid refresh token'),
    validate,
    AuthController.refresh
);

/**
 * @api {get} v1/auth/me Get user information
 * @apiName SelfUserInfo
 * @apiGroup Auth
 * 
 * @apiHeader {String} Authorization Bearer token to authenticate the user.
 * 
 * @apiSuccess {String} emailAddress Email Address of the User.
 * @apiSuccess {String} userName User name of the User.
 * @apiSuccess {Number} role Role of the User (0-Admin, 1-Attorney).
 * 
 * @apiError Unauthorized The user is not authenticated.
 */
router.get(
    "/me",
    check("Authorization")
        .exists()
        .withMessage("Authorization header is required")
        .matches(/^Bearer\s.+$/)
        .withMessage('Authorization header not in format: Bearer <token>'),
    validate,
    passport.authenticate("user-jwtStrategy", {session: false}),
    AuthController.me
);

/**
 * @api {post} v1/auth/password-reset-request reset password request
 * @apiName password-reset-request
 * @apiGroup Auth
 * 
 * @apiBody {String} Authorization refresh token to authenticate the user.
 * 
 * @apiSuccess {String} new Access token of the User.
 * 
 * @apiError Unauthorized The user is not authenticated.
 */
router.post(
    "/password-reset-request",
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    validate,
    AuthController.resetPasswordRequest
);

/**
 * @api {post} v1/auth/password-reset reset password
 * @apiName password-reset
 * @apiGroup Auth
 * 
 * @apiBody {String} user’s email address.
 * @apiBody {String} new password
 * @apiBody {String} verification code sent to user’s email address.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "User reset password successfully"
 * }
 */
router.post(
    "/password-reset",
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check('newPassword')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is invalid, must provide password to update user"),
    check('verificationCode')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage("Verification code is invalid, must provide verification code to reset password"),
    validate,
    AuthController.resetPassword
);

/**
 * @api {get} v1/auth/account-verification/:v account verification
 * @apiName account-verification
 * @apiGroup Auth
 * 
 * @apiParam {String} v verification token.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "User email verified successfully"
 * }
 */
router.get(
    "/account-verification/:v",
    check('v')
        .notEmpty()
        .isJWT()
        .withMessage('invalid verification token'),
    validate,
    AuthController.accountVerification
);

/**
 * @api {get} v1/auth/resend-account-verification resend account verification email
 * @apiName resend-account-verification
 * @apiGroup Auth
 * 
 * @apiBody {String} user’s email address.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "status": "success",
 *  "data": [],
 *  "message": "User email verified successfully"
 * }
 */
router.post(
    "/resend-account-verification",
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    validate,
    AuthController.resendAccountVerification
);

module.exports = router;