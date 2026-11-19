
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required.'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters.'
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            message: 'Account created successfully!'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            })
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        })

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'Authentication configuration error.'
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router
