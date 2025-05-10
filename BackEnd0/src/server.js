require('dotenv').config();

const express = require('express')
const configViewEnginne = require('./config/viewEngine');
const webRoutes = require('./routes/web');

const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME || 'localhost2';

// Config view engine.
configViewEnginne(app);
app.use('/v1', webRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})

