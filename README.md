# Inventory Management System - Backend
A simple backend system for managing product inventory using Node.js, Express.js, and MongoDB.
Features
- Add, view, update, and delete products
- Track and restock stock quantity
- RESTful API for integration
  
## Tech Stack
Node.js, Express.js, MongoDB (Mongoose), dotenv, nodemon

## How to Run the Project
1. Clone the repository
  - git clone <repo-url> && cd inventory-management-backend
2. Install dependencies
  - npm install
3. Set up environment variables in a .env file:
  - PORT=5000
  - MONGO_URI=mongodb://localhost:27017/inventoryDB
4. Run the server
 - npm run dev  (for development)
 -  npm start     (for production)
   
## API Endpoints
Base URL: http://localhost:5000/api/products

- GET    /         → Get all products
- GET    /:id      → Get a specific product
- POST   /         → Add a new product
- PUT    /:id      → Update product details
- DELETE /:id      → Delete a product

