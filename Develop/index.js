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
            viewRoles()  
        }
        if (chosen.option === 'View all employees') {
            viewEmployees()
        }
        if (chosen.option === 'Add a department') {
            addDept()  
        }
        if (chosen.option === 'Add a role') {
            addRole()   
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
        console.log('\n DEPARTMENTS\n');
        console.table(results);
        init()
    })
};

function viewRoles() {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary
            FROM role JOIN department ON role.department_id = department.id`, 
            (err, results) => {
                if (err) throw err;
                console.log('\n ROLES\n');
                console.table(results);
                init()
    })
};

function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
            role.title, department.name AS department, role.salary, 
            CONCAT(manager.first_name," ",manager.last_name) AS manager
            FROM employee JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`, 
            (err, results) => {
                if (err) throw err;
                console.log('\n ROLES\n');
                console.table(results);
                init()
            })
};

async function addDept() {
    let newDept = await inquirer.prompt([
        {
            name: 'new_dept',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ])
    db.query(`INSERT INTO department (name) VALUES (?)`, newDept.new_dept, (err,results) => {
        if (err) throw err;
                console.log(`\n Added ${newDept.new_dept} to the database\n`);
                init()
    })  
};

async function addRole() {
    const dept_names = await showListOfDepts();

    let newRole = await inquirer.prompt([
        {
            name: 'new_role',
            type: 'input',
            message: 'What is the name of the role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role? (numbers only)'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Which department does the role belong to?',
            choices: dept_names
        }
    ])

    const deptID = await deptNameToID(newRole.department);

    const info = [newRole.new_role, newRole.salary, deptID]
    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, info, (err,results) => {
        if (err) throw err;
                console.log(`\n Added ${newRole.new_role} to the database\n`);
                init()
    })  
};

async function showListOfDepts() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name FROM department`, (err,results) => {
            if (err) reject (err);
            else {
                const dept_names = results.map(depts => depts.name)
                resolve (dept_names)}
        });
    });
};

async function deptNameToID(dept_name) {
    return new Promise ((resolve, reject) => {
        db.query(`SELECT id FROM department WHERE name = (?)`, dept_name, (err,results) => {
            if (err) reject (err);
            else {
                const dept_id = results[0].id;
                resolve (dept_id)
            }
        })
    })

  }




  
init()
module.exports = init

