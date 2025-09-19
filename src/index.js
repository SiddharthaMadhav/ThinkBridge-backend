const express = require("express");
require("dotenv").config();
const mysql = require("mysql2/promise");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Invoice API",
      version: "1.0.0",
      description: "API to retrieve invoices and items",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        InvoiceItem: {
          type: "object",
          properties: {
            name: { type: "string", example: "Item A" },
            price: { type: "number", format: "float", example: 19.99 },
          },
          required: ["name", "price"],
        },
        Invoice: {
          type: "object",
          properties: {
            invoiceId: { type: "integer", example: 101 },
            customerName: { type: "string", example: "Acme Corp" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/InvoiceItem" },
            },
          },
          required: ["invoiceId", "customerName", "items"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error" },
          },
          required: ["error"],
        },
      },
    },
  },
  apis: [__filename],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/invoice:
 *   get:
 *     summary: Get all invoices with items
 *     description: Returns a list of invoices, each with its associated items.
 *     tags:
 *       - Invoices
 *     responses:
 *       '200':
 *         description: A JSON array of invoices.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       '500':
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
