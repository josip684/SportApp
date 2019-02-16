const express = require('express');
const router = express.Router();

let League = require('../models/league');

//User Model
let User = require('../models/user');

//Add route 
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_league',{
        title: 'Add League'
    });
});

//Add Submit Post Route
router.post('/add', function(req, res){
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('sport_id', 'Sport ID is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_league', {
            title:'Add League',
            errors:errors
        });
    }else{
        let league = new League();
        league.id = req.body.id;
        league.author = req.user._id;
        league.name = req.body.name;
        league.sport_id = req.body.sport_id;
       
        league.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'League Added');
                res.redirect('/lige');
            }
        });
    }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    League.findById(req.params.id, function(err, league){
        /*if(league.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }*/
        res.render('edit_league',{
            title:'Edit League',
            league:league
        });
    });
});

//Update Submit post route
router.post('/edit/:id', function(req, res){
    let league = {};
    league.id = req.body.id;
    league.author = req.body.author;
    league.name = req.body.name;
    league.sport_id = req.body.sport_id;

    let query = {_id:req.params.id}
   
    League.update(query, league, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'League Updated');
            res.redirect('/');
        }
    });
});

//Delete League
router.delete('/:id', function(req, res){
   
    if(!req.user._id){
        res.status(500).send();
    }
     
    let query = {_id:req.params.id }

    League.findById(req.params.id, function(err, league){
        //if(league.author != req.user._id){
           // res.status(500).send();
        //}else{
            League.remove(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success');
            });
        //}
    });
});

//Get Single League
router.get('/:id', function(req, res){
    League.findById(req.params.id, function(err, league){
        User.findById(league.author, function(err, user){ 
            res.render('league',{
                league:league,
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