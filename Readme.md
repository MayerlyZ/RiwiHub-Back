# RiwiHub-Back

Backend for an e-commerce platform with role system, JWT authentication, and modular architecture.

---

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- MySQL database (you can use Aiven, PlanetScale, etc.)

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/MayerlyZ/RiwiHub-Back.git
  cd RiwiHub-Back
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Create a `.env` file in the root of the project with the following content (adjust the values for your environment):
  ```env
  JWT_SECRET=your_jwt_secret
  DB_HOST=your_db_host
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_PORT=your_db_port
  DB_DATABASE=your_db_name
  DB_SSL_CA_PATH=aiven-ca.pem
  PORT=3000
  ```
4. Make sure you have the certificate file (e.g., `aiven-ca.pem`) if your database requires it.

### Running the Server

Start the server in development mode:
```bash
npm start
```
By default, the server will run at `http://localhost:3000`.

## Project Overview

This backend powers an e-commerce platform with a well-defined role system. It uses **Node.js** with **Express.js** to create a RESTful API. Data persistence is handled with **Sequelize** and **MySQL**. Route security is managed with **JSON Web Tokens (JWT)**, ensuring that only authenticated users with the appropriate permissions can perform certain actions.

---

## Main Technologies

- **Server:** Node.js, Express.js
- **Database:** MySQL with Sequelize (ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** bcryptjs for password hashing
- **Environment Variables:** dotenv

---

## Project Structure

- **server.js:** Main entry point. Starts the Express server, applies global middlewares, and configures the application startup.
- **.env:** File (you must create) to store sensitive environment variables (database credentials, JWT secret, etc.).
- **/BACK:** Main directory containing all application logic.
  - **/config:** Database connection configuration (`db.js`).
  - **/controllers:** Business logic. Each function handles a specific request (e.g., register a user, get a product).
  - **/middlewares:** Logic to verify authentication (`authMiddleware.js`) and user roles.
  - **/models:** Defines the database structure and relationships (`associations.js`).
  - **/routes:** Defines API endpoints and connects them to their respective controllers.
  - **/services:** Reusable logic, such as token management or interaction with external services.

---

## API Guide for Frontend Consumption

### Initial Setup

The base URL of the API is the address where your server is deployed. For local development, it is usually:

```
http://localhost:3000
```

All API routes are prefixed with `/api`.

---

### Authentication

Most routes are protected. The flow is:

1. The user logs in at `POST /api/users/login`.
2. The backend responds with a JWT token.
3. The frontend must store this token (in localStorage or sessionStorage).
4. For each subsequent request to a protected route, the frontend must include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token_here>
```

---

## API Endpoints

### 1. Users and Authentication

#### Register User

- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "name": "Full Name",
    "email": "email@example.com",
    "password": "your_secure_password",
    "role": "Customer" // or "Seller"
  }
  ```
- **Successful response (201):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### Login

- **POST** `/api/users/login`
- **Body:**
  ```json
  {
    "email": "email@example.com",
    "password": "your_password"
  }
  ```
- **Successful response (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "email@example.com",
      "role": "Customer"
    }
  }
  ```

#### User Profile

- **GET** `/api/users/profile`
- **Authentication:** Required (JWT Token)
- **Successful response (200):** Returns the user object (without the password).

---

### 2. Items (Products)

#### List Products

- **GET** `/api/items`
- **Successful response (200):**
  ```json
  [
    {
      "id": 1,
      "name": "Sample Product",
      "description": "A detailed description",
      "price": 150.00,
      "stock": 10
    }
    // ...
  ]
  ```

#### Create Product

- **POST** `/api/items`
- **Authentication:** Required and only for users with the "Seller" role.
- **Body:**
  ```json
  {
    "name": "New Product",
    "description": "Description of the new product",
    "price": 200.50,
    "stock": 50
  }
  ```
- **Successful response (201):** Returns the newly created item object.

---

### 3. Shopping Cart

#### View Cart

- **GET** `/api/carts`
- **Authentication:** Required.
- **Successful response (200):** Returns the current state of the cart, including items and their quantities.

#### Add to Cart

- **POST** `/api/carts/add`
- **Authentication:** Required.
- **Body:**
  ```json
  {
    "itemId": 1,
    "quantity": 2
  }
  ```
- **Successful response (200):** Returns the updated state of the cart.

---

### 4. Orders

#### Create Order

- **POST** `/api/orders`
- **Authentication:** Required.
- **Successful response (201):** Returns a confirmation message and the details of the created order.

#### Order History

- **GET** `/api/orders`
- **Authentication:** Required.
- **Successful response (200):** Returns an array with all the user's orders.

---

## Notes

- Remember to create the `.env` file with your environment variables.
- For protected routes, always include the JWT token in the `Authorization` header.
- Check the source code for more details on validations and error responses.

---

## Contact

Project developed by MayerlyZ and collaborators.

For questions or suggestions, you can open an issue in the repository or contact me via GitHub.
