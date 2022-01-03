const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Listen op ${port}`);
})