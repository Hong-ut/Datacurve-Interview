const express = require('express');
const { invokeLambda } = require('../utils/codeExecution');

const executeRoute = express.Router();

executeRoute.post('/', async (req, res) => {
    console.log(req.body)
    const { code, language } = req.body;
    console.log('languageeee:', language)
    console.log('code: ', code)

    try {
        const result = await invokeLambda(code, language);
        res.json(result);
    } catch (error) {
        console.error('Error invoking Lambda:', error);
        
        // Send the error message as a JSON response
        res.status(500).json({ error: error.message });
    }

});

module.exports = { executeRoute };
