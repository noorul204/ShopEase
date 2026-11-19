
const express = require('express');
const router = express.Router();

const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

console.log('ORDER ROUTES FILE LOADED!');

// PLACE ORDER - logged-in users only
router.post('/', protect, async (req, res) => {
    try {
        const { customer, items } = req.body;

        if (!customer || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Customer and order items are required.'
            });
        }

        // Ensure order belongs to the logged-in account
        if (
            !customer.email ||
            customer.email.toLowerCase() !== req.user.email.toLowerCase()
        ) {
            return res.status(403).json({
                message: 'Order email must match your logged-in account.'
            });
        }

        const total = items.reduce((sum, item) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (
                !Number.isFinite(price) ||
                price < 0 ||
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error('Invalid order item price or quantity.');
            }

            return sum + price * quantity;
        }, 0);

        const newOrder = new Order({
            orderId: `SE${Date.now()}`,
            user: req.user._id,
            customer,
            items,
            total
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: 'Order saved successfully!',
            order: savedOrder
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET ORDERS - admins can see all orders
router.get('/', protect, async (req, res) => {
    try {
        const query = req.user.role === 'admin'
            ? {}
            : { user: req.user._id };

        const orders = await Order.find(query).sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
