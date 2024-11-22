// const jwt = require('jsonwebtoken');
const { sign, verify, decode } = require('jsonwebtoken');

/**
 * Json Web Token Util Class 
 * 
 *  do not construct object with init constructor, it is utility class
 * 
 * @class
 */
class JwTokenUtil {
    /**
     * Generates a new JWT (JSON Web Token) using the provided data and secret.
     * 
     * This method encodes the given data into a token and signs it with the provided secret key.
     * The generated token will include an expiration time specified by the `timeTravel` parameter,
     * which defaults to one hour if not provided.
     * 
     * @param {object} data - The payload containing the information to be encoded in the token.
     * @param {string} secret - The secret key used to sign the token, ensuring its integrity.
     * @param {string} [timeTravel='1h'] - The duration until the token expires, specified in a format
     *                                       recognized by the JWT library (e.g., '1h' for one hour).
     * 
     * @return {string} A signed JWT in the format of [encoded.encoded.signature], which can be used
     *                  for authentication and authorization in web applications.
     */
    static generateToken(data, secret, timeTravel = '1h') {
        return sign(data, secret, { expiresIn: timeTravel });
    }

    /**
     * Verifying it with the provided secret.
     * 
     * This asynchronous method attempts to verify the provided JWT (JSON Web Token) 
     * using the secret key. If the token is valid and not expired, it resolves the promise 
     * with the decoded data. If the token is invalid or expired, it rejects the promise 
     * with an error indicating that the token is invalid.
     * 
     * @param {string} token - The JWT to be validated.
     * @param {string} secret - The secret key used for signing the token, which is necessary
     *                          for verification.
     * 
     * @returns {Promise<object>} A promise that resolves with the decoded data if the token
     *                            is valid, or rejects with an error if it is invalid.
     * 
     * @throws {Error} Throws an error if there is an issue during the verification process.
     */
    static async verify(token, secret) {
        return new Promise((resolve, reject) => {
            verify(token, secret, (err, data) => {
                if (err) {
                    err.message = 'error invalid token';
                    err.status = 401;
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Decodes a JWT (JSON Web Token) to extract its payload without verifying the signature.
     * 
     * This method attempts to decode the provided token, returning the payload contained within it.
     * If the decoding is successful, the decoded data is returned as an object. 
     * If the token is undefined or an error occurs during decoding, it logs the error and throws it.
     * 
     * @param {string} token - The JWT to be decoded.
     * 
     * @returns {object|null} An object containing the decoded payload if successful; 
     *                       returns null if the token cannot be decoded.
     * 
     * @throws {Error} Throws an error if the decoding process fails, providing insight into the failure.
     */
    static decodeToken(token) {
        try {   
            const decoded = decode(token);
            if (decoded !== undefined) {
                const ret = {
                    ...decoded
                };
                return ret;
            } else {
                return null;
            }
        } catch (err) {
            console.error('decoded fail:', err);
            throw err;
        }
    }
};

module.exports = JwTokenUtil;