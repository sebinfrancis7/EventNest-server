const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const Customers = require('../models/customer');
const Organizers = require('../models/organizer');
const Events = require('../models/events');

const { isAuth } = require('./authMiddleware');

const authRouter = express.Router();

authRouter.use(bodyParser.json());

authRouter
    .route('/')
    .get(isAuth, (req, res, next) => {
        let userPrototype = Object.getPrototypeOf(req.user);
        if (userPrototype === Customers.prototype) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'authRouterlication/json');
            res.json({ user: req.user, type: 'customer' });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'authRouterlication/json');
            res.json({ user: req.user, type: 'organizer' });
        }
    });


authRouter
    .get('/facebook', passport.authenticate('cust-face'));

authRouter
    .get('/facebook/callback',
        passport.authenticate('cust-face', { failureRedirect: 'https://localhost:3000/signin' }),
        function(req, res) {
            res.redirect('https://localhost:3000/');
        });

authRouter
    .get('/google', passport.authenticate('cust-google', { scope: ['profile'] }));

authRouter
    .get('/google/callback',
        passport.authenticate('cust-google', { failureRedirect: 'https://localhost:3000/signin' }),
        function(req, res) {
            res.redirect('https://localhost:3000/');
        });

authRouter
    .get('/twitter', passport.authenticate('cust-twitter'));

authRouter
    .get('/twitter/callback',
        passport.authenticate('cust-twitter', {
            successRedirect: 'https://localhost:3000/',
            failureRedirect: 'https://localhost:3000/signin'
        }));

module.exports = authRouter;