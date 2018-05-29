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

// get the list of available products from the database
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

// show the list to the customer and allow them to select a product
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
  // after customer selects a product, show details of it.
  connection.query('SELECT * FROM products WHERE product_name = "' + item + '"', (error, result) => {
    let prod = result[0];
    // ask how many they would like to buy
    inquirer.prompt([{
      name: 'purchQuant',
      type: 'input',
      message: "You've chosen " + prod.product_name + " ID: " + prod.item_id + "\n" +
        "Price: $" + prod.price + ".\n" +
        "There are " + prod.stock_quantity + " available.\n" +
        "How many would you like to purchase?",
      default: 1
    }]).then(answer => {
      // check requested quantity against available stock
      // if requested quantity is too high, reduce request and confirm with customer
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
          // if customer agrees, complete the transaction, else cancel the transaction
          answer.confirm ? completeTransaction(prod.item_id, prod.product_name, prod.stock_quantity, answer.purchQuant, prod.price, prod.product_sales) : cancelTransaction();
        });
      } else {
        // if quantity is valid complete the transaction
        completeTransaction(prod.item_id, prod.product_name, prod.stock_quantity, answer.purchQuant, prod.price, prod.product_sales);
      }
    });
  });
}

function completeTransaction(id, name, q, p, c, s) {
  // show the customer the total cost of the purchase, and confirm with the customer
  inquirer.prompt([{
    name: 'confirm',
    type: 'confirm',
    message: "The total cost of your purchase of " + p + " " + name + "s is $" + p * c + ".\n" +
      "Is this OK?",
    default: true
  }]).then(answer => {
    // if customer confirms, update the database
    if (answer.confirm) {
      let queryString = 'UPDATE products SET stock_quantity = ' + (q - p) + ', product_sales = ' + ( s + p * c) + ' WHERE item_id = ' + id
      connection.query(queryString, (error, result) => {
        if (error) throw error;
        console.log("Thank you for your purchase!");
        closeConnection();
      });
    } else {
      // else cancel the transation
      cancelTransaction()
    }
  });
}

function cancelTransaction() {
  console.log("We understand. Check back later to see if we have what you're looking for.")
  closeConnection();
}

function closeConnection() {
  connection.end();
}
