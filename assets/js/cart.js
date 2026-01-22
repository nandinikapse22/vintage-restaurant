let discountValue = 0;

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartItems");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-light">Your cart is empty.</p>`;
    updateTotal();
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="flex-grow-1">
        <h6 class="item-title">${item.name}</h6>
        <p class="item-price">₹${item.price}</p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-warning" onclick="changeQty(${index}, parseInt(document.getElementById('cartQty-${index}').value) - 1)">
          <i class="bi bi-dash-lg"></i>
        </button>
        <input id="cartQty-${index}" type="number" min="1" class="qty-input text-center" value="${item.qty || 1}" onchange="changeQty(${index}, this.value)" style="width:60px;">
        <button class="btn btn-sm btn-outline-warning" onclick="changeQty(${index}, parseInt(document.getElementById('cartQty-${index}').value) + 1)">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      <button class="btn-remove" onclick="removeItem(${index})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  updateTotal();
}

function updateTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  cart.forEach(item => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.qty) || 1;
    subtotal += price * qty;
  });

  let gst = subtotal * 0.05;
  let otherCharges = cart.length > 0 ? 30 : 0;
  let discount = discountValue;

  // Get elements
  const homeDeliveryEl = document.getElementById("homeDelivery");
  const dineInEl = document.getElementById("dineIn");

  // Mutually exclusive logic
  if (homeDeliveryEl && dineInEl) {
    homeDeliveryEl.addEventListener("change", () => {
      if (homeDeliveryEl.checked) dineInEl.checked = false;
      updateTotal();
    });
    dineInEl.addEventListener("change", () => {
      if (dineInEl.checked) homeDeliveryEl.checked = false;
      updateTotal();
    });
  }

  // Charges
  let delivery = homeDeliveryEl?.checked ? 50 : 0;
  let serviceCharge = dineInEl?.checked ? 100 : 0;

  // Total Calculation
  let total = subtotal + gst + otherCharges + delivery + serviceCharge - discount;

  // Update display
  document.getElementById("subtotal").innerText = "₹" + subtotal.toFixed(2);
  document.getElementById("gst").innerText = "₹" + gst.toFixed(2);
  document.getElementById("otherCharges").innerText = "₹" + otherCharges;
  document.getElementById("deliveryCharges").innerText = "₹" + delivery;
  document.getElementById("serviceCharge").innerText = "₹" + serviceCharge;
  document.getElementById("discount").innerText = "₹" + discount.toFixed(2);
  document.getElementById("total").innerText = "₹" + total.toFixed(2);
}

function applyCoupon() {
  const code = document.getElementById("couponCode").value.trim().toUpperCase();
  const msg = document.getElementById("couponMsg");

  if (code === "ROBIN50") {
    discountValue = 50;
    msg.textContent = "🎉 Coupon applied! ₹50 discount added.";
  } else if (code === "WELCOME10") {
    const subtotal = parseFloat(document.getElementById("subtotal").innerText.replace("₹", "")) || 0;
    discountValue = subtotal * 0.1;
    msg.textContent = "🎉 10% discount applied!";
  } else if (code === "") {
    discountValue = 0;
    msg.textContent = "Please enter a coupon code.";
  } else {
    discountValue = 0;
    msg.textContent = "⚠️ Invalid coupon code.";
  }

  updateTotal();
}

function changeQty(index, qty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  qty = parseInt(qty);
  if (qty < 1) qty = 1;
  cart[index].qty = qty;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Suggested Items
const suggestedItems = [
  { name: "Fish Cherry", img: "img/menu-images/fish-cherry.jpg", price: 250 },
  { name: "Paneer Tikka", img: "img/menu-images/paneer-tikka.jpg", price: 220 },
  { name: "Veg Biryani", img: "img/menu-images/veg-biryani.jpg", price: 180 },
  { name: "Butter Naan", img: "img/menu-images/butter-naan.jpg", price: 60 }
];

function loadSuggestedItems() {
  const container = document.getElementById("suggestedItems");
  container.innerHTML = "";

  suggestedItems.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="suggested-item text-center p-3 border border-warning rounded-3 bg-dark text-light">
        <img src="${item.img}" alt="${item.name}" class="img-fluid rounded mb-2" style="height:120px;object-fit:cover;">
        <h6 class="mb-1">${item.name}</h6>
        <p class="text-warning mb-2">₹${item.price}</p>

        <div class="d-flex justify-content-center align-items-center gap-2">
          <button class="btn btn-sm btn-outline-warning" onclick="changeSuggestedQty(${index}, -1)">
            <i class="bi bi-dash-lg"></i>
          </button>
          <span id="suggestedQty-${index}" class="fw-bold">0</span>
          <button class="btn btn-sm btn-outline-warning" onclick="changeSuggestedQty(${index}, 1)">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
        <p id="addedMsg-${index}" class="text-success small mt-2" style="display:none;">Added to cart ✅</p>
      </div>
    `;
    container.appendChild(col);
  });
}

function changeSuggestedQty(index, change) {
  const qtySpan = document.getElementById(`suggestedQty-${index}`);
  let qty = parseInt(qtySpan.textContent);
  qty = Math.max(0, qty + change);
  qtySpan.textContent = qty;

  const item = suggestedItems[index];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingIndex = cart.findIndex(c => c.name === item.name);

  if (qty > 0) {
    if (existingIndex >= 0) {
      cart[existingIndex].qty = qty;
    } else {
      cart.push({ name: item.name, image: item.img, price: item.price, qty: qty });
    }
    document.getElementById(`addedMsg-${index}`).style.display = "block";
  } else if (existingIndex >= 0) {
    cart.splice(existingIndex, 1);
    document.getElementById(`addedMsg-${index}`).style.display = "none";
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

window.onload = function () {
  loadCart();
  loadSuggestedItems();
};


