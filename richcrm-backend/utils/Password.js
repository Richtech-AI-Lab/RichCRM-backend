// const crypto = require('crypto');
const { randomBytes, createHash } = require('crypto');

/**
 * Password Util Class 
 * 
 *  do not construct object with init constructor, it is utility class
 * 
 * @class
 */
class PasswordUtil {
    /**
     * Generates a random salt value for password hashing.
     * 
     * The salt is a 16-byte random value, returned as a hexadecimal string.
     * Salts are used to ensure that hashed passwords are unique, even for
     * identical passwords, enhancing security against rainbow table attacks.
     * 
     * @returns {string} A hexadecimal string representing the random salt.
     */
    static generateSalt() {
        return randomBytes(16).toString('hex');
    }

    /**
     * Encrypts the given password using a specified salt value.
     * This method applies the RSA-SHA256 hashing algorithm to create a secure hash
     * of the password combined with the salt. The resulting hash is returned 
     * as a hexadecimal string, which can be stored securely.
     *
     * @param {string} password - The password to be encrypted.
     * @param {string} salt - The salt value used in the encryption process.
     * @returns {string} A hexadecimal string representing the encrypted password.
     */
    static encrypt(password, salt) {
        return createHash('RSA-SHA256').update(password).update(salt).digest('hex');
    }

    /**
     * Validates a entered password by comparing it with the target password.
     * This method hashes the entered password using the provided salt and 
     * compares the resulting hash with the target password's hash.
     * It returns true if the hashes match, indicating the entered password 
     * is valid; otherwise, it returns false.
     *
     * @param {string} targetPassword - The hashed password to compare against.
     * @param {string} enterPassword - The password entered by the user to validate.
     * @param {string} salt - The salt value used for hashing the entered password.
     * @returns {boolean} True if the entered password is valid, false otherwise.
     */
    static isValidPassword(targetPassword, enterPassword, salt) {
        const hashedPassword = PasswordUtil.encrypt(enterPassword, salt);
        return hashedPassword === targetPassword;
    }

    /**
     * Generates a verification code of a specified length.
     * The code is created using random bytes, converted to a hexadecimal string,
     * and then returned in uppercase.
     *
     * @param {number} length - The length of the verification code to generate.
     * @returns {string} A verification code consisting of uppercase hexadecimal characters.
     */
    static generateVerificationCode(length) {
        return randomBytes(length).toString('hex').slice(0, length).toUpperCase();
    }
};

module.exports = PasswordUtil;