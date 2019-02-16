const express = require('express');
const router = express.Router();

//Match Model
let Match = require('../models/match');
//User Model
let User = require('../models/user');

//Add route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_match',{
        title: 'Add Match'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res){
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('sport_id', 'Sport ID is required').notEmpty();
    req.checkBody('league_id', 'League ID is required').notEmpty();
    req.checkBody('host_id', 'Host ID is required').notEmpty();
    req.checkBody('guest_id', 'Guest ID is required').notEmpty();
    req.checkBody('date_of_play', 'Date of play is required').notEmpty();
    req.checkBody('playing_time', 'Playing time is required').notEmpty();
    req.checkBody('host_goals', 'Host goals is required').notEmpty();
    req.checkBody('guest_goals', 'Guest goals is required').notEmpty();
    req.checkBody('duration', 'Duration is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_match', {
            title:'Add Match',
            errors:errors
        });
    }else{
        let match = new Match();
        match.id = req.body.id;
        match.author = req.user._id;
        match.sport_id = req.body.sport_id;
        match.league_id = req.body.league_id;
        match.host_id = req.body.host_id;
        match.guest_id = req.body.guest_id;
        match.date_of_play = req.body.date_of_play;
        match.playing_time = req.body.playing_time;
        match.host_goals = req.body.host_goals;
        match.guest_goals = req.body.guest_goals;
        match.duration = req.body.duration;

        match.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'Match Added');
                res.redirect('/mecevi');
            }
        });
    }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Match.findById(req.params.id, function(err, match){
        /*if(match.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/mecevi');
        }*/
        res.render('edit_match',{
            title:'Edit Match',
            match:match
        });
    });
});

//Update Submit post route
router.post('/edit/:id', function(req, res){
    let match = {}
    match.id = req.body.id;
    match.author = req.body.author;
    match.sport_id = req.body.sport_id;
    match.league_id = req.body.league_id;
    match.host_id = req.body.host_id;
    match.guest_id = req.body.guest_id;
    match.date_of_play = req.body.date_of_play;
    match.playing_time = req.body.playing_time;
    match.host_goals = req.body.host_goals;
    match.guest_goals = req.body.guest_goals;
    match.duration = req.body.duration;

    let query = {_id:req.params.id}

    Match.update(query, match, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Match Updated');
            res.redirect('/mecevi');
        }
    });
});

//Delete Match
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id }

    Match.findById(req.params.id, function(err, match){
       /* if(match.author != req.user._id){
            res.status(500).send();//neda izbrisati onome koji nije autor
        }else{*/
            Match.remove(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success');
            });
        //}
    });
});

//Get Single Match
router.get('/:id', function(req, res){
    Match.findById(req.params.id, function(err, match){
        User.findById(match.author, function(err, user){
            res.render('match',{
                match:match,
                author: user.name
            });
        });
    });
});

//Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}
module.exports = router;