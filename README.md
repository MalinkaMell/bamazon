# Bamazon

### Overview

In this activity, you'll be creating an Amazon-like storefront with the MySQL skills you learned this unit. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.


### Challenge #1: Customer View (Minimum Requirement)

    * The app should then prompt users with two messages:
        * The first should ask them the ID of the product they would like to buy.
        * The second message should ask how many units of the product they would like to buy.
        * Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

### Challenge #2: Manager View (Next Level)

    * Running this application will list a set of menu options:
        * View Products for Sale: the app should list every available item: the item IDs, names, prices, and quantities.
        * View Low Inventory: then it should list all items with an inventory count lower than five.
        * Add to Inventory: your app should display a prompt that will let the manager "add more" of any item currently in the store.
        * Add New Product: it should allow the manager to add a completely new product to the store.

### Challenge #3: Supervisor View (Final Level)

    * Running this application will list a set of menu options:
        *-* View Product Sales by Department: the app should display a summarized table in their terminal/bash window

        | department_id | department_name | over_head_costs | product_sales | total_profit |
        |:-------------:|:---------------:|:---------------:|:-------------:|:------------:|
        | 01            | Electronics     | 10000           | 20000         | 10000        |

        *-* Create New Department

_Made for University of Arizona Coding Bootcamp, Week-12, October 2019_
