const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Events = require('../models/events')
const { isAuth } = require('./authMiddleware');

const eventRouter = express.Router();

eventRouter.use(bodyParser.json());

eventRouter
    .route('/')
    .get((req, res, next) => {
        Events.find(req.query)
            .then(
                (events) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(events);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Events.create(req.body)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /events');
    })
    .delete((req, res, next) => {
        Events.deleteMany({})
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

eventRouter
    .route('/:eventId')
    .get((req, res, next) => {
        Events.findById(req.params.eventId)
            .then(
                (event) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(event);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
            'POST operation not supported on /events/' + req.params.eventId
        );
    })
    .put((req, res, next) => {
        Events.findByIdAndUpdate(
                req.params.eventId, {
                    $set: req.body,
                }
            )
            .then(
                (event) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(event);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Events.findByIdAndDelete(req.params.eventId)
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

module.exports = eventRouter;