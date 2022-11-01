const express = require("express");
const app = express();
require("dotenv/config")

const cors = require("cors");
const {default : mongoose} = require("mongoose");

app.use(cors({origin : true}))
app.use(express.json());

const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

app.get("/", (req, res) => {
    return res.json("Hey there....")
})

// user authentication routes
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Authors links
const authorRoute = require("./routes/author");
app.use("/api/author/", authorRoute);

// Series links
const seriesRoute = require("./routes/series");
app.use("/api/series/", seriesRoute);

// Audiobooks links
const audiobookRoute = require("./routes/audiobook");
app.use("/api/audiobook/", audiobookRoute);

mongoose.connect(process.env.DB_STRING, {useNewUrlParser : true});
mongoose.connection
.once("open", () => console.log("Connected"))
.on("error", (error) => {
    console.log(`ERROR : ${error}`);
})



app.listen(4000, () => console.log("Listening to port 4000"));
