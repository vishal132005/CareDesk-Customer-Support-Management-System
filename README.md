# CareDesk Customer Support Management System

CareDesk is a comprehensive full-stack customer support dashboard built with React, Vite, Tailwind CSS v4, Node.js, Express, and PostgreSQL.

## Features
- **Dashboard**: View overall ticket statistics (Total, Open, In Progress, Resolved).
- **Tickets**: Create, search, filter, update statuses, and view/reply to tickets.
- **Customers**: Manage customer information.
- **Employees**: Manage support agents and their roles.
- **Ticket Responses**: Interactive modal to communicate directly within ticket threads as either a Customer or an Employee.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React (Icons).
- **Backend**: Node.js, Express, PostgreSQL, `pg` driver, CORS, Dotenv.

---

## Setup Instructions

### 1. Database Configuration
1. Make sure you have **PostgreSQL 18** installed.
2. Create a database named `customer_support_db` (using pgAdmin or `psql`).
3. Update the `backend/.env` file with your database credentials:
   ```env
   PORT=5000
   DATABASE_URL=postgres://postgres:your_password@localhost:5433/customer_support_db
   ```
4. Initialize the database schema by running the initialization script:
   ```bash
   cd backend
   node init_db.js
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Express development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be available at `http://localhost:5173`.*

---

## Usage Guide
- Open the application in your browser at `http://localhost:5173`.
- Navigate using the Sidebar to access **Dashboard**, **All Tickets**, **Customers**, and **Employees**.
- **Creating a Ticket:** Click the "New Ticket" button on the Dashboard or Tickets page.
- **Replying to a Ticket:** Click the colored **Ticket ID** (e.g., `#1`) in the ticket table to open the interactive **Ticket Responses** thread.

## License
MIT
