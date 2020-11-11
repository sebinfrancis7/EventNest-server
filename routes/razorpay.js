const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const { isAuth } = require('./authMiddleware');
// Razer Pay stuff
const shortid = require('shortid');
const Razorpay = require('razorpay');
const Customers = require('../models/customer');
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
        const amount = req.body.amount || 0;
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
            console.log(error)
            next(error)
        }
    });

payRouter
    .route('/payment')
    .post(isAuth, (req, res, next) => {
        const generated_signature = crypto.createHmac('sha256', 'mfK26249sjg18WTJwyT0r31N') // key secret
        generated_signature.update(req.body.razorpay_order_id + "|" + req.body.transactionid)
        if (generated_signature.digest('hex') === req.body.razorpay_signature) {
            let purchase = {
                transactionid: req.body.transactionid,
                transactionamount: req.body.transactionamount,
                transactionid: req.body.transactionid,
                transactionamount: req.body.transactionamount,
                tickets: req.body.tickets || 1,
                event: req.body.eventId ? mongoose.Types.ObjectId(req.body.eventId) : undefined,
            }
            console.log(req.user)
            req.user.purchases.push(purchase);
            req.user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Some Problem Occured");
                }
                console.log(user)
                res.send({ user: user });
            });
        } else {
            res.send('failed');
        }
    })

module.exports = payRouter;