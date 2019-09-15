// VARIABLES ========================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

var signIn = require("./bamazonSignIn");

// DATABASE =========================================================================

//* Create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

// FUNCTIONS ========================================================================
var methods = {
  //* Get data from database and make table
  makeTable: function makeTable() {
    console.log("In make table")
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      console.table(res);
      methods.buyProduct();
    })
  },

  //* Prompt the user what item to buy and how many
  buyProduct: function buyProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "whatItem",
          message: "What's the id of the item you want to buy?",
          validate: function(input) {
            if (isNaN(input)) {
              return "Please Enter a Number";
            }
            else {
              return true
            }
          }
        },
        {
          type: "input",
          name: "howMany",
          message: "How many do you want to buy?",
          validate: function(input) {
            if (isNaN(input)) {
              return "Please Enter a Number";
            }
            else {
              return true
            }
          }
        },
      ]).then(function(ans){
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === parseInt(ans.whatItem)) {
            chosenItem = res[i]
          }
        }

        if (chosenItem.stock_quantity >= parseInt(ans.howMany)) {
          var quaLeft = chosenItem.stock_quantity - parseInt(ans.howMany);
          var sales = chosenItem.product_sales + (chosenItem.price * parseInt(ans.howMany));
          var sql = "UPDATE products SET stock_quantity = ?, product_sales = ?  WHERE product_name = ?"
          connection.query(sql, [quaLeft, sales, chosenItem.product_name], function (err, res) {
            if (err) throw err;
            var total = chosenItem.price * parseInt(ans.howMany)
            console.log("\n==================================\n");
            console.log(colors.grey(ans.howMany + " " + chosenItem.product_name + " at $" + chosenItem.price + " each..."))
            console.log(colors.green("Your total is: $" + total.toFixed(2)));
            console.log("\n==================================\n");
            methods.keepShopping();
          })
        }
        else {
          console.log("\n==================================\n");
          console.log("Not enough in stock".red);
          console.log("\n==================================\n");
          methods.keepShopping();
        }
      });
    });
  },

  //* Prompt user if they want to keep shopping
  keepShopping: function keepShopping() {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "shopping",
          message: "Do you want to keep shopping?",
          default: true
        }
      ]).then(function(ans){
        if (ans.shopping) {
          methods.buyProduct()
        }
        else {
          console.log("\n==================================\n");
          console.log("Thank you. Come again soon".green);
          console.log("\n==================================\n");
          connection.end();
        }
      })
  }
}

module.exports = methods;