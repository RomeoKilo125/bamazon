// required packages
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const {
  table
} = require('table');

// connect to the Database
let connection = mysql.createConnection({
  host: 'localhost',
  database: 'bamazon',
  port: 3306,
  user: 'root',
  password: process.env.password
});

connection.connect(err => {
  if (err) throw err;
  mainMenu();
});

// show manager the list of available functions
// view products, view low Inventory, add to inventory, add new product
function mainMenu() {
  inquirer.prompt([{
    name: 'menu',
    type: 'rawlist',
    message: "What would you like to do?\n",
    choices: ["View All Products", "See Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
  }]).then(ans => {
    switch (ans.menu) {
      case 'View All Products':
        viewProducts();
        break;
      case 'See Low Inventory':
        checkLowInventory();
        break;
      case 'Add to Inventory':
        adjustInventory();
        break;
      case 'Add New Product':
        addProduct();
        break;
      case 'Exit':
        closeConnection();
        break;
      default:
    }
  });
}


// view products
function viewProducts() {
  // show details of all available products
  // query database for all products
  connection.query('SELECT * FROM products', (error, result) => {
    if (error) throw error;
    showResults(result);
    askQuit();
  });
}

// view low Inventory
function checkLowInventory() {
  // show details of products with fewer than 5 available units
  // query database for products with low quantities
  connection.query('SELECT * FROM products WHERE stock_quantity < 5;', (error, result) => {
    if (error) throw error;
    showResults(result);
    askQuit();
  });
}

// add to inventory
function adjustInventory() {
  // replenish quantities of available products
  // show list of Products
  // query database for list of products
  connection.query('SELECT product_name FROM products', (error, result) => {
    if (error) throw error;
    let data = [];
    for (product of result) {
      data.push(product.product_name);
    }
    // show list to user
    inquirer.prompt([{
      name: 'choice',
      type: 'list',
      message: "Which product would you like to adjust?",
      choices: data
    }]).then(ans => {
      // when user selects a product show current quantity, ask for amount to add
      // construct query
      let queryString = 'SELECT * FROM products WHERE product_name = "' + ans.choice + '";';
      // run query
      connection.query(queryString, (error, result) => {
        showResults(result);
        inquirer.prompt([{
          name: 'quant',
          type: 'input',
          message: 'How many would you like to add?'
        }]).then(ans => {
          // update table to reflect updated quantity and return results.
          // construct query
          let newQuantity = result[0].stock_quantity + parseInt(ans.quant);
          let queryString = 'UPDATE products SET stock_quantity = ' + newQuantity + ' WHERE item_id = ' + result[0].item_id;
          // run query
          connection.query(queryString, (error, result) => {
            if (error) throw error;
            console.log(chalk.green("Inventory Updated"));
            askQuit();
          });
        });
      });
    });
  });
}

// add new product
// create a whole new product in the products table
function addProduct() {
  // inquire for the details of the product one at a time
  inquirer.prompt([{
    // product name
    name: 'name',
    type: 'input',
    message: 'Product Name?'
  }, {
    // department
    name: 'dept',
    type: 'input',
    message: 'Department?'
  }, {
    // price
    name: 'price',
    type: 'input',
    message: 'Price?'
  }, {
    // quantity
    name: 'quantity',
    type: 'input',
    message: 'How many in stock?'
  }]).then(ans => {
    // update products table with the new product
    // construct query
    let queryString = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES("' +
      ans.name + '", "' +
      ans.dept + '", ' +
      parseFloat(ans.price) + ', ' +
      parseInt(ans.quantity) + ');';
    // run query
    connection.query(queryString, (error, result) => {
      console.log(chalk.green("Product Added!"));
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
