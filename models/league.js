let mongoose = require('mongoose');

//League Schema
let leagueSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    sport_id:{
        type: String,
        required: true
    }
});

let League = module.exports = mongoose.model('League', leagueSchema);