const mongoose = require('mongoose');

const ucubeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('UcubeList', ucubeSchema);
