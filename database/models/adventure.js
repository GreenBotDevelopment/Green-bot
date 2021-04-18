const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    UserID: { type: String, required: false },
    nom: { type: String, required: false },
    profil: { type: String, required: false },
    active: { type: String, required: false },

    start: { type: String, required: false },
    level: { type: String, required: false },
    credits: { type: String, required: false },
    xp: { type: String, required: false },
    but: { type: String, required: false },
})
const Adventure = module.exports = mongoose.model('adventure', rrdb)