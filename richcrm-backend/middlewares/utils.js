var axios = require('axios');

// Validate address
const standardizeAddress = async (addressLine1, addressLine2, city, state, zipCode) => {
    
    const addresses = addressLine1.split(' ');
    if (isNaN(parseInt(addresses[0]))) {
        return res.status(400).json({
            status: "failed",
            data: [],
            message: 'Address Line 1 must start with a number and follow with the street name, please check and try again'
        });
    }
    // const number = addresses[0];
    // addresses.shift();
    // const street = addresses.join(' ');
    try {
        const res = await axios.get("https://us-street.api.smarty.com/street-address", {
            params: {
                "auth-id": `${process.env.SMARTY_AUTH_ID}`,
                "auth-token": `${process.env.SMARTY_AUTH_TOKEN}`,
                "state": state,
                "city": city,
                "zipcode": zipCode,
                "street": addressLine1,
                "secondary": addressLine2
            },
            // headers: {
            //     'Authorization': `${process.env.RADAR_TEST_KEY}`
            // }
        });
        const data = res.data[0];
        if (data.last_line === undefined ||
            data.delivery_line_1 === undefined ||
            data.components === undefined) {
            return null;
        }
        var result = {
            formattedAddress: data.last_line,
            addressLine1: data.delivery_line_1,
            addressLine2: null,
            city: data.components.city_name,
            state: data.components.state_abbreviation,
            zipCode: data.components.zipcode,
            plus4: data.components.plus4_code,
            // latitude: data.metadata.latitude,
            // longitude: data.metadata.longitude
        };

        if (data.components.secondary_number !== undefined) {
            result.addressLine2 = data.components.secondary_number;
        }
        return result;
    } catch (err) {
        return null;
    }
}

module.exports = {
    standardizeAddress: standardizeAddress,
};