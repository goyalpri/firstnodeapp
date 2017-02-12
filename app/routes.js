//var express = require('express');

//var router = express.Router();

module.exports = function (app) {

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    var sessions = require('express-session');
    app.use(sessions({ secret: 'ncdjkshi68sh', resave: false, saveUninitialized: true }));
    var session;

    var mysql      = require('mysql');
    var mysqlC = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'ubuntu',
      database : 'task'
    });


    //var mysqlC = require('../config/database.js');
    mysqlC.connect(
        function(err){
            if(!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn");
            }
        });


    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function (req, res) {
        session = req.session;
        if(session.uniqueId){
            res.redirect('/redirects');
        }

        res.render('login.ejs');
    });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs');
    });

    app.post('/signup', function (req, res) {
        console.log('req.body');
        console.log(req.body);

        mysqlC.query('insert into record(email , password) values ("' + req.body.email + '", "' + req.body.password + '")',
        function (err, results) {
            if (err)
            //console.log('sorry');
            throw err;
            //else res.send('success');
        });

        res.write('You sent the Email "' + req.body.email+'".\n');
        res.end();

    });

    app.post('/login', function (req, res) {
        //var useremail = req.body.email;
        //var userpassword = req.body.password;

        session = req.session;
        if(session.uniqueId){
            res.redirect('/redirects');
        }

        mysqlC.query('SELECT * from record where email = "'+req.body.email+'" ', function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                if (req.body.password == rows[0].password){
                    session.uniqueId = req.body.email;
                }

                res.redirect('/redirects');

            }

            else
                console.log('Error while performing Query.');
            });

    });

    app.get('/redirects', function (req, res) {
        session = req.session;
        if(session.uniqueId){
            res.redirect('/profile');
        }
        else{
            res.write('Invalid email id or password <a href="/logout"> GO BACK </a>');
        }

    });

    app.get('/profile', function (req, res) {

        session = req.session;
        if(session.uniqueId){
            res.send('your profile is here!!!!!!!!!!!!  <a href="/logout"> LOGOUT </a>');
        }

    }

    );

    app.get('/logout',function (req, res) {
        req.session.destroy();
        res.redirect('/');

    });


};
