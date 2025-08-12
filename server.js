const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Store challenges temporarily (memory only for demo)
const challenges = {};

// 1. Get challenge from server
app.post("/get-challenge", (req, res) => {
  const { authRequest } = req.body;

  // Ensure challenge has required fields, provide defaults if missing
  const challenge = {
    ...authRequest,
    name: authRequest.name || "ONT ID Demo",
    nonce: Date.now().toString(),
    version: authRequest.version || "1.0",
    domain: authRequest.domain || "localhost",
    chain: authRequest.chain || "ont" // Ensure Ontology chain
  };

  console.log("Generated challenge:", JSON.stringify(challenge, null, 2));
  challenges[challenge.nonce] = challenge;
  res.json(challenge);
});

// 2. Submit auth response
app.post("/submit-auth", (req, res) => {
  const authResponse = req.body;
  const challenge = challenges[authResponse.nonce];

  if (!challenge) {
    console.error("Challenge not found for nonce:", authResponse.nonce);
    return res.status(400).json({ error: "Challenge not found or expired" });
  }

  console.log("✅ AuthResponse received:", JSON.stringify(authResponse, null, 2));

  // Generate a fake token
  const token = Buffer.from(JSON.stringify({ did: authResponse.did })).toString("base64");
  res.json({ token });
});

// 3. Logout endpoint
app.post("/logout", (req, res) => {
  console.log("Logout requested");
  res.json({ message: "Logged out" });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));