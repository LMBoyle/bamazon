// VARIABLES ========================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

// DATABASE =========================================================================

//* Create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//* Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  promptList();
});

// FUNCTIONS ========================================================================

//* Prompt user on what they want to do
function promptList() {
  inquirer.prompt([
    {
      type: "list",
      name: "whatToDo",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  ]).then(function(ans){
    switch (ans.whatToDo) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        addProduct();
        break;
      case "Exit":
        end();
        break;
      default:
        end();
        break;
    }
  })
};

//* Show all the products
function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptList();
  })
}

//* Show products with inventory lower than 5
function viewInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity <=5", function (err, res) {
    if (err) throw err;
    console.table(res);
    promptList();
  });
}

//* Allow user to add any amount of inventory to any product
function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    inquirer.prompt([
      {
        type: "input",
        name: "whatItem",
        message: "What's the id of the item you want to update?",
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
        message: "How many do you want to add?",
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
      var quantity = chosenItem.stock_quantity + parseInt(ans.howMany);


      var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ?"
      connection.query(sql, [quantity, chosenItem.product_name], function (err, res) {
        if (err) throw err;
        console.log("\n==================================\n");
        console.log(colors.grey("Updating products..."))
        console.log(colors.green("You now have " + quantity + " of " + chosenItem.product_name));
        console.log("\n==================================\n");
        promptList();
      });
    });
  });
}

// TODO allow user to add a new product
function addProduct() {

}

function end() {
  connection.end();
}