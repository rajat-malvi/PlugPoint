

const express = require('express');
const PowerStation = require('../models/powerStation');
const express = require('express');
const Station = require('../models/station');  // Your Station Mongoose Model
const powerStationRouter = express.Router();
powerStationRouter.use(express.json());


powerStationRouter.get('/states', (req, res) => {
    try {
        const states = [
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi",
            "Jammu and Kashmir",
            "Ladakh",
            "Lakshadweep",
            "Puducherry"
        ];
        res.json({ states });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


powerStationRouter.get('/cities', (req, res) => {
    try {
        const { state } = req.query;

        if (!state) {
            return res.status(400).json({ error: "State parameter is required." });
        }

        const stateCityMap = {
            "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
            "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
            "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
            "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
            "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
            "Goa": ["Panaji", "Margao"],
            "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
            "Haryana": ["Chandigarh", "Gurugram", "Faridabad", "Panipat"],
            "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
            "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
            "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli"],
            "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
            "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
            "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
            "Manipur": ["Imphal"],
            "Meghalaya": ["Shillong"],
            "Mizoram": ["Aizawl"],
            "Nagaland": ["Kohima"],
            "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
            "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
            "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
            "Sikkim": ["Gangtok"],
            "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
            "Telangana": ["Hyderabad", "Warangal"],
            "Tripura": ["Agartala"],
            "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
            "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
            "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
            "Andaman and Nicobar Islands": ["Port Blair"],
            "Chandigarh": ["Chandigarh"],
            "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
            "Delhi": ["New Delhi", "Dwarka", "Rohini"],
            "Jammu and Kashmir": ["Srinagar", "Jammu"],
            "Ladakh": ["Leh"],
            "Lakshadweep": ["Kavaratti"],
            "Puducherry": ["Puducherry"]
        };

        const cities = stateCityMap[state];

        if (!cities) {
            return res.status(404).json({ error: "State not found or no cities available." });
        }

        res.json({ state, cities });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// // ✅ Register Power Station (Only Owner should be able to do this)
// powerStationRouter.post('/station/register', authMiddleware, async (req, res) => {
//     try {
//         const { name, location, totalSlots, powerCapacity } = req.body;

//         const powerStation = new PowerStation({
//             name: name,
//             location: location,
//             totalSlots,
//             availableSlots: totalSlots,
//             powerCapacity,
//             owner: req.ownerId   // Set by authMiddleware
//         });

//         await powerStation.save();

//         res.status(201).json({ message: 'Power Station registered successfully', powerStation });
//     } catch (error) {
//         console.error('Power Station Registration Error:', error);
//         res.status(500).json({ message: 'Failed to register power station' });
//     }
// });


// // ✅ Update Power Station Details
// powerStationRouter.put('/station/update', authMiddleware, async (req, res) => {
//     try {
//         const { stationId, name, location, totalSlots, powerCapacity, status } = req.body;

//         // Find the station and verify ownership
//         const powerStation = await PowerStation.findOne({ _id: stationId, owner: req.ownerId });

//         if (!powerStation) {
//             return res.status(404).json({ message: 'Power Station not found or not owned by you' });
//         }

//         // Update fields if provided
//         if (name) powerStation.name = name.trim();
//         if (location) powerStation.location = location.trim();
//         if (totalSlots) {
//             powerStation.totalSlots = totalSlots;
//             powerStation.availableSlots = totalSlots;  // Reset availableSlots to totalSlots (optional logic)
//         }
//         if (powerCapacity) powerStation.powerCapacity = powerCapacity;
//         if (status) powerStation.status = status;  // 'active', 'maintenance', 'offline'

//         await powerStation.save();

//         res.status(200).json({
//             message: 'Power Station updated successfully',
//             powerStation
//         });
//     } catch (error) {
//         console.error('Power Station Update Error:', error);
//         res.status(500).json({ message: 'Failed to update power station' });
//     }
// });



module.exports = powerStationRouter;

