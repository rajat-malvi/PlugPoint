const mongoose = require('mongoose');
const { trim } = require('validator');

// Geo coordinates schema
const geoCordSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { _id: false });  // No separate _id for geo coordinates

// Power Station schema
const powerStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Power Station name is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    address:{
        type:String,
        require:true,
        trim:true
    },
    open_time: {
        type: String,
        required: [true, 'Open time is required'],
        trim: true
    },
    close_time: {
        type: String,
        required: [true, 'Close time is required'],
        trim: true
    },
    // location: {
    //     type: geoCordSchema,
    //     required: [true, 'Location is required']
    // },
    station_type: {
        type: [String],
        required: [true, 'Station type is required']
    },
    totalSlots: {
        type: Number,
        required: [true, 'Total slots are required'],
        min: [1, 'There must be at least 1 slot']
    },
    availableSlots: {
        type: Number,
        required: [true, 'Available slots are required'],
        min: [0, 'Available slots cannot be negative']
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'offline'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Adds createdAt & updatedAt fields
});

module.exports = mongoose.model('PowerStation', powerStationSchema);
