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

//* Prompt 'supervisor' on what they want to do
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
      case "View Product Sales by Department":
        viewProductSales();
        break;
      case "Create New Department":
        addDepartment();
        break;
      case "Exit":
        end();
        break;
      default:
        end();
        break;
    };
  });
};

function viewProductSales() {

}

function addDepartment() {

}

function end() {
  connection.end();
}
