module.exports = function (app) {

    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));

    var sessions = require('express-session');
    app.use(sessions({ secret: 'ncdjkshi68sh', resave: false, saveUninitialized: true }));

    //express-handlebars*******************************
    var exphbs = require('express-handlebars');
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');


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

    app.get('/login', function (req, res) {
        if(req.session.uniqueId){
            res.redirect('/');
        } else {
            res.render('login');
        }

    });

    app.get('/signup', function (req, res) {
        if (req.session.uniqueId) {
            res.redirect('/');
        } else {
            res.render('signup');
        }
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

        res.send('you have successfully registered!!! <a href="/">PLEASE LOGIN TO CONTINUE </a>');

    });

    app.post('/login', function (req, res) {

        mysqlC.query('SELECT * from record where email = "'+req.body.email+'" ',
         function(err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows);
                if (req.body.password == rows[0].password){
                    req.session.uniqueId = req.body.email;
                    res.redirect('/');
                }
                else {
                    res.send('invalid password');
                }

            } else {
                console.log('Error while performing Query.');
                res.send('some error occured!!');
            }
        });
    });

    app.get('/', function (req, res) {

        if (req.session.uniqueId) {
            res.render('home');
            //res.send('your profile is here!!!!!!!!!!!!  <a href="/logout"> LOGOUT </a>');
        } else {
            res.redirect('/login');
        }

    });

    app.get('/logout',function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });

    });


};
