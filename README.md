Internet Shop Application

This is a full-stack web application for an online shop built with Ruby on Rails (backend) and React (frontend) using PostgreSQL as the database.

Ruby Version

Ruby 3.x (recommended)

Rails 8.x

System Dependencies

PostgreSQL 13+

Git

Optional: WSL (for Windows users) or Linux/Ubuntu environment

Database

We use PostgreSQL with the following tables:

Users

first_name

last_name

email

password (handled via Devise gem)

role (admin or user)

Items

name

description

price

Orders

user_id

amount

OrdersDescription

order_id

item_id

quantity

Features / Workflow

User Registration & Authentication

Handled using the Devise
 gem.

Users can register and log in.

Browsing & Selecting Items

Users can search for items in the Items table.

Users can select a quantity for each item.

Placing Orders

When the user completes selection and "checks out":

A new record is created in the Orders table.

Each selected item is saved in the OrdersDescription table, linked to the order via order_id.

The Orders table is connected to Users via user_id.

Role-Based Access

Admin

Can view and edit all records in Users and Items tables.

User

Can view and edit only their personal data.

Can view their own orders and the details of each order.

Order Management

Users can fetch a list of their orders.

Users can expand each order to see its items and quantities.

Setup Instructions

Clone the repository:

git clone https://github.com/EdCrafter/shopAppR.git

Create and migrate the database:

rails db:create
rails db:migrate


Run the Rails server:

rails server


Run the React frontend:

cd frontend
npm run dev


Access the application:

Backend API: http://localhost:3000

Frontend: http://localhost:5173

Recommendations

If developing on Windows, consider using WSL or Linux for better compatibility with Rails and PostgreSQL.

Always use withCredentials: true in axios/fetch calls if you rely on cookies for authentication.