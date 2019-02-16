const express = require('express');
const router = express.Router();

//Club Model
let Club = require('../models/club');
//User Model
let User = require('../models/user');

//Add route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_club',{
        title: 'Add Club'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res){
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('sport_id', 'Sport ID is required').notEmpty();
    req.checkBody('league_id', 'League ID is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_club', {
            title:'Add Club',
            errors:errors
        });
    }else{
        let club = new Club();
        club.id = req.body.id;
        club.author = req.user._id;
        club.name = req.body.name;
        club.sport_id = req.body.sport_id;
        club.league_id = req.body.league_id;

        club.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'Club Added');
                res.redirect('/klubovi');
            }
        });
    }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Club.findById(req.params.id, function(err, club){
        /*if(club.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/klubovi');
        }*/
        res.render('edit_club',{
            title:'Edit Club',
            club:club
        });
    });
});

//Update Submit post route
router.post('/edit/:id', function(req, res){
    let club = {}
    club.id = req.body.id;
    club.author = req.body.author;
    club.name = req.body.name;
    club.sport_id = req.body.sport_id;
    club.league_id = req.body.league_id;

    let query = {_id:req.params.id}

    Club.update(query, club, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Club Updated');
            res.redirect('/klubovi');
        }
    });
});

//Delete Club
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id }

    Club.findById(req.params.id, function(err, club){
        /*if(club.author != req.user._id){
            res.status(500).send();
        }else{*/
            Club.remove(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success');
            });
        //}
    });
});

//Get Single Club
router.get('/:id', function(req, res){
    Club.findById(req.params.id, function(err, club){
        User.findById(club.author, function(err, user){
            res.render('club',{
                club:club,
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