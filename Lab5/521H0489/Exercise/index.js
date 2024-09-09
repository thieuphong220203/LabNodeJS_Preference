import express, { json } from 'express'
import { request as _request } from 'https'
import fetch from 'node-fetch'
import { rateLimit } from 'express-rate-limit'
import myParser from './middlewares/MyBodyParser.js'
import random from 'random'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'express-flash'
import { check, validationResult } from 'express-validator'

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

const validitor = [
    check('name').exists().withMessage("Please enter name").notEmpty().withMessage("Name must be  required").isLength({ min: 4 }).withMessage("Minimum name has 4 letters").isLength({ max: 40 }).withMessage("Maximum name has 20 characters"),
    check('gender').exists().withMessage("Please choose gender"),
    check('age').exists().withMessage("Please enter age").isInt().withMessage("Age must be an integer").toInt(),
    check('email').exists().withMessage("Please enter email").isEmail().withMessage("Invalid email"),
]

const app = express()
app.set("view engine", "ejs")
app.use(apiLimiter)
app.use(myParser)
app.use(cookieParser('hohuuan'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.get("/", (req, res) => {
    fetch('https://web-nodejs-502070-wiolshzi6q-uc.a.run.app/students', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(json => {
            let message = 'Đọc dữ liệu người dùng thành công'
            const mess = req.flash('message')[0]
            if (mess) {
                message = mess
            }
            res.render("index", { code: 0, message: message, users: json })
        })
        .catch(error => {
            console.log(error)
            return res.json({ code: 2, message: error.message })
        })
})

app.get("/profile/:id", (req, res) => {
    let id = req.params.id
    if (!req.params.id) {
        res.json({ code: 1, message: 'Invalid id' })
    }
    fetch('https://web-nodejs-502070-wiolshzi6q-uc.a.run.app/students/' + id, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(json => {
            res.render('profile', { code: 0, message: 'Đọc người dùng thành công', data: json })
        })
        .catch(error => {
            console.log(error)
            return res.json({ code: 2, message: error.message })
        })

})

app.get("/add", (req, res) => {
    res.render("add", { error: req.flash('error'), name: req.flash('name'), gender: req.flash('gender'), age: req.flash('age'), email: req.flash('email') })
})

app.post("/add", validitor, (req, respsone) => {
    respsone.setHeader('Content-Type', 'application/json')
    const name = req.body.name
    const gender = req.body.gender
    const age = req.body.age
    const email = req.body.email
    const result = validationResult(req)

    if (result.errors.length > 0) {
        req.flash('error', result.errors[0].msg)
        req.flash('name', name)
        req.flash('gender', gender)
        req.flash('age', age)
        req.flash('email', email)
        respsone.redirect('/add')
    } else {
        fetch('https://web-nodejs-502070-wiolshzi6q-uc.a.run.app/students/', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ id: random.int(0, 100), fullName: name, gender: gender, age: age, email: email })
        })
            .then(res => res.json())
            .then(json => {
                // console.log(json)
                req.flash('message', json.message)
                respsone.redirect('/')
            })
            .catch(error => {
                console.log(error)
                return respsone.json({ code: 2, message: error.message })
            })
    }
})

app.post('/delete/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ code: 1, message: 'Invalid id' })
    }
    const id = req.params.id
    fetch('https://web-nodejs-502070-wiolshzi6q-uc.a.run.app/students/' + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            return res.json({ code: 0, message: 'Đã xóa người dùng thành công', data: json })
        })
        .catch(error => {
            console.log(error)
            return res.json({ code: 2, message: error.message })
        })
})

app.post('/edit/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ code: 1, message: 'Invalid id' })
    }
    const id = req.params.id
    console.log(req.body)
    fetch('https://web-nodejs-502070-wiolshzi6q-uc.a.run.app/students/' + id, {
        method: 'PUT',
        body: JSON.stringify(req.body)
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            return res.json({ code: 0, message: 'Đã cập nhật người dùng thành công', data: json })
        })
        .catch(error => {
            console.log(error)
            return res.json({ code: 2, message: error.message })
        })

})

app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.render("error")
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log('http://localhost:' + port))
