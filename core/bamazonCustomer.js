// VARIABLES ========================================================================

var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");


// DATABASE =========================================================================

var db = require("../db/bamazonDB");
var connection = db.dbConnection();

// FUNCTIONS ========================================================================
var custMethods = {
 //* Get data from database and make table
  makeTable: function makeTable() {
    var sql = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(sql, function (err, res) {
      if (err) throw err;
      console.table(res);
      custMethods.buyProduct();
    })
  },

  //* Prompt the user what item to buy and how many
  buyProduct: function buyProduct() {
    var sql = "SELECT * FROM products"
    connection.query(sql, function (err, res) {
      if (err) throw err;

      var itemIds = []
      for (var s = 0; s < res.length; s++) {
        itemIds.push(res[s].item_id)
      }

      inquirer.prompt([
        {
          type: "input",
          name: "whatItem",
          message: "What's the id of the item you want to buy?",
          validate: function(input) {
            for (var i = 0; i < res.length; i++) {
              // If input does not equal a number, alert the user
              if (isNaN(input) || input === '') {
                return "Please Enter a Number";
              }
              else if (parseInt(input) === res[i].item_id) {
                return true
              }
            };
            return "No such item"
          }
        },
        {
          type: "input",
          name: "howMany",
          message: "How many do you want to buy?",
          validate: function(input) {
            if (isNaN(input) || input == '') {
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
          var sql = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?"
          connection.query(sql, [quaLeft, sales, chosenItem.item_id], function (err) {
            if (err) throw err;
            var total = chosenItem.price * parseInt(ans.howMany)
            console.log("\n==================================\n");
            console.log(colors.grey(ans.howMany + " " + chosenItem.product_name + "(s) at $" + chosenItem.price + " each..."))
            console.log(colors.green("Your total is: $" + total.toFixed(2)));
            console.log("\n==================================\n");
            custMethods.keepShopping();
          })
        }
        else {
          console.log("\n==================================\n");
          console.log("Not enough in stock".red);
          console.log("\n==================================\n");
          custMethods.keepShopping();
        }
      });
    });
  },

  //* Prompt user if they want to keep shopping
  keepShopping: function keepShopping() {
    inquirer.prompt([
      {
        type: "confirm",
        name: "shopping",
        message: "Do you want to keep shopping?",
        default: true
      }
    ]).then(function(ans){
      if (ans.shopping) {
        custMethods.makeTable();
      }
      // End connection
      else {
        console.log("\n==================================\n");
        console.log("Thanks for shopping. Come again soon!".grey);
        console.log("\n==================================\n");
        connection.end();
        process.exit();
      }
    })
  }
};

module.exports = custMethods;

if (process.argv[1] === 'C:\\Users\\Luke Boyle\\Bootcamp\\Homeworks\\11_node-sql\\bamazon\\core\\bamazonCustomer.js') {
  custMethods.makeTable();
}
