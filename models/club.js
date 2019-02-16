let mongoose = require('mongoose');

//Club Schema
let clubSchema = mongoose.Schema({
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
    },
    league_id:{
        type: String,
        required: true
    }
});

let Club = module.exports = mongoose.model('Club', clubSchema);