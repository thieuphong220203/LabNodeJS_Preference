const Order = require('../Models/Order');
const Product = require('../Models/Product');
const getAllOrders = (req, res) => {
    Order.find()
        .then(orders => {
            res.json({ orders });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const calculateTotalAmount = async (productsData) => {
    try {
        const productsNames = productsData.map(product => product.productName);

        const products = await Product.find({ name: { $in: productsNames } });

        let totalAmount = 0;

        products.forEach(product => {
            const productData = productsData.find(item => item.productName === product.name);

            if (productData) {
                const { price } = product;
                const { quantity } = productData;

                totalAmount += price * quantity;
            }
        });

        return totalAmount;
    } catch (error) {
        throw new Error(error.message);
    }
};

const addNewOrder = async (req, res) => {
    const { customerName, products: productsData, status } = req.body;

    try {
        const totalAmount = await calculateTotalAmount(productsData);

        const orderProducts = productsData.map(item => ({
            productName: item.productName,
            quantity: item.quantity
        }));

        const newOrder = new Order({ customerName, products: orderProducts, totalAmount, status });

        const savedOrder = await newOrder.save();

        res.status(201).json({ order: savedOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getOrderById = (req, res) => {
    const { id } = req.params;

    Order.findById(id)
        .then(order => {
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ order });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const updateOrderById = (req, res) => {
    const { id } = req.params;
    const updatedOrderData = req.body;

    Order.findByIdAndUpdate(id, updatedOrderData, { new: true })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ updatedOrder });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const deleteOrderById = (req, res) => {
    const { id } = req.params;

    Order.findByIdAndDelete(id)
        .then(deletedOrder => {
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ message: 'Order deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

module.exports = {
    getAllOrders,
    addNewOrder,
    getOrderById,
    updateOrderById,
    deleteOrderById
};
