const express = require("express")
const Router = express.Router()
const Order = require('../Models/Order')
const { validationResult } = require('express-validator');
const authencation = require("../authentication/authentication")
const orderValidator = require("./Validators/OrderValidators")

const { getAllOrders, addNewOrder, getOrderById, updateOrderById, deleteOrderById } = require('../Controller/OrderController');


Router.get('/', authencation, getAllOrders);

Router.post('/', orderValidator, authencation, addNewOrder);

Router.get('/:id', authencation, getOrderById);

Router.put('/:id', authencation, updateOrderById);

Router.delete('/:id', authencation, deleteOrderById);

module.exports = Router