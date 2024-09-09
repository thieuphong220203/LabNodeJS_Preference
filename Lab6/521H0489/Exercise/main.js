const express = require('express')
const AccountRouter = require('./routers/AccountRouter')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('hohuuan'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())


app.use((req, res, next) => {
    req.vars = {root: __dirname}
    next()
})
app.use('/user', AccountRouter)

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login')
    }
    const user = req.session.user
    return res.render('index', { user })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))