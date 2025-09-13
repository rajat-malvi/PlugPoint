const express = require('express');
const PowerStation = require('../models/powerStation');
const {userAuth} = require("../middelware/auth")
const mongoose = require('mongoose');
const Booking = require('../models/bookingSchema');


const powerStationRouter = express.Router();
powerStationRouter.use(express.json());


powerStationRouter.get('/states',userAuth,(req, res) => {
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


powerStationRouter.get('/cities',userAuth, (req, res) => {
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


powerStationRouter.post('/search', userAuth, (req, res) => {
    try {
        const { state, city, station_type} = req.body;
        // let filteredStations = ;
        // self define
        const status = 'active'

        if (state) {
            filteredStations = filteredStations.filter(
                station => station.state.toLowerCase() === state.toLowerCase()
            );
        }

        if (city) {
            filteredStations = filteredStations.filter(
                station => station.city.toLowerCase() === city.toLowerCase()
            );
        }

        // can me more filter
        if (connector_types) {
            filteredStations = filteredStations.filter(station =>
                station.station_type.some(connection =>
                    connection.toLowerCase() === station_type.toLowerCase()
                )
            );
        }

        if (status) {
            filteredStations = filteredStations.filter(
                station => station.status.toLowerCase() === status.toLowerCase()
            );
        }

        res.json({
            count: filteredStations.length,
            stations: filteredStations
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong in the search API"
        });
    }
});



// powerStationRouter.get("/stationInfo/{id}",(req, res)=>{
//     try{
//         const stationId = req.perams.id;
//     }catch{
//     }
// })

powerStationRouter.post('/booking', userAuth, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        const { powerStation, slotNumber, startTime, endTime } = req.body;
        const userId = req.user._id;

        // 1. Input Validation
        if (!powerStation || !slotNumber || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "powerStation, slotNumber, startTime, and endTime are required"
            });
        }

        // 2. Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(powerStation)) {
            return res.status(400).json({
                success: false,
                message: "Invalid powerStation ID format"
            });
        }

        // 3. Parse and validate dates
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format for startTime or endTime"
            });
        }

        // 4. Business Logic Validations
        
        // Start time should be in the future (at least 5 minutes from now)
        const minBookingTime = new Date(now.getTime() + 5 * 60 * 1000);
        if (start < minBookingTime) {
            return res.status(400).json({
                success: false,
                message: "Booking start time must be at least 5 minutes from now"
            });
        }

        // End time should be after start time
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }

        // Validate 30-minute slot duration
        const diffMinutes = (end - start) / (1000 * 60);
        if (diffMinutes !== 30) {
            return res.status(400).json({
                success: false,
                message: "Each slot must be exactly 30 minutes"
            });
        }

        // Validate slot number (assuming 1-10 slots per station)
        if (!Number.isInteger(slotNumber) || slotNumber < 1 || slotNumber > 10) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot number. Must be between 1 and 10"
            });
        }

        // Validate booking is not too far in the future (e.g., max 30 days)
        const maxBookingTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (start > maxBookingTime) {
            return res.status(400).json({
                success: false,
                message: "Cannot book more than 30 days in advance"
            });
        }

        // 5. Check if power station exists and is active
        const station = await PowerStation.findById(powerStation).session(session);
        if (!station) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Power station not found"
            });
        }

        if (station.status !== 'active') {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Power station is not currently available for booking"
            });
        }

        // Check if the requested slot number exists at this station
        if (slotNumber > station.totalSlots) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Slot ${slotNumber} does not exist. Station has only ${station.totalSlots} slots`
            });
        }

        // 6. Check for existing bookings (conflict detection)
        const conflictingBooking = await Booking.findOne({
            powerStation: powerStation,
            slotNumber: slotNumber,
            status: { $in: ['booked', 'in-progress'] },
            $or: [
                // New booking starts during existing booking
                { startTime: { $lte: start }, endTime: { $gt: start } },
                // New booking ends during existing booking
                { startTime: { $lt: end }, endTime: { $gte: end } },
                // New booking completely contains existing booking
                { startTime: { $gte: start }, endTime: { $lte: end } },
                // Existing booking completely contains new booking
                { startTime: { $lte: start }, endTime: { $gte: end } }
            ]
        }).session(session);

        if (conflictingBooking) {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message: "This slot is already booked for the selected time period",
                conflictingBooking: {
                    startTime: conflictingBooking.startTime,
                    endTime: conflictingBooking.endTime
                }
            });
        }

        // 7. Check user's existing bookings (prevent multiple simultaneous bookings)
        const userActiveBooking = await Booking.findOne({
            user: userId,
            status: { $in: ['booked', 'in-progress'] },
            $or: [
                { startTime: { $lte: start }, endTime: { $gt: start } },
                { startTime: { $lt: end }, endTime: { $gte: end } },
                { startTime: { $gte: start }, endTime: { $lte: end } },
                { startTime: { $lte: start }, endTime: { $gte: end } }
            ]
        }).session(session);

        if (userActiveBooking) {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message: "You already have an active booking during this time period"
            });
        }

        // 8. Check daily booking limit per user (e.g., max 3 bookings per day)
        const startOfDay = new Date(start);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(start);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyBookingsCount = await Booking.countDocuments({
            user: userId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['booked', 'in-progress', 'completed'] }
        }).session(session);

        if (dailyBookingsCount >= 3) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Daily booking limit exceeded. Maximum 3 bookings per day allowed"
            });
        }

        // 9. Validate operating hours
        const bookingHour = start.getHours();
        const bookingMinutes = start.getMinutes();
        const stationOpenHour = station.operatingHours?.open || 6; // Default 6 AM
        const stationCloseHour = station.operatingHours?.close || 22; // Default 10 PM

        if (bookingHour < stationOpenHour || bookingHour >= stationCloseHour) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Station operates from ${stationOpenHour}:00 to ${stationCloseHour}:00`
            });
        }

        // 10. Create the booking
        const newBooking = new Booking({
            user: userId,
            powerStation: powerStation,
            slotNumber: slotNumber,
            startTime: start,
            endTime: end,
            status: 'booked'
        });

        await newBooking.save({ session });

        // 11. Update station's booking count/statistics if needed
        await PowerStation.findByIdAndUpdate(
            powerStation,
            { 
                $inc: { totalBookings: 1 },
                lastBookingAt: now
            },
            { session }
        );

        await session.commitTransaction();

        // 12. Return success response with populated data
        const populatedBooking = await Booking.findById(newBooking._id)
            .populate('user', 'name email phone')
            .populate('powerStation', 'name address location');

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking: populatedBooking,
                bookingReference: newBooking._id
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Booking creation error:', error);

        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate booking detected"
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data format provided"
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Internal server error occurred while creating booking",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });

    } finally {
        await session.endSession();
    }
});

