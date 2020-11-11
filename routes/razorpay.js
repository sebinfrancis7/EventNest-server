const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const Transaction = require('../models/transactions');
// Razer Pay stuff
const shortid = require('shortid');
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: 'rzp_test_Cly42HaznEIi1i',
    key_secret: 'mfK26249sjg18WTJwyT0r31N'
});

const payRouter = express.Router();
payRouter.use(bodyParser.json());

payRouter
    .route('/')
    .post(async(req, res, next) => {
        const payment_capture = 1;
        const amount = req.body.amount;
        const currency = 'INR';

        const options = {
            amount: amount * 100,
            currency,
            receipt: shortid.generate(),
            payment_capture
        };

        try {
            const response = await razorpay.orders.create(options);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                id: response.id,
                currency: response.currency,
                amount: response.amount
            });
        } catch (error) {
            next(error)
        }
    });

payRouter
    .route('/payment')
    .post((req, res, next) => {
        const generated_signature = crypto.createHmac('sha256', keysecret)
        generated_signature.update(req.body.razorpay_order_id + "|" + req.body.transactionid)
        if (generated_signature.digest('hex') === req.body.razorpay_signature) {
            const transaction = new Transaction({
                transactionid: req.body.transactionid,
                transactionamount: req.body.transactionamount,
            });
            transaction.save(function(err, savedtransac) {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Some Problem Occured");
                }
                res.send({ transaction: savedtransac });
            });
        } else {
            return res.send('failed');
        }
    })

module.exports = payRouter;