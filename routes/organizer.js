const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Organizers = require('../models/organizer');
const Events = require('../models/events');

//**** to do check authentication, needs testing with facebook
const { isAuth } = require('./authMiddleware');

const organizerRouter = express.Router();

organizerRouter.use(bodyParser.json());

organizerRouter
    .route('/')
    .get((req, res, next) => {
        Organizers.find(req.query)
            .then(
                (Organizers) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(Organizers);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Organizers.register(
            new Organizers({ username: req.body.username }),
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
        res.end('PUT operation not supported on /Organizers');
    })
    .delete((req, res, next) => {
        // Organizers.deleteMany({})
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

organizerRouter
    .route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'You are successfully logged in!' });
    });

organizerRouter
    .route('/:organizerId')
    .get((req, res, next) => {
        Organizers.findById(req.params.organizerId)
            .then(
                (organizer) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(organizer);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
            'POST operation not supported on /Organizers/' + req.params.organizerId
        );
    })
    .put((req, res, next) => {
        Organizers.findByIdAndUpdate(
                req.params.organizerId, {
                    $set: req.body,
                }
            )
            .then(
                (organizer) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(organizer);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Organizers.findByIdAndDelete(req.params.organizerId)
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

//needs change dont use req.body
organizerRouter
    .route('/:organizerId/events')
    .post((req, res, next) => {
        Events.create(req.body)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            .catch(err => next(err))
    })

module.exports = organizerRouter;