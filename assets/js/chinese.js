const chineseItems = [
  { name: "Sweet & Sour Chicken", img: "images/chinese/sweet-sour-chicken.jpg", price: 280 },
  { name: "Tandoori Hot Garlic Noodles", img: "images/chinese/hot-garlic-noodles.jpg", price: 220 },
  { name: "Smoky Schezwan Noodles", img: "images/chinese/schezwan-noodles.jpg", price: 210 },
  { name: "Salt & Pepper Squid", img: "images/chinese/salt-pepper-squid.jpg", price: 300 },
  { name: "Dim Sum Platter", img: "images/chinese/dim-sum.jpg", price: 270 },
  { name: "Beef in Oyster Sauce", img: "images/chinese/beef-oyster.jpg", price: 310 },
  { name: "Egg Drop Soup", img: "images/chinese/egg-drop-soup.jpg", price: 160 },
  { name: "Sichuan Tofu", img: "images/chinese/sichuan-tofu.jpg", price: 240 },
  { name: "Tangy Egg Fried Rice", img: "images/chinese/egg-fried-rice.jpg", price: 190 },
  { name: "Vegetable Fried Rice", img: "images/chinese/veg-fried-rice.jpg", price: 180 },
  { name: "Smoky Chicken Manchurian", img: "images/chinese/chicken-manchurian.jpg", price: 250 },
  { name: "Classic Spring Rolls", img: "images/chinese/spring-rolls.jpg", price: 200 },
  { name: "Pan-Seared Chili Garlic Prawn", img: "images/chinese/chili-garlic-prawn.jpg", price: 320 },
  { name: "Honey Glazed Wonton Soup", img: "images/chinese/wonton-soup.jpg", price: 170 },
  { name: "Honey Chili Potato", img: "images/chinese/honey-chili-potato.jpg", price: 190 },
  { name: "Vegetable Manchurian", img: "images/chinese/veg-manchurian.jpg", price: 230 },
  { name: "Spicy Chicken Manchurian", img: "images/chinese/spicy-manchurian.jpg", price: 260 },
  { name: "Stir Fried Broccoli", img: "images/chinese/stir-broccoli.jpg", price: 210 },
  { name: "Kung Pao Chicken", img: "images/chinese/kung-pao-chicken.jpg", price: 280 },
  { name: "Korean Style Wings", img: "images/chinese/korean-wings.jpg", price: 270 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const body = document.getElementById("cartPanelBody");
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  body.innerHTML = cart.length
    ? cart.map(i => `
      <div class="cart-item">
        <h6>${i.name} x${i.quantity}</h6>
        <small>${(i.customizations && i.customizations.length) ? i.customizations.join(", ") : "No customizations"}</small>
        <p class="mb-0 text-warning">₹${i.price * i.quantity}</p>
      </div>
    `).join("")
    : "<p class='text-center'>Your cart is empty.</p>";
  document.getElementById("cartTotal").innerText = total;
}

function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  panel.style.right = show ? "0" : "-350px";
}

function renderMenu() {
  const container = document.getElementById("chineseContainer");
  container.innerHTML = chineseItems.map(item => {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      return `
      <div class="col-sm-6 col-lg-4">
        <div class="product-card">
          <div class="product-img" style="background-image:url('${item.img}')"></div>
          <div class="product-info">
            <h6>${item.name}</h6>
            <p class="price">₹${item.price}</p>
            <div class="qty-controls" data-name="${item.name}">
              <button class="qty-btn minus">-</button>
              <span class="qty-count">${existing.quantity}</span>
              <button class="qty-btn plus">+</button>
            </div>
          </div>
        </div>
      </div>`;
    }
    return `
    <div class="col-sm-6 col-lg-4">
      <div class="product-card">
        <div class="product-img" style="background-image:url('${item.img}')"></div>
        <div class="product-info">
          <h6>${item.name}</h6>
          <p class="price">₹${item.price}</p>
          <button class="btn btn-gold btn-sm add-cart" data-name="${item.name}" data-price="${item.price}">
            <i class="bi bi-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>`;
  }).join("");
}

// Event delegation for dynamically added elements
document.getElementById("chineseContainer").addEventListener("click", e => {
  const btn = e.target.closest(".add-cart");
  const ctrl = e.target.closest(".qty-controls");
  
  // Add to cart button
  if (btn) {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    selectedItem = { name, price };
    new bootstrap.Modal(document.getElementById("customModal")).show();
  }

  // Quantity controls
  if (ctrl) {
    const name = ctrl.dataset.name;
    const item = cart.find(i => i.name === name);
    if (!item) return;

    if (e.target.classList.contains("plus")) {
      item.quantity++;
    } else if (e.target.classList.contains("minus")) {
      item.quantity--;
      if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
    }
    saveCart();
    renderMenu();
    renderCart();
    toggleCartPanel(true);
  }
});

// Save customization from modal
document.getElementById("saveCustom").addEventListener("click", () => {
  const form = document.getElementById("customForm");
  const customizations = Array.from(form.querySelectorAll("input:checked")).map(i => i.value);
  const existing = cart.find(i => i.name === selectedItem.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...selectedItem, quantity: 1, customizations });
  }
  saveCart();
  renderMenu();
  renderCart();
  bootstrap.Modal.getInstance(document.getElementById("customModal")).hide();
  form.reset();
  toggleCartPanel(true);
});

// Cart toggle
document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  toggleCartPanel(true);
});
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// Initialize
renderMenu();
renderCart();
