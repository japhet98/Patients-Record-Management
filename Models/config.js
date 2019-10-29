var mysql = require('mysql')
var express = require('express');
var router = express.Router();

let config = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'patient_record_db'
})
module.exports = config;
//module.exports = router;