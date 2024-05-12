const express = require('express');
const conn = require('../config/database');
const { invokeLambda } = require('../utils/codeExecution');

const submitRoute = express.Router();

submitRoute.post('/', async (req, res) => {
    const { code, language, user_id } = req.body;

    try {
        // Invoke Lambda function to execute the code
        const result = await invokeLambda(code, language);  
        console.log(result)
        if (result.error !== '') {
            res.status(400).json({error: result.error})
        } else {
            const query = "INSERT INTO submissions (code, output, user_id) VALUES (?, ?, ?)";
            const params = [code, result.body, user_id];

            conn.query(query, params, (err, dbResult) => {
                if (err) {
                    console.error('Database insertion failed:', err);
                    res.status(500).json({ message: 'Database insertion failed', error: err });
                } else {
                    console.log('Submission added:', dbResult.insertId);
                    console.log(result)
                    res.json({ message: 'Code submitted successfully', output: result.output });
                }
            });
        }
    } catch (error) {
        console.error('Code execution failed:', error);
        res.json({ message: 'Code execution failed', result: error.message });
    }
});

module.exports = { submitRoute };
