const Product = require('../Models/Product')
const { validationResult } = require('express-validator');
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

const getProducts = (req, res) => {
    Product.find().select('name price description illustrationImage -_id')
        .then(products => {
            return res.json({
                code: 0,
                message: 'List of Products',
                data: products
            });
        })
        .catch(error => {
            return res.json({ code: 1, message: error.message });
        });
};

const addProduct = (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const { productCode, name, price, description } = req.body;

        const illustrationImage = req.file;
        let product = new Product({
            productCode,
            name,
            price,
            description,
            illustrationImage: illustrationImage ? illustrationImage.path : ''
        });

        product.save()
            .then(() => {
                return res.json({ code: 0, message: 'Product Added Successfully', data: product });
            })
            .catch(error => {
                return res.json({ code: 1, message: error.message });
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

const getProductById = (req, res) => {
    let { id } = req.params
    if (!id) return res.json({ code: 1, message: `No information about product ${id}` })
    Product.findById({ _id: id })
        .then(product => {
            if (product) return res.json({ code: 0, message: "Product has been found", data: product })
            else return res.json({ code: 2, message: "Product can not be found" })
        })
        .catch(error => {
            if (error.message.includes('Cast to ObjectId failed')) return res.json({ code: 3, message: "Invalid Id" })
            return res.json({ code: 3, message: error.message })
        })
}

const updateProduct = (req, res) => {
    const { id } = req.params;
    const supportedFields = ['productCode', 'name', 'price', 'description', 'illustrationImage'];
    const updatedData = {};

    for (const field of supportedFields) {
        if (req.body[field] !== undefined) {
            updatedData[field] = req.body[field];
        }
    }

    if (Object.keys(updatedData).length === 0) {
        return res.json({ code: 2, message: 'No data needs to be updated' });
    }

    Product.findByIdAndUpdate(id, updatedData, { new: true })
        .then(updatedProduct => {
            if (updatedProduct) {
                return res.json({ code: 0, message: 'Product has been updated', data: updatedProduct });
            } else {
                return res.json({ code: 2, message: 'Product not found' });
            }
        })
        .catch(error => {
            if (error.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Invalid Id' });
            }
            return res.json({ code: 3, message: error.message });
        });
};

const deleteProductById = (req, res) => {
    let { id } = req.params
    if (!id) return res.json({ code: 1, message: `No information about product ${id}` })
    Product.findByIdAndDelete({ _id: id })
        .then(product => {
            if (product) return res.json({ code: 0, message: "Product has been deleted", data: product })
            else return res.json({ code: 2, message: "Product can not be found" })
        })
        .catch(error => {
            if (error.message.includes('Cast to ObjectId failed')) return res.json({ code: 3, message: "Invalid Id" })
            return res.json({ code: 3, message: error.message })
        })
}
module.exports = {
    getProducts,
    addProduct,
    getProductById,
    updateProduct,
    deleteProductById
};