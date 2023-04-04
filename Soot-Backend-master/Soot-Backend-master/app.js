// Importing Modules
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const qdb = require("discortics.db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");
const nft = require("./mint");
const mint = nft.pinFileToIPFS; parseUrl = require("body-parser");
const API_KEY = "sk_live_fb51062c-e3bf-4926-9059-f5ac576db492"; 
const multipart = require("connect-multiparty"); 
const multipartmiddleware = multipart();

require("dotenv").config();

// Declaring Variables, Constants & Functions

let database = {};
var corsOptions = {
  origin: "*",
  // credentials: true,
  optionsSuccessStatus: 200,
};
let salt = process.env.SALT;
// Importing Basic Middleware

const app = express();
app.set("etag", false);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  morgan(
    '[:date[clf]] :status || ":method :url HTTP/:http-version" || ":referrer" ":user-agent"'
  )
);
app.use(helmet());
app.use(cors(corsOptions));
var http = require("http").Server(app);

app.post("/signin", async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(403)
      .json({ status: 403, message: "Authorization Required" });
  let fetched = await database.user.table.findOne({
    username: req.body.username,
  });
  if (!fetched)
    return res.status(503).json({ status: 503, message: "Unknown User" });
  let result = await bcrypt.compare(req.body.password, fetched.password);
  if (!result)
    return res.status(503).json({ status: 503, message: "Unknown User" });
  let token = jwt.sign({ token: fetched.userID }, salt, { expiresIn: "7d" });
  res.status(200).json({ status: 200, message: "Successful", token });
});

app.post("/mint", async (req, res) => {
  if (!req.body.credit)
    return res.status(420).json({ status: 420, message: "No Credits" });
  let CID = await mint(req.body.credit);
  console.log(typeof CID);
  console.log("Recived");
  return res.status(200).json({ status: 200, message: "" + CID });


  
});

app.post("/image", multipartmiddleware, (req, res) => {
  // axios
  var data = new FormData();
  data.append("allowPlatformToOperateToken", "true");
  data.append("chain", "polygon");
  data.append("recipientAddress", req.body.recipientAddress);
  data.append("filePath", fs.createReadStream("output.png"));
  data.append("name", req.body.name);
  data.append("description", req.body.description);

  var config = {
    method: "post",
    url: "https://api.verbwire.com/v1/nft/mint/quickMintFromFile",
    headers: {
      "X-API-Key": API_KEY,
      ...data.getHeaders(),
    },
    data: data,
  };

  console.log("data", data);

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

console.log(`[${DateTime.local().toFormat("D HH:mm:ss.u")}] Starting Server`);
qdb.connect(process.env.DATABASE).then(async () => {
  console.log(
    `[${DateTime.local().toFormat("D HH:mm:ss.u")}] Connected to Database`
  );
  database.user = await new qdb.table("user");
  //start server
  server = http.listen(3001, () => {
    console.log(
      `[${DateTime.local().toFormat(
        "D HH:mm:ss.u"
      )}] Server is Ready. Listening to Port ${server.address().port}`
    );
  });
});
