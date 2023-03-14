const users = require('../models/users')
const sha3 = require('crypto-js/sha3')

const createUsers = async ({ username, email, number, address, gender, password }) => {
    try {
        const user = await users.create({
            _username: username,
            _gender: gender,
            _address: address,
            _number: number,
            _email: email,
            _password: sha3(password)
        })

        if (user) {
            return {
                user
            };
        } else {
            return {
                createError: 'User registration failed...'
            }
        }
    } catch (error) {
        return {
            createError: 'User registration denied...'
        }
    }
}

const getUsers = async ({ username, id, email, password }) => {
    try {
        if (username) {
            const user = await users.findOne({
                _username: username
            })

            if (user) {
                const hashedPassword = sha3(password).toString();
                if (user._password === hashedPassword) {
                    return {
                        user,
                        message: 'success'
                    }
                } else {
                    return {
                        message: 'mismatch'
                    }
                }
            } else {
                return {
                    getError: 'failed'
                }
            }
        } else if (email) {
            const user = await users.findOne({
                _email: email
            })

            if (user) {
                const hashedPassword = sha3(password).toString();
                if (user._password === hashedPassword) {
                    return {
                        user,
                        message: 'success'
                    }
                } else {
                    return {
                        message: 'mismatch'
                    }
                }
            } else {
                return {
                    getError: 'failed'
                }
            }
        } else if (id) {
            const user = await users.findById(id).select("-_password")

            if (user) {
                return { user }
            } else {
                return {
                    getError: 'Userr fetching thread failed'
                }
            }
        }
    } catch (error) {
        return {
            getError: 'User fetching thread denied'
        }
    }
}

module.exports = {
    createUsers,
    getUsers
}