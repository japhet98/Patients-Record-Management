var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
    dest: './uploads'
});
var bcrypt = require('bcrypt')
    //var bcrypt = require('bcrypt');
var mysql = require('mysql');
var Connections = require('../../Models/config');

// connect to database;
Connections.connect(err => {
    if (err) {
        console.log("Database not connected")
    } else {
        console.log("Database  connected")
        console.log(Connections.config)

    }
})


// Select all users 
router.get('/', function(req, res, next) {
    var SELECT_ALL_FROM_USERS_QUERY = 'SELECT * FROM users';
    Connections.query(SELECT_ALL_FROM_USERS_QUERY, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            return res.json(result);

        }
    })
})


// Select User by specific ID

router.get('/:id', function(req, res, next) {
    var SELECT_ALL_FROM_USERS_WHERE_ID = 'SELECT * FROM users where id=?';
    Connections.query(SELECT_ALL_FROM_USERS_WHERE_ID, [req.params.id], (err, row, field) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json(row);
        }
    })
});

// Add new user

router.post('/', function(req, res) {
    let user = {
        username: 'ama',
        userpass: 333
    }

    let sql = "CALL AddNewUser(?,?)";
    Connections.query(sql, [user.username, user.userpass], (err, rows, field) => {
        if (!err) {
            console.log("User")
        } else
            console.log(err);
    })

});

//Edit User

router.post('/edit', function(req, res) {
    let users = {
        username: req.body.username,
        userpass: req.body.userpass
    }
    let sql = "CALL EditUser(?,?)";
    Connections.query(sql, [users.username, users.userpass], (err, rows, field) => {
        if (!err) {
            console.log("user UPdated");
        } else
            console.log(err);
    })
});


router.get('/edit', function(req, res) {
    res.render('Edit', { title: 'Edit' })
});




router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });


});
router.get('/login', function(req, res, next) {
    res.render('/login', { title: 'Login' })
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    //console.log(req.body.name);
    //console.log(req.file)
    if (req.file) {
        console.log('Uploading file ...')
        var profileimage = req.file.filename;
    } else {
        console.log('No file uploader');
        var profileimage = 'noimage.jpg';
    }
    // Form validator
    req.checkBody('name', 'Name field is required').notEmpty();
    //req.chekBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(password);

    // Check Error
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        })
    } else {
        console.log('No errors')
    }
});


router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Incorrect password').equals("1234");
    var errors = req.validationErrors();

    if (errors) {
        console.log(`${username}  ${password}`)
        res.render('Login', {
            errors: errors
        })
    } else {
        console.log('No errors')
        console.log(`${username}  ${password}`)
    }


});
module.exports = router;