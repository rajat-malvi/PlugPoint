const mongoose = require('mongoose');
const validator = require('validator');

const powerStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Power Station name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    totalSlots: {
        type: Number,
        required: [true, 'Total slots are required'],
        min: [1, 'There must be at least 1 slot']
    },
    availableSlots: {
        type: Number,
        required: true,
        min: [0, 'Available slots cannot be negative']
    },
    powerCapacity: {
        type: Number,
        required: [true, 'Power capacity is required (in kW)']
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'offline'],
        default: 'active'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    }
}, {
    timestamps: true  // Adds createdAt & updatedAt
});

module.exports = mongoose.model('PowerStation', powerStationSchema);
