const express = require("express");
var jwt = require("jsonwebtoken");
const { createUsers, getUsers } = require('../handlers/users')
const { header, validationResult } = require("express-validator");
const verifyToken = require('../middlewares/token');
const users = require('../models/users')
require('dotenv').config()

const router = express.Router();
const jwtKey = process.env.JWTKEY

router.post('/register', [
    header('username', 'All fields are required...').isLength({ min: 3 }),
    header('gender', 'All fields are required...').isLength({ min: 3 }),
    header('address', 'All fields are required...').isLength({ min: 3 }),
    header('number', 'All fields are required...').isLength({ min: 10 }),
    header('password', 'All fields are required...').isLength({ min: 8 }),
    header('email', 'All fields are required...').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(411).json({
            id: 2,
            statusCode: 411,
            type: 'error',
            message: "Credentials fields are not filled up properly",
            errors: errors.array(),
        });
    } else if (errors.isEmpty()) {
        try {
            let userEmail = await users.findOne({
                _email: req.header('email')
            })

            if (userEmail) {
                return res.status(409).json({
                    id: 17,
                    statusCode: 409,
                    type: 'error',
                    message: "Email already registered!",
                });
            } else {
                const { user, createError } = await createUsers({
                    username: req.header('username'),
                    gender: req.header('gender'),
                    email: req.header('email'),
                    number: req.header('number'),
                    address: req.header('address'),
                    password: req.header('password')
                })

                if (createError) {
                    return res.status(409).json({
                        id: 17,
                        statusCode: 409,
                        type: 'error',
                        message: createError,
                    });
                } else {
                    const payload = {
                        credentials: {
                            id: user._id,
                        },
                    };
                    var token = jwt.sign(payload, jwtKey);
                    res.status(201).json({
                        id: 13,
                        statusCode: 201,
                        message: "User registered succesfully",
                        credentials: {
                            authToken: token,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                id: 20,
                statusCode: 500,
                type: 'error',
                message: "Internal server error",
            });
        }
    }
})

router.get('/login', [
    header('usercred', 'All fields are required...').isLength({ min: 3 }),
    header('password', 'All fields are required...').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(411).json({
            id: 2,
            statusCode: 411,
            message: "Credentials fields are not filled up properly",
            type: 'error',
            errors: errors.array(),
        });
    } else if (errors.isEmpty()) {
        try {
            if (req.header('usercred').indexOf('@') > 0) {
                const userEmail = req.header('usercred')

                const { user, message, getError } = await getUsers({
                    email: userEmail,
                    password: req.header('password')
                })

                if (getError) {
                    return res.status(411).json({
                        id: 2,
                        statusCode: 411,
                        type: 'error',
                        message: "Wrong credentials entered",
                    });
                } else if (message === 'success' && user) {
                    const payload = {
                        credentials: {
                            id: user._id,
                        },
                    };
                    var token = jwt.sign(payload, jwtKey);
                    return res.status(200).json({
                        id: 14,
                        statusCode: 200,
                        message: "Login successfull",
                        credentials: {
                            authToken: token,
                        },
                    });
                } else {
                    return res.status(400).json({
                        id: 13,
                        statusCode: 200,
                        type: 'error',
                        message: "Wrong credentials entered",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                id: 20,
                statusCode: 500,
                type: 'error',
                message: "Internal server error",
            });
        }
    }
})

router.get('/user', verifyToken, async (req, res) => {
    try {
        const { user, getError } = await getUsers({ id: req.credentials.id })

        if (getError) {
            res.status(400).json({
                id: 20,
                statusCode: 400,
                type: 'error',
                message: getError,
            });
        } else {
            res.status(200).json({
                id: 20,
                statusCode: 200,
                message: 'User data fetched successfully',
                user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            id: 20,
            statusCode: 500,
            type: 'error',
            message: "Internal server error",
        });
    }
})

module.exports = router