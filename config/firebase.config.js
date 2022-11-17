const admin = require("firebase-admin");
const router = require("../routes/auth");

const serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
  credential: admin.credential.cert({...serviceAccount,private_key:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')})
});

module.exports = admin;