# Thinkbridge Invoice API

A minimal Node.js Express API to retrieve invoices and their items from a MySQL database.  
**Note:** This API is not deployed anywhere currently; it runs only on your local machine.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MySQL](https://www.mysql.com/)
- `npm` (comes with Node.js)

## Setup

1. **Clone the repository**  
   (or copy the project files to your machine)

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file in the `src` folder with:

   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   ```

4. **Start the server**

   ```sh
   node src/index.js
   ```

5. **Access the API**
   - API endpoint: [http://localhost:3000/api/invoice](http://localhost:3000/api/invoice)
   - Swagger docs: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

---

**This API is not deployed online. You must run it locally to use it.**
