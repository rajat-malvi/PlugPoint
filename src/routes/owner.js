const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {calculateOperationalHours} = require("../utils/calculation")


// const validator = require("validator");
const cookieParser = require('cookie-parser');
const Owner = require("../models/owner");

const ownerRouter = express.Router();
authRouter.use(express.json());
authRouter.use(cookieParser());

// ✅ Owner Signup
ownerRouter.post('/owner/signup', async (req, res) => {
    try {
        let { name, email,password } = req.body;

        // Simple sanitization
        name = name;
        email = email;

        const hashedPassword = await bcrypt.hash(password, 10);

        const ownerData = new Owner({
            name,
            email,
            password: hashedPassword
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


ownerRouter.post('/powerstation/register', async (req, res) => {
    try {
        const { name, state, city, address, station_type, open_time, close_time } = req.body;

        // Validate required fields
        if (!name ||  !state || !city || !address || !station_type || !open_time || !close_time
        ) {
            return res.status(400).json({ error: "All fields (address, geo_cord, description, station_type, hours) are required." });
        }
        
        // Validate minimum operating hours
        hours = calculateOperationalHours(open_time,close_time)

        if (hours < 2) {
            return res.status(400).json({ error: "Operating hours should be at least 2." });
        }

        // Create new power station document
        const newPowerStation = new PowerStation({
            name,
            city,
            state,
            address,
            open_time,
            close_time,
            // location, 
            station_type,
            totalSlots : station_type.length,
            availableSlots: station_type.length
        });

        await newPowerStation.save();
        return res.status(201).json({ message: "Power station registered successfully.", powerStation: newPowerStation });
    } catch (err) {
        console.error('Error registering power station:', err);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
});



module.exports = ownerRouter;