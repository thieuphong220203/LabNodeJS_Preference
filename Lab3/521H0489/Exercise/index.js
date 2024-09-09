const express = require("express");
const bodyParser = require("body-parser");
const emailValidator = require("email-validator")
const multer = require("multer")
const fs = require("fs");
const session = require("express-session")
require('dotenv').config()

const app = express();
let list = []

const upload = multer({
    dest: 'upload',
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('Only image files are allowed.'));
        }
    }
});
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/upload', express.static('upload'))
app.use(session({ secret: 'secret_password_here' }))

app.get("/", (req, res) => {
    if (!req.session.user) {
        res.redirect('/login')
    }
    else if (req.query.addSuccess === 'true') {
        // console.log("hello")
        res.render('index', { products: list, successMessage: 'Add product successfully' });
    }
    else if (req.query.updateSuccess === 'true') {
        res.render('index', { products: list, successMessage: 'Update product successfully' });
    }
    else res.render('index', { products: list, successMessage: '' })
})

app.get("/product/:id", (req, res) => {
    let id = req.params.id
    let index = list.findIndex(element => element.id === id)
    let product = list.at(index)
    res.render('product', { product });
})

app.get("/add", (req, res) => {
    res.render('add', {
        errorMessage: "",
        name: '',
        price: '',
        description: '',
    })
})

app.post("/add", (req, res) => {
    let uploader = upload.single('image')
    uploader(req, res, err => {
        let { name, price, description } = req.body
        let image = req.file

        let error = ''

        if (!name) {
            error = "Please input valid name product"
        }
        else if (!price) {
            error = "Please input valid price product"
        }
        else if (parseInt(price) < 0) {
            error = "Please input valid price product"
        }
        else if (!description) {
            error = "Please input description product"
        }
        else if (error) {
            error = "Image too big"
        }
        else if (!image) {
            error = "No image or invalid image"
        }

        if (error.length > 0) {
            res.render('add', {
                errorMessage: error,
                name: name,
                price: price,
                description: description
            })
        }

        else {
            let imagePath = `upload/${image.originalname}`
            fs.renameSync(image.path, imagePath)

            let product = {
                id: generateShortUUID(),
                name: name,
                price: parseInt(price),
                description: description,
                image: imagePath
            }

            list.push(product)
            res.redirect("/?addSuccess=true")
        }
    })
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect("/")
    }
    else res.render('login', { errorMessage: '', email: '', password: '' })
})

app.post("/login", (req, res) => {
    let { inputEmail, inputPassword } = req.body
    let error = ''
    if (!inputEmail) {
        error = "Please input email"
    }
    else if (!emailValidator.validate(inputEmail)) {
        error = "Wrong format"
    }
    else if (!inputPassword) {
        error = "Please input password"
    }
    else if (inputPassword < 6) {
        error = "Password must have 6 or more words"
    }
    else if (inputEmail != process.env.EMAIL) {
        error = "Wrong email"
    }
    else if (inputPassword != process.env.PASSWORD) {
        error = "Wrong password"
    }

    if (error.length > 0) {
        res.render('login', {
            errorMessage: error,
            email: inputEmail,
            password: inputPassword
        })
    }
    else {
        req.session.user = inputEmail;
        res.set('Content-Type', 'text/html')
        res.redirect("/")
    }
})

app.post("/delete", (req, res) => {
    let { id } = req.body
    if (!id) {
        res.json({ code: 1, message: "Invalid id" })
    }
    else if (!list.findIndex(element => element.id === req.params.id)) {
        res.json({ code: 2, message: "Not found id" })
    }
    else {
        let p = list.at(list.findIndex(element => element.id === req.params.id))
        list.splice(p, 1);
        res.json({ code: 0, message: "Delete product successfully", data: p })
    }
})

app.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    let index = list.findIndex((element) => element.id === id);
    if (index === -1) {
        res.redirect("/?error=true&message=Invalid product id");
    } else {
        let product = list[index];
        res.render("edit", { product, errorMessage: "" });
    }
});

app.post("/edit/:id", (req, res) => {
    let id = req.params.id;
    let index = list.findIndex((element) => element.id === id);
    if (index === -1) {
        res.redirect("/?error=true&message=Invalid product id");
    } else {
        let { name, price, description } = req.body;
        let product = list[index];

        let error = "";

        if (!name) {
            error = "Please input a valid product name";
        } else if (!price) {
            error = "Please input a valid product price";
        } else if (parseInt(price) < 0) {
            error = "Please input a valid product price";
        } else if (!description) {
            error = "Please input a product description";
        }

        if (error.length > 0) {
            res.render("edit", {
                product,
                errorMessage: error,
            });
        } else {
            product.name = name;
            product.price = parseInt(price);
            product.description = description;

            res.redirect("/?updateSuccess=true");
        }
    }
});

app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.render("error")
})

let port = process.env.PORT || 8080
app.listen(port, () => console.log('http://localhost:' + port))

function generateShortUUID() {
    const standardUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return standardUUID.replace(/-/g, '');
}


const requestCounts = new Map();

function rateLimitMiddleware(req, res, next) {
    const source = req.ip;
    const limit = 100;
    const windowMs = 60000;

    if (requestCounts.has(source)) {
        const count = requestCounts.get(source);
        requestCounts.set(source, count + 1);

        if (count >= limit) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }
    } else {
        requestCounts.set(source, 1);
    }

    setTimeout(() => {
        requestCounts.delete(source);
    }, windowMs);

    next();
}

app.use(rateLimitMiddleware);