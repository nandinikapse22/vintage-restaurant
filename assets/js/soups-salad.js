
const soupsItems = [
  { name: "Waldorf Salad", img: "img/soups-salads/waldorf.jpg", price: 180 },
  { name: "Honey Glazed Manchow Soup", img: "img/soups-salads/manchow.jpg", price: 220 },
  { name: "Tandoori Lentil Soup", img: "img/soups-salads/lentil.jpg", price: 200 },
  { name: "Roasted Beetroot Salad", img: "img/soups-salads/beetroot.jpg", price: 190 },
  { name: "Greek Salad", img: "img/soups-salads/greek.jpg", price: 210 },
  { name: "Creamy Tomato Basil Soup", img: "img/soups-salads/tomato-basil.jpg", price: 160 },
  { name: "Garden Salad", img: "img/soups-salads/garden.jpg", price: 170 },
  { name: "Caesar Salad", img: "img/soups-salads/caesar.jpg", price: 200 },
  { name: "Hot & Sour Soup", img: "img/soups-salads/hot-sour.jpg", price: 180 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// Save cart in localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart sidebar
function renderCart() {
  const body = document.getElementById("cartPanelBody");
  if (!body) return;

  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  body.innerHTML = cart.length
    ? cart.map(i => `
        <div class="cart-item border-bottom pb-2 mb-2">
          <h6 class="mb-1">${i.name} x${i.quantity}</h6>
          <small>${i.customizations && i.customizations.length ? i.customizations.join(", ") : "No customizations"}</small>
          <p class="mb-0 text-warning fw-bold">₹${i.price * i.quantity}</p>
        </div>
      `).join("")
    : "<p class='text-center mt-3'>Your cart is empty.</p>";

  document.getElementById("cartTotal").innerText = total;
}

// Toggle cart visibility
function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  if (panel) {
    if (show) panel.classList.add("active");
    else panel.classList.remove("active");
  }
}

// Render menu items
function renderMenu() {
  const container = document.getElementById("soupsContainer");
  if (!container) return;

  container.innerHTML = soupsItems.map(item => {
    const inCart = cart.find(i => i.name === item.name);
    return `
      <div class="col-sm-6 col-lg-4">
        <div class="product-card">
          <div class="product-img" style="background-image:url('${item.img}')"></div>
          <div class="product-info">
            <h6>${item.name}</h6>
            <p class="price">₹${item.price}</p>
            ${
              inCart
                ? `<div class="qty-controls" data-name="${item.name}">
                     <button class="qty-btn minus">-</button>
                     <span class="qty-count">${inCart.quantity}</span>
                     <button class="qty-btn plus">+</button>
                   </div>`
                : `<button class="btn btn-gold btn-sm add-cart" data-name="${item.name}" data-price="${item.price}">
                     <i class="bi bi-cart-plus"></i> Add
                   </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachEvents();
}

// Attach all event listeners
function attachEvents() {
  // Add to cart buttons
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      selectedItem = { name, price };
      const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("customModal"));
      modal.show();
    });
  });

  // Quantity controls
  document.querySelectorAll(".qty-controls").forEach(ctrl => {
    const name = ctrl.dataset.name;
    ctrl.querySelector(".plus").addEventListener("click", () => updateQuantity(name, 1));
    ctrl.querySelector(".minus").addEventListener("click", () => updateQuantity(name, -1));
  });
}

// Update item quantity
function updateQuantity(name, change) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  saveCart();
  renderMenu();
  renderCart();
  toggleCartPanel(true);
}

// Save customization and add item to cart
document.getElementById("saveCustom").addEventListener("click", () => {
  const form = document.getElementById("customForm");
  const customizations = Array.from(form.querySelectorAll("input:checked")).map(i => i.value);

  const existing = cart.find(i => i.name === selectedItem.name);
  if (existing) existing.quantity += 1;
  else cart.push({ ...selectedItem, quantity: 1, customizations });

  saveCart();
  renderMenu();
  renderCart();
  bootstrap.Modal.getInstance(document.getElementById("customModal")).hide();
  form.reset();
  toggleCartPanel(true);
});

// Cart panel toggle
document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  toggleCartPanel(true);
});
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// Initialize page
renderMenu();
renderCart();
