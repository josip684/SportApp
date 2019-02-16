//http://www.passportjs.org/docs/ -> odavde se vadio kod
//$ npm install --save passport passport-local bcryptjs

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    //Local Strategy - implementation
    passport.use(new LocalStrategy(function(username, password, done){
        //Match Username
        let query = {username:username};
        
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

//SERIALIZE:
    passport.serializeUser(function(user, done) {
        done(null, user.id);//returna null i user.id
      });

//DESERIALIZE:
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user); //return adone with the user
        });
      });
}
//More information about session (serialize and deserialize):
//https://stackoverflow.com/questions/11142882/how-do-cookies-and-sessions-work
//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
