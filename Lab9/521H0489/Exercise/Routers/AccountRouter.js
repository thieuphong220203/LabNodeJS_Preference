const express = require("express")
const Router = express.Router()
const bcrypt = require('bcrypt')
const Account = require('../Models/Account')
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator');
const userController = require('../Controller/UserController')

const registerValidator = require('./Validators/RegisterValidators')
const loginValidators = require('./Validators/LoginValidators')


Router.get('/', userController.getAccounts)

Router.post('/login', loginValidators, userController.login);

Router.post('/register', registerValidator, userController.register);

module.exports = Router 