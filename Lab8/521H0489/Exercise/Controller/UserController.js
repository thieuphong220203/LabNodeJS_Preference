const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const Account = require('../Models/Account');


const getAccounts= (req, res) => {
    Product.find().select('email password fullname -_id')
    .then(accounts => {
        return res.json({
            code: 0,
            message: 'List of Accounts',
            data: accounts
        })
    })
    .catch(error => {
        return res.json({ code: 1, message: error.message });
    });
}

const register = (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { email, password, fullname } = req.body;
        Account.findOne({ email: email })
            .then(account => {
                if (account) {
                    throw new Error(`Account with ${email} already exists`);
                }
                return bcrypt.hash(password, 10);
            })
            .then(hashed => {
                let user = new Account({
                    email: email,
                    password: hashed,
                    fullname: fullname,
                });
                return user.save();
            })
            .then(() => {
                return res.json({ code: 0, message: 'Registration successful' });
            })
            .catch(error => {
                return res.json({ code: 2, message: error.message });
            });
    } else {
        let messages = result.mapped();
        let message = '';
        for (mess in messages) {
            message = messages[mess].msg;
            break;
        }
        res.json({ code: 1, message: message });
    }
};

const login = (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { email, password } = req.body;
        let mainAccount;
        Account.findOne({ email: email })
            .then(account => {
                if (!account) {
                    throw new Error(`Account with ${email} does not exist`);
                }
                mainAccount = account;
                return bcrypt.compare(password, account.password);
            })
            .then((passwordMatch) => {
                if (!passwordMatch) {
                    return res.status(401).json({ code: 3, message: 'Failed to login' });
                }
                const { JWT_SECRET } = process.env;
                jwt.sign({
                    email: mainAccount.email,
                    fullname: mainAccount.fullname
                }, JWT_SECRET, {
                    expiresIn: '1h'
                }, (error, token) => {
                    if (error) throw error;
                    return res.json({
                        code: 0,
                        message: "Login successful",
                        token: token
                    });
                });
            })
            .catch(error => {
                return res.status(401).json({ code: 2, message: error.message });
            });
    } else {
        let messages = result.mapped();
        let message = '';
        for (mess in messages) {
            message = messages[mess].msg;
            break;
        }
        res.json({ code: 1, message: message });
    }
};

module.exports = {
    getAccounts,
    register,
    login
};