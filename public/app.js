let cart = [];

/* =========================
   🌐 BACKEND URL (RENDER)
========================= */
const BASE_URL = "https://food-shop-q4vc.onrender.com";

const API = `${BASE_URL}/api/products`;
const API_IMG = BASE_URL;

/* =========================
   📦 LOAD PRODUCTS (SAFE VERSION)
========================= */
async function loadProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = `<p class="text-gray-500">Loading products...</p>`;

  try {
    const res = await fetch(API);

    if (!res.ok) throw new Error("Failed to load products");

    const products = await res.json();

    container.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");

      card.className =
        "product-card rounded-3xl p-4 shadow-xl text-center";

      card.innerHTML = `
        <div class="overflow-hidden rounded-2xl">
          <img
            src="${API_IMG + p.image}"
            onerror="this.src='https://via.placeholder.com/300'"
            class="w-full h-52 object-cover hover:scale-110 transition duration-500"
          />
        </div>

        <h2 class="text-2xl font-bold mt-4">${p.name}</h2>

        <p class="text-green-600 text-xl font-black mt-2">
          ₱${p.price}
        </p>

        <button class="
          mt-5 w-full py-3 rounded-2xl text-white font-bold
          bg-gradient-to-r from-orange-500 to-pink-500
          hover:scale-105 transition shadow-lg
        ">
          Add to Cart
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        addToCart(p);
      });

      container.appendChild(card);
    });

    updateReminderDate();

  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <p class="text-red-500 font-bold">
        Failed to load products. Check backend URL.
      </p>
    `;
  }
}

/* =========================
   🛒 ADD TO CART
========================= */
function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

/* =========================
   🧾 UPDATE CART
========================= */
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="text-gray-500">No items added yet.</div>`;
    cartTotal.innerText = "₱0";
    cartCount.innerText = "0";
    return;
  }

  cart.forEach(item => {
    totalItems += item.qty;
    totalPrice += item.price * item.qty;

    const div = document.createElement("div");

    div.className =
      "bg-white/60 rounded-2xl p-4 flex justify-between items-center";

    div.innerHTML = `
      <div>
        <h3 class="font-bold text-lg">${item.name}</h3>
        <p>₱${item.price} × ${item.qty}</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="minus bg-red-500 text-white px-3 py-1 rounded-lg">-</button>
        <span class="font-bold">${item.qty}</span>
        <button class="plus bg-green-500 text-white px-3 py-1 rounded-lg">+</button>
      </div>
    `;

    div.querySelector(".minus").onclick = () => decreaseQty(item.id);
    div.querySelector(".plus").onclick = () => increaseQty(item.id);

    cartItems.appendChild(div);
  });

  cartTotal.innerText = `₱${totalPrice}`;
  cartCount.innerText = totalItems;
}

/* =========================
   ➕ / ➖ QTY
========================= */
function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  updateCart();
}

function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

/* =========================
   CART MODAL
========================= */
function openCart() {
  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

/* =========================
   REMINDER DATE
========================= */
function updateReminderDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);

  const formatted = date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  document.getElementById("deliveryDate").innerText =
    `Estimated completion date: ${formatted}`;
}

/* =========================
   PLACE ORDER (SAFE VERSION)
========================= */
async function placeOrder() {
  const email = document.getElementById("customerEmail").value;
  const phone = document.getElementById("customerPhone").value;

  if (cart.length === 0) return alert("Add items first!");
  if (!email || !phone) return alert("Fill up details!");

  try {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, cart })
    });

    const data = await res.json();

    document.getElementById("orderSuccess").classList.remove("hidden");

    document.getElementById("orderSuccess").innerHTML = `
      ✅ Order placed successfully!<br><br>
      🧾 Order ID: <strong>${data.orderId}</strong><br><br>
      📦 ${document.getElementById("deliveryDate").innerText}
    `;

    cart = [];
    updateCart();

  } catch (err) {
    alert("Order failed. Check backend connection.");
    console.error(err);
  }
}

/* =========================
   INIT
========================= */
loadProducts();