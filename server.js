
// Importing mysql2
const mysql = require('mysql2');
const choice = require('./Develop/index')



// Connecting to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'charlie',
    database: 'employees_db'
  }
);


