const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

<<<<<<< HEAD
/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   STATIC FRONTEND (IMPORTANT)
   This serves /public/index.html automatically
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HOMEPAGE ROUTE (FOR SAFETY)
   Ensures "/" always works
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   PRODUCTS API
========================= */
const products = require("./products");

=======
/* middleware */
app.use(cors());
app.use(express.json());

/* serve static images */
app.use(express.static(path.join(__dirname, "public")));

/* products */
const products = require("./products");

/* orders storage (temporary) */
let orders = [];

/* GET products */
>>>>>>> 18bea617244d6b5829f7edd24832032a614e2a9d
app.get("/api/products", (req, res) => {
  res.json(products);
});

<<<<<<< HEAD
/* =========================
   ORDERS STORAGE (TEMP - RAM ONLY)
========================= */
let orders = [];

/* =========================
   CHECKOUT API
========================= */
=======
/* checkout */
>>>>>>> 18bea617244d6b5829f7edd24832032a614e2a9d
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
<<<<<<< HEAD
    estimatedReady: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    )
  });
});

/* =========================
   VIEW ORDERS (TEST ONLY)
========================= */
=======
    estimatedReady: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  });
});

/* view orders */
>>>>>>> 18bea617244d6b5829f7edd24832032a614e2a9d
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

<<<<<<< HEAD
/* =========================
   START SERVER (RENDER SAFE)
========================= */
=======
/* start server */
>>>>>>> 18bea617244d6b5829f7edd24832032a614e2a9d
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});