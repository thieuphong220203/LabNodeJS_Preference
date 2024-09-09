const { check } = require('express-validator');

module.exports = [
    check('productCode')
        .exists().withMessage('Please enter product code')
        .notEmpty().withMessage('Product code must be required'),

    check('name')
        .exists().withMessage('Please enter product name')
        .notEmpty().withMessage('Product name must be required'),

    check('price')
        .exists().withMessage('Please enter product price')
        .notEmpty().withMessage('Product price must be required')
        .isNumeric().withMessage('Product price must be a number'),

    check('description')
        .exists().withMessage('Please enter product description')
        .notEmpty().withMessage('Product description must be required'),
];