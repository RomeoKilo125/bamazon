// required packages
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const {
  table
} = require('table');

// create connection Object
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'bamazon',
  user: 'root',
  password: process.env.password
});

// connect to database
connection.connect(error => {
  if (error) throw error;
  connection.query('SET sql_mode = ""', (err, res) => {
    if (err) throw error;
  });
  mainMenu();
});

// Main menu
// View Sales by dept, create new dept
function mainMenu() {
  inquirer.prompt([{
    name: 'menu',
    type: 'rawlist',
    message: "What would you like to do?",
    choices: ['View Department Sales', 'Create New Department', 'Exit']
  }]).then(ans => {
    switch (ans.menu) {
      case 'View Department Sales':
        viewSales();
        break;
      case 'Create New Department':
        createDept();
        break;
      case 'Exit':
        closeConnection();
        break;
      default:
    }
  });
}

// View sales
function viewSales() {
  // query database for details on all departments, joining product sales from product table, grouped by department, and including calculated total revenue
  // construct query
  let queryString = 'SELECT a.department_id, a.department_name, a.over_head_costs, b.product_sales, (b.product_sales - a.over_head_costs) as total_profit\n' +
    'FROM departments a, products b\n' +
    'WHERE a.department_name = b.department_name\n' +
    'GROUP BY a.department_id;'
  // run query
  connection.query(queryString, (error, result) => {
    if (error) throw error;
    // show results
    showResults(result);
    askQuit();
  });
}

// create department
function createDept() {
  // inquire for department details
  inquirer.prompt([{
    name: 'deptName',
    type: 'input',
    message: "What is the department name?"
  }, {
    name: 'overhead',
    type: 'input',
    message: 'What are the overhead costs?'
  }]).then(ans => {
    // insert new department into Table
    // construct query
    let queryString = 'INSERT INTO departments (department_name, over_head_costs)\n' +
      'VALUES ("' + ans.deptName + '", "' + ans.overhead + '");'
    // run query
    connection.query(queryString, (error, result) => {
      if (error) throw error;
      console.log("Department added.");
      askQuit();
    });
  });
}

// show the results
function showResults(result) {
  // compile results into table
  let data = [];
  data.push(Object.keys(result[0]));
  for (product of result) {
    data.push(Object.values(product));
  }
  // show list to user
  console.log(table(data));
}

function askQuit() {
  inquirer.prompt([{
    name: 'continue',
    type: 'confirm',
    message: "Would you like to continue?"
  }]).then(ans => {
    if (ans.continue) {
      mainMenu();
    } else {
      closeConnection();
    }
  });
}

// closeConnection
function closeConnection() {
  connection.end();
}
