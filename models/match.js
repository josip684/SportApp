let mongoose = require('mongoose');

//Match Schema
let matchSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    author:{
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
    },
    host_id:{
        type: String,
        required: true
    },
    guest_id:{
        type: String,
        required: true
    },
    date_of_play:{
        type: String,
        required: true
    },
    playing_time:{
        type: String,
        required: true
    },
    host_goals:{
        type: Number,
        required: true
    },
    guest_goals:{
        type: Number,
        required: true
    },
    duration:{
        type: String,
        required: true
    }
});

let Match = module.exports = mongoose.model('Match', matchSchema);