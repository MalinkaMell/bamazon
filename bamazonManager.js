let colors = require("colors");
const inquirer = require("inquirer");
let conn = require("./connection");

function viewProducts() {
    let sqlQuery = "SELECT item_id as ID, product_name as Name, department_name as Department, price as Price, stock_quantity as Quantity FROM products";
    //execute query
    conn.connection.query(sqlQuery, function (error, results) {
        if (error) throw error;
        console.table(results, ["ID", "Name", "Department", "Price", "Quantity"]) //Yeah! loving this! >:)
        conn.connection.end();
    })
    //If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
}

function viewLowInv() {
    let sqlQuery = "SELECT  item_id as ID, product_name as Name, department_name as Department, price as Price, stock_quantity as Quantity  from products WHERE stock_quantity < 50";
    //execute query
    conn.connection.query(sqlQuery, function (error, results) {
        if (error) throw error;
        console.table(results, ["ID", "Name", "Department", "Price", "Quantity"]) //Yeah! loving this! >:)
        conn.connection.end();
    })
    //If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
}

function addToInv() {

    let sqlQuery = "SELECT * FROM products";

    conn.connection.query(sqlQuery, function (error, results) {
        if (error) throw error;

        let itemNamesArr = [];

        results.forEach(element => {
            itemNamesArr.push(element.product_name)
        });

        inquirer
            .prompt([
                {
                    message: "What item would you like to add?",
                    type: "list",
                    name: "choice",
                    choices: itemNamesArr
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Please insert the quantity"
                }
            ])
            .then(function (answers) {
                let updateQuantity = parseInt(answers.quantity);

                let chosenItem = answers.choice;
                results.forEach(element => {
                    if (element.product_name === answers.choice) {
                        chosenItem = element;

                        updateQuantity += element.stock_quantity;

                        console.log(`\nWe have ${updateQuantity} ${element.product_name} in stock now.\n`.brightYellow);
                        
                    }
                });

                const sqlQuery = "UPDATE products SET ? WHERE ?";
                const queryParams = [{ stock_quantity: updateQuantity }, { item_id: chosenItem.item_id }];
                conn.connection.query(sqlQuery, queryParams, function (error, results) {
                    if (error) throw error;
                    console.log("The quantity has been updated\n");

                })
                conn.connection.end()
            }

            )
    })

    //If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
}


function addNewProduct() {
    let depArr = [];
    conn.connection.query("SELECT * FROM departments", function (error, results) {
        if (error) throw error;
        results.forEach(element => {
            depArr.push(element.department_name);
        })
    });


    inquirer
        .prompt([
            {
                name: "product_name",
                message: "Please insert the product name",
                type: "input"
            },
            {
                name: "department_name",
                message: "Please select department",
                type: "list",
                choices: depArr
            },
            {
                name: "price",
                message: "Please insert product price",
                type: "input"
            },
            {
                name: "stock_quantity",
                message: "Please insert product quantity",
                type: "input"
            }
        ])
        .then(function (answers) {
            let sqlQuery = "INSERT INTO products SET ?";
            let productObj = {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_quantity: answers.stock_quantity
            }
            conn.connection.query(sqlQuery, productObj, function (error, results) {
                if (error) throw error;
                console.log(`\nThe product has been successfuly added\n`.brightYellow);
                conn.connection.end();

            })
        })
    //If a manager selects Add New Product, it should allow the manager to add a completely new product to the store. 
}

inquirer
    .prompt([
        {
            message: "Menu options",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "menu_options"
        }
    ])
    .then(function (answers) {
        console.log(answers);
        if (answers.menu_options === "View Products for Sale") {
            viewProducts();
        }
        if (answers.menu_options === "View Low Inventory") {
            viewLowInv();
        }
        if (answers.menu_options === "Add to Inventory") {
            addToInv();
        }
        if (answers.menu_options === "Add New Product") {
            addNewProduct();
        }

    })