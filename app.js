require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

const User = require("./model/user");
const File = require("./model/file");
const Folder = require("./model/folder");

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//register
app.post("/register", async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
      encryptedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });
  
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
});
  

// login
app.post("/login", async (req, res) => {

    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        user.token = token;

        res.status(200).json(user);
      }
      
    } catch (err) {
      res.status(400).send("Invalid Credentials");
      console.log(err);
    }
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

const fileRouter = require('./routes/files')
app.use('/files',auth,fileRouter)

const folderRouter = require('./routes/folders')
app.use('/folders',auth,folderRouter)

module.exports = app;