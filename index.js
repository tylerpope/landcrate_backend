require("dotenv").config()
const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const auth = require("./api/routes/auth");
const user = require("./api/routes/user");
require("./services/auth")

app.use(bodyParser.json());
app.use('/api/test', (req, res) => res.send('test'))
app.use("/api/auth", auth);
app.use("/api/user", user);

app.listen(port, () => console.log(`running on ${port}`));
