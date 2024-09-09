require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connect successully');
    } catch (e) {
        console.log('connect fail');
    }
}
module.exports = { connect };
