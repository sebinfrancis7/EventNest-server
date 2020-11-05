const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const Customers = require('../models/customer');
const Events = require('../models/events');

const { isAuth } = require('./authMiddleware');

const authRouter = express.Router();

authRouter.use(bodyParser.json());

authRouter
    .route('/')
    .get(isAuth, (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, user_id: req.user });
    });

// //auth for facebook
// // sharing will require app review from facebook
// // passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['manage_pages', publish_video] }));  // to share on facebook
// authRouter
//     .route('/facebook')
//     .get((req, res, next) => {
//         passport.authenticate('cust-face');
//     });

// authRouter
// .route('/facebook')
// .get(passport.authenticate('cust-face', { failureRedirect: '/customers/login' }),(req, res, next) => {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

module.exports = authRouter;