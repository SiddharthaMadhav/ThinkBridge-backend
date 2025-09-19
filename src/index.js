const express = require("express");
require("dotenv").config();
const mysql = require("mysql2/promise");

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

app.get("/api/invoice", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [invoices] = await connection.execute("SELECT * FROM invoices");
    const [items] = await connection.execute("SELECT * FROM InvoiceItems");
    const result = invoices.map((inv) => ({
      invoiceId: inv.InvoiceID,
      customerName: inv.CustomerName,
      items: items
        .filter((it) => it.InvoiceID === inv.InvoiceID)
        .map((it) => ({
          name: it.Name,
          price: it.Price,
        })),
    }));
    res.json(result);
  } catch (err) {
    console.error("Error connecting to the database:", err);
    return res.status(500).json({ error: "Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
