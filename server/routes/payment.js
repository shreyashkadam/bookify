require("dotenv/config")

const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

const router = require("express").Router();

router.post('/checkout', async(req, res) =>{
    const options = {
        amount: 50000,
        currency: "INR",
      };

    try {
        const order = await instance.orders.create(options);
        res.status(200).send({ order });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
})

module.exports = router;