//bonuses achieved in this session: 
// 1: asking user if he wants to buy out my product
// 2: using modules

let conn = require("./connection");
let inquirer = require("inquirer");

//connect
conn.connection.connect(function (error) {
    if (error) throw error;
    //call select product
    selectProducts();

})

//select all products from database
function selectProducts() {
    //prepare query
    let sqlQuery = "SELECT * FROM products";
    //execute query
    conn.connection.query(sqlQuery, function (error, results) {
        if (error) throw error;
        results.forEach(element => {
            console.log(` `);
            console.log(` ${element.item_id}  |   ${element.product_name}  |   ${element.department_name}   |   ${element.price}`);
            console.log(`_______________________________________________________________________________________________`);
        });
        //invoking function that will ask user what he wants to buy and quantity
        askUser();
    })
}

//I guess this is going to be the bonus, if we don't have enough quantity, 
//instead of just returning I will ask the user if he want to buy all i've got
function buyItAnyway(id) { //passing item id to function
    const sqlQuery = "UPDATE products SET ? WHERE ?"; // prepare query
    const arr = [{ stock_quantity: 0 }, { item_id: id }]; //set quantity to 0, passing item id
    //connecting
    conn.connection.query(sqlQuery, arr, function (err, results) {
        if (err) throw err;
    })
}

//buy product
function buyIt(available, quantity, id, price, product_sales) {
    //prepare query
    const sqlQuery = "UPDATE products SET ? WHERE ?";
    const totalPrice = parseFloat(product_sales) + parseFloat(quantity) * parseFloat(price); 
    
    const total = available - quantity; //calculating quantity after purchase
    const arr = [{ stock_quantity: total, product_sales: totalPrice }, { item_id: id }];
    conn.connection.query(sqlQuery, arr, function (err, results) {
        if (err) throw err;
    })
}

//here all the action happens
function askUser() {
    //nicely asking user what he wants to buy and how many
    inquirer
        .prompt([
            {//here asking ID
                message: "Please insert the ID of the product you would like to buy",
                type: "input",
                name: "product_id"
            },
            {//here asking quantity
                message: "Please insert the quantity",
                type: "input",
                name: "quantity"
            }
        ])
        .then(function (answers) {
            //prepare query
            let sqlQuery = "SELECT * FROM products WHERE ?";
            //get product ID
            let product = { item_id: answers.product_id };
            //execute
            conn.connection.query(sqlQuery, product, function (error, results) {
                if (error) throw error;
                //console.log(results);
                //available quantity of product
                let available = results[0].stock_quantity; //check how many items i have available
                let item_id = answers.product_id; // product user wants to buy
                let quantity = answers.quantity; //quantity desired by user
                let total = quantity * results[0].price; // total price based on quantity
                let totalAvailable = parseFloat(available * results[0].price); //total in case of buy out
                let product_sales = results[0].product_sales;
                let price = results[0].price;

                //here checking if user want more than i have
                if (available === 0) {

                    console.log("\nWe apologise, we don't have any " + results[0].product_name + " at this time!\n");
                    conn.connection.end();

                } else if (available < answers.quantity) {
                    //nicely apologise and ask if he want to buy all i've got
                    console.log(`\nWe apologise, we don't have ${answers.quantity} ${results[0].product_name} at this time! \nWe only have ${available} ${results[0].product_name} available. Would you like to purchase it all?\n`);
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "select",
                                choices: ["Yes", "No"]
                            }
                        ])
                        .then(function (answers) {
                            if (answers.select === "Yes") {
                                buyItAnyway(item_id); //buy out
                                console.log("\nAll right! Your total for today is: $" + totalAvailable + ".\n"); //displaying total
                                conn.connection.end();
                            }
                            else {
                                console.log("\nToo bad :(\n");
                                conn.connection.end();
                            }
                        })
                } else { //if i have enough
                    buyIt(available, quantity, item_id, price, product_sales); //buy
                    console.log("\nAll right! Your total for today is: $" + total + "\n");
                    conn.connection.end();
                }

            });
        })
}