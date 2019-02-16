let mongoose = require('mongoose');

//Sport Schema
let sportSchema = mongoose.Schema({
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
    }
});

let Sport = module.exports = mongoose.model('Sport', sportSchema);