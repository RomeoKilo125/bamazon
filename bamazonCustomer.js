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
  connection.query('SELECT product_name FROM products', (error, result) => {
    if (error) throw error;
    let productList = [];
    for (product of result) {
      productList.push(product.product_name);
    }
    productList.push('');
    getCustomerChoice(productList);
  });
}

function getCustomerChoice(list) {
  inquirer.prompt([{
    name: 'productChoice',
    type: 'list',
    message: "Here's a list of our products. What would you like to purchase?",
    choices: list
  }]).then(answer => {
    findChosenItem(answer.productChoice);
  });
}

function findChosenItem(item) {
  connection.query('SELECT * FROM products WHERE product_name = "' + item + '"', (error, result) => {
    let prod = result[0];
    inquirer.prompt([{
      name: 'purchQuant',
      type: 'input',
      message: "You've chosen " + prod.product_name + " ID: " + prod.item_id + "\n" +
        "Price: $" + prod.price + ".\n" +
        "There are " + prod.stock_quantity + " available.\n" +
        "How many would you like to purchase?",
      default: 1
    }]).then(answer => {
      if (answer.purchQuant > prod.stock_quantity) {
        answer.purchQuant = prod.stock_quantity;
        inquirer.prompt([{
          name: 'confirm',
          type: 'confirm',
          message: "I'm sorry, we don't have that many in stock.\n" +
            "Your purchase has been adjusted to the maximum available (" + prod.stock_quantity + ").\n" +
            "Is this OK?",
          default: true
        }]).then(answer => {
          answer.confirm ? completeTransaction(prod.item_id, prod.stock_quantity, answer.purchQuant) : cancelTransaction();
        });
      } else {
        completeTransaction(prod.item_id, prod.stock_quantity, answer.purchQuant);
      }
    });
  });
}

function completeTransaction(id, q, p) {
  let queryString = 'UPDATE products SET stock_quantity = ' + (q - p) + ' WHERE item_id = ' + id
  connection.query(queryString, (error, result) => {
    if (error) throw error;
    console.log("Thank you for your purchase!");
  });
  closeConnection();
}

function cancelTransaction() {
  console.log("We understand. Check back later to see if we have what you're looking for.")
  closeConnection();
}

function closeConnection() {
  connection.end();
}
