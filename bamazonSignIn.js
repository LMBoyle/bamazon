// VARIABLES ========================================================================

var inquirer = require("inquirer");
var colors = require("colors");

var cust = require("./core/bamazonCustomer");
var man = require("./core/bamazonManager");
var sup = require("./core/bamazonSupervisor");

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
        console.log("\n==================================\n");
        console.log("Disconnecting...".grey);
        console.log("\n==================================\n");
        process.exit();
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

//* Prompt user for password if manager
//* Validate password and run file
function manager() {
  inquirer.prompt([
    {
      type: "password",
      name: "manPass",
      message: "Please enter your password",
      mask: "*",
      validate: function(input) {
        if (input === '') {
          return "Please Enter a Value";
        }
        else if (input !== "Manager is the Man") {
          return colors.red("Password unsuccessful!!")
        }
        else {
          return true
        }
      }
    }
  ]).then(function() {
    console.log("\n==================================\n");
    console.log("Password successful!!".green);
    console.log("Connecting you now...".grey);
    console.log("\n==================================\n");
    man.promptManList();
  });
};

// TODO Prompt user for password if supervisor
// TODO Validate password and run file
function supervisor() {
  inquirer.prompt([
    {
      type: "password",
      name: "supPass",
      message: "Please enter your password",
      mask: "*",
      validate: function(input) {
        if (input === '') {
          return "Please Enter a Value";
        }
        else if (input !== "Sup super") {
          return colors.red("Password unsuccessful!!")
        }
        else {
          return true
        }
      }
    }
  ]).then(function() {
    console.log("\n==================================\n");
    console.log("Password successful!!".green);
    console.log("Connecting you now...".grey);
    console.log("\n==================================\n");
    sup.promptSupList();
  });
};

whoDis();