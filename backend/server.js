require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { executeRoute } = require('./routes/executeRoute');
const { submitRoute } = require('./routes/submitRoute');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/execute', executeRoute);
app.use('/api/submit', submitRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
