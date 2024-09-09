const express = require('express')
const { check, validationResult } = require('express-validator')
const database = require('../database.js')
const bcrypt = require('bcrypt')
const fs = require('fs')
const Router = express.Router()

Router.use(express.urlencoded())

Router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }
    const error = req.flash('error') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''
    return res.render('login', { error, email, password })
})

const loginValidator = [
    check('email').exists().withMessage("Please enter email")
        .notEmpty().withMessage("Required email")
        .isEmail().withMessage("This is an invalid email"),

    check('password').exists().withMessage("Please enter password")
        .notEmpty().withMessage("Required password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 letters"),
]

Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const { email, password } = req.body


        const sql = 'SELECT * FROM account WHERE email = ?'
        const params = [email]

        database.query(sql, params, (error, result, fields) => {
            if (error) {
                req.flash('error', error.message)
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/user/login')
            } else if (result.length === 0) {
                req.flash('error', "Email is not existed")
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/user/login')
            } else {
                const hashed = result[0].password
                const match = bcrypt.compareSync(password, hashed)
                if (!match) {
                    req.flash('error', "Password is incorrect")
                    req.flash('email', email)
                    req.flash('password', password)
                    return res.redirect('/user/login')
                } else {
                    req.session.user = result[0]
                    return res.redirect('/')
                }
            }
        })
    } else {
        result = result.mapped()

        let message
        for (fields in result) {
            message = result[fields].msg
            break
        }
        const { email, password } = req.body
        req.flash('error', message)
        req.flash('email', email)
        req.flash('password', password)
        return res.redirect('/user/login')
    }
})

Router.get('/logout', (req, res) => {
    req.session.user = null
    return res.redirect("/user/login")
})

Router.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''
    res.render('register', { error, name, email, password })
})

const registerValidator = [
    check('name').exists().withMessage("Please enter user name")
        .notEmpty().withMessage("Required user name")
        .isLength({ min: 6 }).withMessage("User name must be at least 6 letters"),

    check('email').exists().withMessage("Please enter email")
        .notEmpty().withMessage("Required email")
        .isEmail().withMessage("This is an invalid email"),

    check('password').exists().withMessage("Please enter password")
        .notEmpty().withMessage("Required password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 letters"),

    check('confirmPassword').exists().withMessage("Please enter confirm password")
        .notEmpty().withMessage("Required confirm password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password does not match")
            }
            return true
        })
]

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req)

    if (result.errors.length === 0) {
        const { name, email, password } = req.body

        const hashed = bcrypt.hashSync(password, 10)

        const sql = 'insert into account(name, email, password) values(?,?,?)'
        const params = [name, email, hashed]

        database.query(sql, params, (error, result, fields) => {
            if (error) {
                req.flash('error', error.message)
                req.flash('name', name)
                req.flash('email', email)
                req.flash('password', password)
                res.redirect('/user/register')
            } else if (result.affectedRows === 1) {
                const {root} = req.vars
                const userDir = `${root}/users/${email}`
                fs.mkdir(userDir, () => {
                    return res.redirect("/user/login")
                })   
            }
            req.flash('error', "Register Failed")
            req.flash('name', name)
            req.flash('email', email)
            req.flash('password', password)
            res.redirect('/user/register')
        })

        return
    }
    result = result.mapped()

    let message
    for (fields in result) {
        message = result[fields].msg
        break
    }
    const { name, email, password } = req.body
    req.flash('error', message)
    req.flash('name', name)
    req.flash('email', email)
    req.flash('password', password)
    res.redirect('/user/register')
})

module.exports = Router