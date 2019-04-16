var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bmazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("____________________________")
      console.log("Product ID: " + res[i].id);
      console.log("Product Name: " + res[i].product_name);
      console.log("Department Name: " + res[i].department_name);
      console.log("Price of Product: " + res[i].price);
      console.log("Amount in Stock: " + res[i].stock_quantity);
      console.log("____________________________")
    }
    ask();
  });
}

function ask() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;


    inquirer.prompt([
      {
        type: "input",
        name: "productID",
        message: "What is the ID of the product you wish to buy?"
        
      }, {
        type: "input",
        name: "productQuant",
        message: "How many would you like to buy?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ]).then(function (answer) {
      var userInt = parseInt(answer.productQuant)
      var userID = parseInt(answer.productID)

      // Try moving this query string at the bottom of the next query to pull data out of the full table then display what is needed in a
      // if statement that would then shoot out the price if there is enough in stock_quantity

      // See if you can store the stock_quantity into a variable
      var query =
        connection.query("UPDATE products SET ? WHERE ? ",
          [
            {
              stock_quantity: userInt
            },
            {
              id: userID
            }
          ],
          function (err, res) {
            if (err) throw err;
          });


       console.log(query.sql);
      connection.end();
    });
  });
}