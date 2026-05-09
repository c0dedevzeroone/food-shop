const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   STATIC FRONTEND
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* HOME ROUTE */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   PRODUCTS
========================= */
const products = require("./products");

app.get("/api/products", (req, res) => {
  res.json(products);
});

/* =========================
   ORDERS (TEMP STORAGE)
========================= */
let orders = [];

/* CHECKOUT */
app.post("/api/checkout", (req, res) => {
  const order = req.body;

  const newOrder = {
    id: Date.now(),
    ...order,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  console.log("Order received:", newOrder);

  res.json({
    message: "Order placed successfully!",
    orderId: newOrder.id,
    estimatedReady: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  });
});

/* VIEW ORDERS */
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});