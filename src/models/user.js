const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        lowercase: true, 
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        lowercase:true,
    },
    user:{
        type: String,
        required:true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    password:{
        type:String,
        require:true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    vehicle: {
        type: String,
        enum: ["two", "four"],
        required: [true, 'Vehicle info is required'],
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    
    // capacity: {
    //     type: Number,
    //     required: [true, 'Battery capacity is required (in kWh)']
    // },
    // powerRequired: {
    //     type: Number,
    //     required: [true, 'Power required is required (in kW)']
    // }
}, {
    timestamps: true  // Auto-manages createdAt and updatedAt as Date type
});

module.exports = mongoose.model('User', userSchema);
