const express = require('express');
const router = express.Router();

//Sport Model
let Sport = require('../models/sport');
//User Model
let User = require('../models/user');

//Add route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_sport',{
        title: 'Add Sport'
    });
});

//Add Submit Post Route
router.post('/add',ensureAuthenticated, function(req, res){
    req.checkBody('id', 'Id is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_sport', {
            title:'Add Sport',
            errors:errors
        });
    }else{
        let sport = new Sport();
        sport.id = req.body.id;
        sport.author = req.user._id;
        sport.name = req.body.name;

        sport.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'Sport Added');
                res.redirect('/sportovi');
            }
        });
    }
});

//Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Sport.findById(req.params.id, function(err, sport){
        /*if(sport.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/sportovi');
        }*/
        res.render('edit_sport',{
            title:'Edit Sport',
            sport:sport
        });
    });
});

//Update Submit post route
router.post('/edit/:id',ensureAuthenticated, function(req, res){
    let sport = {}
    sport.id = req.body.id;
    sport.author = req.body.author;
    sport.name = req.body.name;

    let query = {_id:req.params.id}

    Sport.update(query, sport, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Sport Updated');
            res.redirect('/sportovi');
        }
    });
});

//Delete Sport
router.delete('/:id', ensureAuthenticated,function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id }

    Sport.findById(req.params.id, function(err, sport){
        /*if(sport.author != req.user._id){
            res.status(500).send();
        }else{*/
            Sport.remove(query, function(err){
                if(err){
                    console.log(err)
                }
                res.send('Success');
            });
        //}
    });
});

//Get Single Sport
router.get('/:id', function(req, res){
    Sport.findById(req.params.id, function(err, sport){
        User.findById(sport.author, function(err, user){
            res.render('sport',{
                sport:sport,
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