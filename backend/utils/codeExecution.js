const fs = require('fs');
const path = require('path');
const axios = require('axios');


const invokeLambda = async (code, language) => {
    console.log('invoked')
    try {
        let response = null;
        if (language === 'python') {
            response = await axios.post(
                "http://127.0.0.1:5000/exec",
                {
                    code: code
                }
            );
        } else if (language == 'go') {
            response = await axios.post(
                "http://localhost:6000/exec",
                {
                    code: code
                }
            );
        }


        if (response.status === 200) {
            console.log(response.data.output.length)
            return response.data;
        } else {
            throw new Error(response.data);
        }
    } catch (error) {
        console.error('Error invoking lambda:', error);

        throw new Error(error.message);
    }
};

module.exports = { invokeLambda };
