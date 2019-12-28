# Bamazon

Back-End, amazon-like shopping app

View as a customer, a manager or a supervisor

## Installation
To use, first clone the repository to your local machine.

    $ https://github.com/LMBoyle/bamazon.git

Or

    $ git@github.com:LMBoyle/bamazon.git

Run `npm install` or `yarn install` and make sure **inquirer**, **colors**, and **consoleTable** are installed.

## Instructions

Run `node bamazonSignIn.js` and follow prompts

Customer View | Manager View | Supervisor View
--------------|--------------|----------------
Select **Customer** | Select **Manager** | Select **Supervisor** 
No password required | Enter password **Manager is the Man** | Enter password **Sup super**
Then you can 'buy' items, as long as there is enough stock | Then you can view all the products, view only the products with less than five in stock, add more to inventory or add a new product | Then you can view product sales for each department or add a new department


## Built With...
* JavaScript
* Node.js
* MySQL

### NPM Packages
* Inquirer
* Console Table
* Colors

## Demos

### Customer 

![Demo Customer Gif](/assets/custDemo.gif)

### Manager

![Demo Manager Gif](/assets/managerDemo.gif)

### Supervisor

![Demo Supervisor Gif](/assets/supervisorDemo.gif)

&copy; 2019 [Luke Boyle](https://lmboyle.github.io/)
