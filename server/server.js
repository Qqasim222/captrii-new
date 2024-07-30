const express = require("express");
const app = express();
const axios = require('axios');
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // configure reading from .env

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);
app.use(express.json());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || "mySecret"; // Use environment variable for secret
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
}

app.get('/auth/microsoft', (req, res) => {
    const authUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&response_mode=query&scope=openid profile User.Read&state=12345`;
    res.redirect(authUrl);
  });
  
  app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          scope: 'openid profile User.Read',
          code: code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code',
          client_secret: process.env.CLIENT_SECRET,
        })
      );
  
      const { access_token } = tokenResponse.data;
  
      const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      res.json(userResponse.data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  

app.post("/signup", async (req, res) => {
    try {
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);

            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;

            // Here you should save the profile to your database
            DB.push(profile); // Replace this with actual database logic

            res.status(201).json({
                message: "Signup was successful",
                user: {
                    firstName: profile?.given_name,
                    lastName: profile?.family_name,
                    picture: profile?.picture,
                    email: profile?.email,
                    token: jwt.sign({ email: profile?.email }, JWT_SECRET, {
                        expiresIn: "1d",
                    }),
                },
            });
        } else {
            res.status(400).json({
                message: "No credential provided",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Registration failed.",
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);
            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;

            const existsInDB = DB.find((person) => person?.email === profile?.email);

            if (!existsInDB) {
                return res.status(400).json({
                    message: "You are not registered. Please sign up",
                });
            }

            res.status(201).json({
                message: "Login was successful",
                user: {
                    firstName: profile?.given_name,
                    lastName: profile?.family_name,
                    picture: profile?.picture,
                    email: profile?.email,
                    token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                    }),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});

let DB = [];

app.listen(5152, () => console.log("Server running on port 5152"));
