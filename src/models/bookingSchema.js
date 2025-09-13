const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    powerStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PowerStation',
        required: true
    },
    slotNumber: {
        type: Number,
        required: [true, 'Slot number is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    status: {
        type: String,
        enum: ['booked', 'in-progress', 'completed', 'cancelled'],
        default: 'booked'
    }
}, {
    timestamps: true  // createdAt & updatedAt
});

module.exports = mongoose.model('Booking', bookingSchema);
