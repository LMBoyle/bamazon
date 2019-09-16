// VARIABLES ========================================================================

var inquirer = require("inquirer");
var consoleTable = require("console.table");
var colors = require("colors");

// DATABASE =========================================================================

var db = require("../db/bamazonDB");
var connection = db.dbConnection();

// FUNCTIONS ========================================================================
var supMethods = {
  //* Prompt 'supervisor' on what they want to do
  promptSupList: function promptSupList() {
    inquirer.prompt([
      {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]
      }
    ]).then(function(ans){
      switch (ans.whatToDo) {
        case "View Product Sales by Department":
          supMethods.viewProductSales();
          break;
        case "Create New Department":
          supMethods.addDepartment();
          break;
        case "Exit":
          supMethods.supLogOff();
          break;
        default:
          supMethods.supLogOff();
          break;
      };
    });
  },

  //* Show 'supervisor' a table of departments and costs/profits
  viewProductSales: function viewProductSales() {
    var sql = "SELECT department_id, departments.department_name, SUM(product_sales) AS product_sales, over_head_costs, ((SUM(product_sales)) - over_head_costs ) AS total_profit "; 
    sql += "FROM departments ";
    sql += "LEFT JOIN products "; 
    sql += "ON departments.department_name = products.department_name "; 
    sql += "GROUP BY departments.department_name";

    connection.query(sql, function (err, res) {
      if (err) throw err;
      console.table(res);
      supMethods.promptSupList();
    })
  },

  //* Allow 'supervisor' to add a department
  addDepartment: function addDepartment() {
    var sql = "SELECT * FROM departments";
    connection.query(sql, function (err, res){
      if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "departName",
          message: "What department do you want to add?",
          validate: function(input) {
            for (var d = 0; d < res.length; d++) {
              if (input === res[d].department_name) {
                return "Department already exists";
              }
              else if (input === '') {
                return "Please Enter a Department"
              }
            };
            return true;
          },
        },
        {
          type: "input",
          name: "overHead",
          message: "What are the overhead costs?",
          validate: function(input) {
            if (isNaN(input) || input === '') {
              return "Please Enter a Number";
            }
            return true;
          }
        }
      ]).then(function(ans) {
        var sql = "INSERT INTO departments SET department_name = ?, over_head_costs = ?";
        connection.query(sql, [ans.departName, ans.overHead], function(err, res) {
          if (err) throw err;
          console.log("\n==================================\n");
          console.log(colors.grey("Adding department..."))
          console.log(colors.green(ans.departName + " has been added!"));
          console.log("\n==================================\n");
          supMethods.promptSupList();
        })
      });
    });
  },

  //* End connection
  supLogOff: function supLogOff() {
    console.log("\n==================================\n");
    console.log("Logging off".grey);
    console.log("\n==================================\n");
    connection.end();
    process.exit();
  }
};



module.exports = supMethods;

function hacker() {
  console.log("\n==================================\n");
  console.log("Nice try. But you need a password to get here. \nGo to ".red + "bamazonSignIn".yellow)
  console.log("\n==================================\n");
  connection.end();
  process.exit();
}

if (process.argv[1] === 'C:\\Users\\Luke Boyle\\Bootcamp\\Homeworks\\11_node-sql\\bamazon\\core\\bamazonSupervisor.js') {
  hacker()
}
