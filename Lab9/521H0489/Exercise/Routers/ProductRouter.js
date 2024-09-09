const express = require("express")
const Router = express.Router()
const Product = require('../Models/Product')
const { validationResult } = require('express-validator');
const productValidator = require("./Validators/ProductValidators")
const authencation = require("../authentication/authentication")
const { getProducts, addProduct, getProductById, updateProduct, deleteProductById } = require("../Controller/ProductController")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

Router.get('/', getProducts)

Router.post('/', upload.single('illustrationImage'), authencation, productValidator, addProduct)

Router.get("/:id", getProductById)

Router.put("/:id", authencation, updateProduct)

Router.delete("/:id", authencation, deleteProductById)

module.exports = Router