// VARIABLES ========================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var cust = require("./bamazonCustomer.js");
var man = require("./bamazonManager.js");
var sup = require("./bamazonSupervisor.js");

// DATABASE =========================================================================
/*   //* Create the connection information for the sql database
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
    whoDis();
  }); */

// FUNCTIONS ========================================================================
//* Prompt user on who they are
function whoDis() {
  inquirer.prompt([
    {
      type: "list",
      name: "clearance",
      message: "Who do you want to sign in as?",
      choices: ["Customer", "Manager", "Supervisor", "Exit"]
    }
  ]).then(function(ans){
    switch (ans.clearance) {
      case "Customer":
        customer();
        break;
      case "Manager":
        manager();
        break;
      case "Supervisor":
        supervisor();
        break;
      case "Exit":
        end();
          break;
      default:
        customer();
    };
  })
};

//* Connect user if just a customer
function customer() {
  console.log("\n==================================\n");
  console.log("No password required!".green);
  console.log("Connecting you now...".grey);
  console.log("\n==================================\n");
  cust.makeTable();
};

// TODO Prompt user for password if manager
// TODO Validate password and run file
function manager() {
  console.log("\n==================================\n");
  console.log("Password successful!!".green);
  console.log("Connecting you now...".grey);
  console.log("\n==================================\n");
  man.promptManList()
};

// TODO Prompt user for password if supervisor
// TODO Validate password and run file
function supervisor() {
  console.log("\n==================================\n");
  console.log("Password successful!!".green);
  console.log("Connecting you now...".grey);
  console.log("\n==================================\n");
  sup.promptSupList();
};

whoDis();