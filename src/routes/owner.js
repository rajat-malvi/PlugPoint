const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const validator = require("validator");
const cookieParser = require('cookie-parser');
const Owner = require("../models/owner");


const ownerRouter = express.Router();
authRouter.use(express.json());
authRouter.use(cookieParser());

// ✅ Owner Signup
ownerRouter.post('/owner/signup', async (req, res) => {
    try {
        let { name, email, phone, password, role } = req.body;

        // Simple sanitization
        name = name;
        email = email;
        phone = phone;
        role = role;

        const hashedPassword = await bcrypt.hash(password, 10);

        const ownerData = new Owner({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await ownerData.save();

        res.status(201).json({ message: 'Owner registered successfully' });
    } catch (error) {
        console.error('Owner Signup Error:', error);
        res.status(500).json({ message: 'Something went wrong during owner signup' });
    }
});

// ✅ Owner Login
ownerRouter.post('/owner/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const owner = await Owner.findOne({ email: email.toLowerCase().trim() });

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const isValid = await bcrypt.compare(password, owner.password);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: owner._id }, 'powerplug', { expiresIn: '1h' });

        res.cookie('token', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true
        });

        res.status(200).json({ message: 'Owner login successful', token });
    } catch (error) {
        console.error('Owner Login Error:', error);
        res.status(500).json({ message: 'Something went wrong during login' });
    }
});



module.exports = ownerRouter;