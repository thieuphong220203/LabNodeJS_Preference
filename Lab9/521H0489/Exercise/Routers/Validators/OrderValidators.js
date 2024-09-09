const {check} = require('express-validator')

module.exports = [
    check('customerName')
    .exists().withMessage('Please enter customerName')
    .notEmpty().withMessage('CustomerName must be required'),    

    check('products')
    .exists().withMessage('Please enter products')
    .notEmpty().withMessage('Products must be required')
]