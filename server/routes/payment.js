require("dotenv/config")
const Payment = require("../models/payment");

const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

const router = require("express").Router();

router.post('/checkout', async (req, res) => {
    if (!req.body.amount) {
        return res.status(500).send({ message: "Invalid Amount" });
    }
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };

    try {
        const order = await instance.orders.create(options);
        // res.status(200).send({ order });
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
})

router.post('/paymentVerification', async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });

    res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );

});

module.exports = router;