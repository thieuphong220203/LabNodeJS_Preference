const {check} = require('express-validator')


module.exports = [
    check('email')
    .exists().withMessage('Please enter email address')
    .notEmpty().withMessage('Email must be required')
    .isEmail().withMessage('Invalid email'),
    

    check('password')
    .exists().withMessage('Please enter password')
    .notEmpty().withMessage('Password must be required')
    .isLength({min:6}).withMessage("Password must be at least 6 characters"),

    check('fullname')
    .exists().withMessage('Please enter full name user')
    .notEmpty().withMessage('Fullname must be required')
    .isLength({min:6}).withMessage("Fullname must be at least 6 characters"),
]