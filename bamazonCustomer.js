// required packages
require('dotenv').config();
let mysql = require('mysql');
let inquirer = require('inquirer');

// create connection to DB
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.password,
  database: 'bamazon'
});

// Connect to DB
connection.connect(function(err) {
  if (err) throw err;

  pullProducts();
});

function pullProducts() {
  connection.query('SELECT product_name, item_id, stock_quantity FROM products', (error, result) => {
    if (error) throw error;
    let productList = [];
    for (product of result) {
      productList.push(product.product_name);
    }
    inquirer.prompt([{
      name: 'productChoice',
      type: 'rawlist',
      message: "Here's a list of our products. What would you like to purchase?",
      choices: productList
    }]);
    connection.end();
  });
}
