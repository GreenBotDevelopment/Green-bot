const { number } = require('mathjs');
const mongoose = require('mongoose');
const leveldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    question: { type: String, required: true },
    reponse: { type: String, required: true },


})
const CustomsQuizs = module.exports = mongoose.model('CustomsQuizs', leveldb)