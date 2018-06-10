# bamazon

Video Demonstration: https://github.com/RomeoKilo125/bamazon/blob/master/Bamazon_Demo.mp4

This is a command line, node, mysql app that demonstrates a the setup of a simple store called Bamazon.

The app is really three separate components of a larger whole that all work together.


###Customer Mode
There is a customer interface, from which customers can browse products and make purchases.

The customer is initially shown a list of available products to select from.

Once they have selected a product, they are shown the details of that product, including how many are available.

They are then asked how many they would like to purchase.

If the customer failed to read, or misunderstood the available number of a given item, their transaction is automatically adjusted, and they must confirm that they understand this.

After indicating the quantity of the item they want, the customer is presented with the total cost of their purchase and asked to confirm the transaction.

When the transaction is complete, they may return to the main menu or exit the application.

###Manager Mode
The product managers can view the total inventory, check on items that might be running low, adjust the inventory, or add completely new products.

###Supervisor Mode
Department Supervisors are responsible for keeping track of sales, and profits. They can view aggregated data pertainining to this, and create whole new departments for incoming products.
