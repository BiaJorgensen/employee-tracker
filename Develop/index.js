// Loading Inquirer Package into file
const inquirer = require('inquirer');

// Questions to se what user would like to do
const options = {
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
}


function init() {
    inquirer.prompt(options)
}

init()