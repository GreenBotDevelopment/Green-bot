const { number } = require('mathjs');
const mongoose = require('mongoose');
const leveldb = new mongoose.Schema({
    userID: { type: String, required: true },
    xp: { type: Number, required: true },
    level: { type: Number, required: true },
    quizs: { type: Number, required: true },
    Corrects: { type: Number, required: true },

})
const QuizBD = module.exports = mongoose.model('quiz', leveldb)