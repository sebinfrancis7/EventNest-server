const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Customers = require('../models/customer');
const Events = require('../models/events');

//**** to do check authentication, needs testing with facebook
const { isAuth } = require('./authMiddleware');

const customerRouter = express.Router();

customerRouter.use(bodyParser.json());

customerRouter
    .route('/')
    .get((req, res, next) => {
        Customers.find(req.query)
            .then(
                (customers) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(customers);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Customers.register(
            new Customers({ username: req.body.username }),
            req.body.password,
            (err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Registration Successful!',
                        });
                    });
                }
            }
        );
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /customers');
    })
    .delete((req, res, next) => {
        // Customers.deleteMany({})
        //     .then(
        //         (resp) => {
        //             res.statusCode = 200;
        //             res.setHeader('Content-Type', 'application/json');
        //             res.json(resp);
        //         },
        //         (err) => next(err)
        //     )
        //     .catch((err) => next(err));
        res.statusCode = 403;
        res.end('Dangerous operation, not supported');
    });

customerRouter
    .route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'You are successfully logged in!' });
    });

customerRouter
    .route('/:customerId')
    .get((req, res, next) => {
        Customers.findById(req.params.customerId)
            .then(
                (customer) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(customer);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
            'POST operation not supported on /customers/' + req.params.customerId
        );
    })
    .put((req, res, next) => {
        Customers.findByIdAndUpdate(
                req.params.customerId, {
                    $set: req.body,
                }
            )
            .then(
                (customer) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(customer);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Customers.findByIdAndDelete(req.params.customerId)
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

//idk probably won't work
customerRouter
    .route('/:customerId/purchase/:eventId')
    .post((req, res, next) => {
        Customers.findById(customerId)
            .then((customer) => {
                customer.purchases.push(req.body)
                customer.save()
            })
            .then(Events.findById(eventId)
                .then(events => {
                    events.attendees = events.attendees + req.body.tickets;
                    events.save();
                }))
            .catch((err) => next(err));
    })

module.exports = customerRouter;