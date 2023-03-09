// Importing Inquirer Package into file
const inquirer = require('inquirer');
// Importing mysql2
const mysql = require('mysql2');
// Importing console.table
const table = require('console.table')

// Connecting to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'charlie',
      database: 'employees_db'
    }
  );

// Questions to se what user would like to do
const options = {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Finish']
}


async function init() {

    const chosen = await inquirer.prompt(options)
  
        if (chosen.option === 'View all departments') {
            viewDepts(); 
        }
        if (chosen.option === 'View all roles') {
            console.log(2);
            
        }
        if (chosen.option === 'View all employees') {
            console.log(3);
            
        }
        if (chosen.option === 'Add a department') {
            console.log(4);
            
        }
        if (chosen.option === 'Add a role') {
            console.log(5);
            
        }
        if (chosen.option === 'Add an employee') {
            console.log(6);
            
        }
        if (chosen.option === 'Update an employee role') {
            console.log(7);
           
        }
        if (chosen.option === 'Finish') {
            console.log('Thank you!');
            process.exit()
        }

    }
   

    
function viewDepts() {
    db.query('SELECT id, name FROM department', (err, results) => {
        if (err) throw err;
        // console.clear();
        console.log('\n DEPARTMENTS\n');
        console.table(results);
        console.log('=====================');
        init()
    })
}

init()
module.exports = init

