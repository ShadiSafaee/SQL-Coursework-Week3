const express = require("express");
const app = express();

const { Pool } = require("pg");
const PORT = process.env.PORT || 5000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const pool = new Pool({
  user: "shadab",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "",
  port: 5432,
});

app.get("/", (req, res) => res.send("SEREVER IS WORKING"));

app.get("/customers", function (req, res) {
  pool
    .query("SELECT * FROM customers;")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
app.get("/suppliers", function (req, res) {
  pool
    .query("SELECT * FROM suppliers;")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

app.get("/products", (req, res) => {
  const nameQuery = req.query.name;
  const selectQuery =
    "SELECT products.product_name, product_availability.unit_price, suppliers.supplier_name FROM product_availability INNER JOIN suppliers on suppliers.id = product_availability.supp_id INNER JOIN products on products.id = product_availability.prod_id WHERE product_name = $1";
  if (nameQuery) {
    pool
      .query(selectQuery, [nameQuery])
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  } else {
    res.status(400).send("please enter ");
  }
});

app.get("/customers/:cusId", async (req, res) => {
  const productId = req.params.cusId;
  const selectQuery = "SELECT * FROM customers WHERE id = $1";
  const result = await pool.query(selectQuery, [productId]);
  res.json(result.rows);
});
app.listen(PORT, () => console.log(`App is running on ${PORT}`));
