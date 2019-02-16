const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const config = require('./config/database');
mongoose.connect(config.database);
//mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection   
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//Check for DB errors   
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let User = require('./models/user');
let Sport = require('./models/sport');
let League = require('./models/league');
let Club = require('./models/club');
let Match = require('./models/match');

//Load View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware//("Success", "Add" i "Delete")
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root  = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Passport Config
require('./config/passport')(passport); 

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Home route for Matches
app.get('/', function(req, res){
    Match.find({}, function(err, matches){
        if(err){
            console.log(err);
        }
        else{
            res.render('index', {
                title: 'Matches',
                matches : matches 
            });
        }
    })
});

//Route to see the Sports
app.get('/sportovi',ensureAuthenticated, function(req, res){
    Sport.find({}, function(err, sport){
        if(err){
            console.log(err);
        }
        else{
            res.render('index_sport', {
                title: 'Sports',
                sport : sport
            });
        }
    })
});

//Route to the Leagues
app.get('/lige',ensureAuthenticated, function(req, res){
    League.find({}, function(err, leagues){
        if(err){
            console.log(err);
        }
        else{
            res.render('index_league', {
                title: 'Leagues',
                leagues : leagues
            });
        }
    })
});

//Route fot add new League
app.get('/leagues/add',ensureAuthenticated, function(req, res){
    
    League.find({}, function(err, leagues){
        Sport.find({}, function(err, sport){
            if(err){
                console.log(err);
            }
            else{
                res.render('add_league', {
                    title: 'Add League',
                    leagues : leagues,
                    sport : sport
                });
            }
        })
    })
});

//Route fot add new Club
app.get('/clubs/add',ensureAuthenticated, function(req, res){
    Club.find({}, function(err, clubs){
        League.find({}, function(err, leagues){
            Sport.find({}, function(err, sport){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('add_club', {
                        title: 'Add Club',
                        clubs : clubs,
                        leagues : leagues,
                        sport : sport
                    });
                }
            })
        })
    })
});

//Route fot add new Match
app.get('/matches/add',ensureAuthenticated, function(req, res){
    Match.find({}, function(err, matches){
        Club.find({}, function(err, clubs){
            League.find({}, function(err, leagues){
                Sport.find({}, function(err, sport){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render('add_match', {
                            title: 'Add Match',
                            matches : matches,
                            clubs : clubs,
                            leagues : leagues,
                            sport : sport
                        });
                    }
                })
        
            })
        })
    })
});

//Route fot add new Sport
app.get('/sports/add',ensureAuthenticated, function(req, res){
    Sport.find({}, function(err, sport){
        if(err){
            console.log(err);
        }
        else{
            res.render('add_sport', {
                title: 'Add Sport',
                sport : sport
            });
        }
    })
});

//Route to the Clubs
app.get('/klubovi', ensureAuthenticated, function(req, res){
    Club.find({}, function(err, clubs){
        if(err){
            console.log(err);
        }
        else{
            res.render('index_club', {
                title: 'Clubs',
                clubs : clubs
            });
        }
    })
});

//Route to the Matches
app.get('/mecevi',ensureAuthenticated, function(req, res){
    Match.find({}, function(err, matches){
        if(err){
            console.log(err);
        }
        else{
            res.render('index_match', {
                title: 'Matches',
                matches : matches 
            });
        }
    })
});

//Route Files
let sports = require('./routes/sports');
let leagues = require('./routes/leagues');
let clubs = require('./routes/clubs' );
let matches = require('./routes/matches');
let users = require('./routes/users');

app.use('/sports', sports);
app.use('/leagues', leagues);
app.use('/clubs', clubs);
app.use('/matches', matches);
app.use('/users', users);

//Start server
app.listen(process.env.PORT ||'3000', function(){
    console.log('Server started on port 3000');
});
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}