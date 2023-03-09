// Importing Inquirer Package into file
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
    .then((data) => {const chosenOption = data.options
        return(chosenOption); 
    })
    .then((chosenOption) => {
        if (chosenOption == 'View all departments') {
            console.log(222);
            return
        }
    })
    return
}
    


init()
module.exports = init

