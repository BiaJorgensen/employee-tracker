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
    name: 'options',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Finish']
}


function init() {
    inquirer.prompt(options)
    .then((data) => {const chosenOption = data.options
        if (chosenOption === 'View all departments') {
            console.log(1);
            
        }
        if (chosenOption === 'View all roles') {
            console.log(2);
            init()
        }
        if (chosenOption === 'View all employees') {
            console.log(3);
            init()
        }
        if (chosenOption === 'Add a department') {
            console.log(4);
            init()
        }
        if (chosenOption === 'Add a role') {
            console.log(5);
            init()
        }
        if (chosenOption === 'Add an employee') {
            console.log(6);
            init()
        }
        if (chosenOption === 'Update an employee role') {
            console.log(7);
           
        }
        if (chosenOption === 'Finish') {
            console.log('Thank you!');
            process.exit()
        }



        return(chosenOption); 
    })
    
   
}
    


init()
module.exports = init

