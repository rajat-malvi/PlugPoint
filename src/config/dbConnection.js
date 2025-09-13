const mongoose = require('mongoose');

const dbConnect = async () => {
    const url = 'mongodb+srv://rajatmalviya:Rajat%401234@plugpoint.vltoyvm.mongodb.net/evstation?retryWrites=true&w=majority';
    await mongoose.connect(url);
};

module.exports = dbConnect;
