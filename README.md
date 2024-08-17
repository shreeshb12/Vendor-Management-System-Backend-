# Vendor Management System

## Overview

The Vendor Management System is a Node.js application that allows for managing vendors and purchase orders. It includes functionality to calculate and store performance metrics and provides API endpoints for interacting with the system. The system uses MongoDB for data storage and includes token-based authentication for security.

## Table of Contents

- Installation
- Configuration
- API Endpoints
  - Vendor Endpoints
  - Purchase Order Endpoints
- Swagger Documentation
- Testing
- License

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/vendor-management-system.git
    cd vendor-management-system
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory with the following content:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/vendor-management
    JWT_SECRET=your_jwt_secret
    ```

    Update `MONGO_URI` and `JWT_SECRET` as needed for your environment.

4. **Run the application:**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Configuration

- **MongoDB**: Ensure MongoDB is running on your local machine or adjust the `MONGO_URI` in the `.env` file to point to your MongoDB instance.

- **JWT Secret**: Make sure the `JWT_SECRET` in the `.env` file is set to a secure value.

## API Endpoints

### Vendor Endpoints

#### Create Vendor

- **Endpoint**: `POST /api/vendors`
- **Description**: Create a new vendor.
- **Request Body**:

    ```json
    {
      "name": "Acme Supplies Ltd.",
      "contactDetails": {
        "phone": "+1-800-555-1234",
        "email": "contact@acmesupplies.com"
      },
      "address": {
        "street": "1234 Elm Street",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701",
        "country": "USA"
      }
    }
    ```

- **Response**:

    ```json
    {
      "vendorCode": "ACM-1234",
      "name": "Acme Supplies Ltd.",
      "contactDetails": {
        "phone": "+1-800-555-1234",
        "email": "contact@acmesupplies.com"
      },
      "address": {
        "street": "1234 Elm Street",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701",
        "country": "USA"
      }
    }
    ```

#### Get Vendor

- **Endpoint**: `GET /api/vendors/:vendorId`
- **Description**: Retrieve vendor details by ID.
- **Response**:

    ```json
    {
      "vendorCode": "ACM-1234",
      "name": "Acme Supplies Ltd.",
      "contactDetails": {
        "phone": "+1-800-555-1234",
        "email": "contact@acmesupplies.com"
      },
      "address": {
        "street": "1234 Elm Street",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701",
        "country": "USA"
      }
    }
    ```

### Purchase Order Endpoints

#### Create Purchase Order

- **Endpoint**: `POST /api/purchase-orders`
- **Description**: Create a new purchase order.
- **Request Body**:

    ```json
    {
      "vendor": "vendorId",
      "orderDate": "2024-08-01T00:00:00Z",
      "deliveryDate": "2024-08-10T00:00:00Z",
      "items": {
        "item1": "description",
        "item2": "description"
      },
      "quantity": 10,
      "status": "pending",
      "qualityRating": 4,
      "issueDate": "2024-08-01T00:00:00Z",
      "acknowledgmentDate": "2024-08-02T00:00:00Z"
    }
    ```

- **Response**:

    ```json
    {
      "poNumber": "VC-20240801-123",
      "vendor": "vendorId",
      "orderDate": "2024-08-01T00:00:00Z",
      "deliveryDate": "2024-08-10T00:00:00Z",
      "items": {
        "item1": "description",
        "item2": "description"
      },
      "quantity": 10,
      "status": "pending",
      "qualityRating": 4,
      "issueDate": "2024-08-01T00:00:00Z",
      "acknowledgmentDate": "2024-08-02T00:00:00Z"
    }
    ```

#### Update Purchase Order

- **Endpoint**: `PATCH /api/purchase-orders/:poId`
- **Description**: Update an existing purchase order.
- **Request Body**:

    ```json
    {
      "status": "completed",
      "acknowledgmentDate": "2024-08-02T00:00:00Z"
    }
    ```

- **Response**:

    ```json
    {
      "message": "Purchase Order updated successfully",
      "purchaseOrder": {
        "poNumber": "VC-20240801-123",
        "vendor": "vendorId",
        "orderDate": "2024-08-01T00:00:00Z",
        "deliveryDate": "2024-08-10T00:00:00Z",
        "items": {
          "item1": "description",
          "item2": "description"
        },
        "quantity": 10,
        "status": "completed",
        "qualityRating": 4,
        "issueDate": "2024-08-01T00:00:00Z",
        "acknowledgmentDate": "2024-08-02T00:00:00Z"
      }
    }
    ```

## Swagger Documentation

- **Endpoint**: `/api-docs`
- **Description**: Access the Swagger documentation for detailed information on available API endpoints and their usage.

## Testing

You can test the API using tools like [Postman](https://www.postman.com/) or through the Swagger UI. Ensure that your application is running and the API server is accessible.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
