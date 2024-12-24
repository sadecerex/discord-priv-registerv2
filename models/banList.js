const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('banList', banSchema);
