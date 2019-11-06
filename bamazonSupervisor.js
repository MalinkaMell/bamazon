const inquirer = require("inquirer");
let conn = require("./connection");
let colors = require("colors");

//view by department function
function viewByDep() {
    /*selecting:
    department_id, department_name, over_head_costs from departments table
    product_sales, department_name from products table
    summing the values of each element in product_sales column (products table) and subtracting over_head_costs (department table) 
    and showing the results in virtual "total_profit" column
    */
    let sqlQuery =
        `SELECT d.department_id, 
                d.department_name, 
                d.over_head_costs, 
                p.product_sales, 
                p.department_name, 
                SUM (p.product_sales) - d.over_head_costs AS total_profit,
                SUM (p.product_sales) AS product_sales 
        FROM departments AS d 
        INNER JOIN products AS p 
        ON d.department_name = p.department_name
        GROUP BY d.department_id`
    conn.connection.query(sqlQuery, function (error, results) {
        if (error) throw error;
        console.table(results, ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]);
        conn.connection.end();
    })
};

//create new department function
function createNewDep() {
    inquirer
        .prompt([{
            message: "Please, insert department name",
            type: "input",
            name: "department_name"
        },
        {
            message: "Please, insert over head cost",
            type: "input",
            name: "over_head_costs"
        }])
        .then(function (answers) {
            let sqlQuery = "INSERT INTO departments SET ?";
            let depArr = { department_name: answers.department_name, over_head_costs: answers.over_head_costs };
            conn.connection.query(sqlQuery, depArr, function (error, results) {
                if (error) throw error;
                console.log(`\nNew department has been successfully created\n`.brightYellow);
                conn.connection.end();
            })
        })
};

//inquirer as we starting the application
function start() {
    inquirer
        .prompt([
            {
                name: "options",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department"],
                message: "Choose what do you want to do"
            }
        ])
        .then(function (answers) {

            switch (answers.options) {
                case "View Product Sales by Department":
                    viewByDep();
                    break;

                case "Create New Department":
                    createNewDep();
                    break;

                default:
                    break;
            }

        })

}

//run application
start();