// Get today's available slots only
powerStationRouter.get('/available-slots/:stationId', userAuth, async (req, res) => {
    try {
        const { stationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(stationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid station ID format"
            });
        }

        const station = await PowerStation.findById(stationId);
        if (!station) {
            return res.status(404).json({
                success: false,
                message: "Power station not found"
            });
        }

        if (station.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: "Power station is not currently available"
            });
        }

        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        // Get all bookings for today
        const todaysBookings = await Booking.find({
            powerStation: stationId,
            startTime: { $gte: startOfToday, $lte: endOfToday },
            status: { $in: ['booked', 'in-progress'] }
        }).select('slotNumber startTime endTime');

        const availableSlots = [];
        const operatingStart = station.operatingHours?.open || 6;
        const operatingEnd = station.operatingHours?.close || 22;

        for (let slot = 1; slot <= station.totalSlots; slot++) {
            for (let hour = operatingStart; hour < operatingEnd; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const slotStart = new Date(now);
                    slotStart.setHours(hour, minute, 0, 0);
                    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

                    // Skip if slot is in the past (must be at least 5 minutes from now)
                    const minBookingTime = new Date(now.getTime() + 5 * 60 * 1000);
                    if (slotStart < minBookingTime) {
                        continue;
                    }

                    // Skip if slot is already booked
                    const isBooked = todaysBookings.some(booking => 
                        booking.slotNumber === slot &&
                        booking.startTime.getTime() === slotStart.getTime()
                    );

                    if (!isBooked) {
                        availableSlots.push({
                            slotNumber: slot,
                            startTime: slotStart,
                            endTime: slotEnd
                        });
                    }
                }
            }
        }

        res.json({
            success: true,
            data: {
                date: now.toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
                station: {
                    id: station._id,
                    name: station.name,
                    totalSlots: station.totalSlots,
                    operatingHours: {
                        open: operatingStart,
                        close: operatingEnd
                    }
                },
                availableSlots: availableSlots,
                totalAvailable: availableSlots.length
            }
        });

    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching available slots"
        });
    }
});

module.exports = powerStationRouter;