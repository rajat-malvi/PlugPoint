const mongoose = require('mongoose');
const validator = require('validator');

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, ['any']);  // Accepts international numbers
            },
            message: 'Please provide a valid phone number'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        default: 'manager'
    }
}, {
    timestamps: true   // createdAt & updatedAt are auto-added as Date
});

module.exports = mongoose.model('Owner', ownerSchema);
