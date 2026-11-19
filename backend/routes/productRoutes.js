
const express = require('express')
const router = express.Router()

const Product = require('../models/Product')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET all products - public access
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// ADD product - admin only
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        const savedProduct = await newProduct.save()

        res.status(201).json(savedProduct)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE product - admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            product: deletedProduct
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// UPDATE product - admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
