const mongoose = require("mongoose");
const schema = mongoose.Schema;

const announcementSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    date: Date,
    details: String
});


module.exports = mongoose.model('announcements',announcementSchema);