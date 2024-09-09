require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const ProductRouter = require("./Routers/ProductRouter")
const OrderRouter = require("./Routers/OrderRouter")
const AccountRouter = require("./Routers/AccountRouter")
const cors = require("cors")
const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to REST API'
    })
})


app.use('/api/products', ProductRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/accounts', AccountRouter)
app.use(limiter)

const port = process.env.PORT || 8080

mongoose.connect('mongodb://localhost:27017/lab8', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(port, () => {
            console.log('http://localhost:' + port)
        })
    })
    .catch(error => {
        console.log(error.message)
    })
