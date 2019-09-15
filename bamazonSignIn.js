// VARIABLES ========================================================================

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var cust = require("./bamazonCustomer.js");
var man = require("./bamazonManager");
var sup = require("./bamazonSupervisor");

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
  whoDis();
});

// FUNCTIONS ========================================================================

//TODO Prompt user on who they are
function whoDis() {
  inquirer.prompt([
    {
      type: "list",
      name: "clearance",
      message: "Who do you want to sign in as?",
      choices: ["Customer", "Manager", "Supervisor"]
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
      default:
        customer();
    };
  })
}

// TODO Prompt user for password if manager or supervisor
function customer() {
  console.log("\n==================================\n");
  console.log("No password required!".green);
  console.log("Connecting you now...".grey);
  console.log("\n==================================\n");
  cust.makeTable()
};

function manager() {

};

function supervisor() {

};


// TODO Validate password and run file

function end() {

}

