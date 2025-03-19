# Convenience Store POS Web App (PWA)

## User Story
A small convenience store needs a simple, web-based POS system to manage inventory, process sales, and generate receipts. The app should be accessible from any device with a browser and offer a fast, app-like experience.

## Features
### Core Features
- **User Authentication**  
  - Login page with basic username and password.  
  - Redirects to dashboard on successful login.  

- **Inventory Management**  
  - View a list of products with name, price, and quantity.  
  - Add new products.  
  - Edit or remove existing products.  

- **Sales Management**  
  - Search for products and add to a virtual cart.  
  - View real-time cart total.  
  - Complete sale, reducing product inventory.  

- **Receipts**  
  - Show a simple sales receipt after purchase.  
  - Display product list, total amount, and timestamp.  

## User Flow
1. **Login Page** → Enter credentials → Redirect to dashboard.  
2. **Dashboard** → Choose between Inventory Management and Sales.  
3. **Inventory Management** → View, add, edit, or remove products.  
4. **Sales Page** → Add products to cart, see total, complete sale.  
5. **Receipt Page** → Display simple sales receipt.  

## Roadmap
- Add role-based permissions (cashier, manager).  
- Generate sales reports.  
- Stock-level alerts for low inventory.  
- Barcode scanner support.  
- Offline mode with PWA functionality.  
