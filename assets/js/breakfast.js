// ===== GLOBAL CART =====
window.cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// ===== ITEMS =====
const indianCuisineItems = [
  "Dal Makhani", "Charred Chole Bhature", "Goan Rogan Josh", "Chettinad Dal Makhani",
  "Sarson ka Saag", "Chettinad Rogan Josh", "Goan Paneer Butter Masala"
];

const breakfastItems = [
  { name: "Corn Flakes with Milk", img: "img/breakfast/cornflakes.jpg", price: 120 },
  { name: "Smoky Paneer Paratha", img: "img/breakfast/smokey-paneer-paratha.jpg", price: 180 },
  { name: "Plain Dosa", img: "img/breakfast/plain-dosa.jpg", price: 150 }
];

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CART =====
function renderCart() {
  const body = document.getElementById("cartPanelBody");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  body.innerHTML = cart.length
    ? cart.map(i => `
      <div class="cart-item mb-2 border-bottom pb-1">
        <h6>${i.name} <span class="text-warning">x${i.quantity}</span></h6>
        <small>${i.customizations.length ? i.customizations.join(", ") : "No customizations"}</small>
        <p class="mb-0 text-warning fw-bold">₹${i.price * i.quantity}</p>
      </div>
    `).join('')
    : "<p class='text-center text-muted'>Your cart is empty.</p>";
  document.getElementById("cartTotal").innerText = total;
}

// ===== CART PANEL TOGGLE =====
function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  panel.style.right = show ? "0" : "-350px";
}

// ===== RENDER MENU =====
function renderMenu(containerId, items, isObject = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => {
    const name = isObject ? item.name : item;
    const price = isObject ? item.price : Math.floor(Math.random() * 300 + 150);
    const img = isObject ? item.img : `https://via.placeholder.com/400x300?text=${encodeURIComponent(name)}`;
    const existing = cart.find(i => i.name === name);

    return `
    <div class="col-sm-6 col-lg-4 mb-3">
      <div class="card h-100">
        <img src="${img}" class="card-img-top" alt="${name}">
        <div class="card-body text-center">
          <h6>${name}</h6>
          <p class="price mb-2">₹${price}</p>
          ${
            existing
              ? `<div class="d-flex justify-content-center align-items-center gap-2 qty-controls" data-name="${name}">
                   <button class="btn btn-sm btn-secondary qty-btn minus">-</button>
                   <span class="qty-count">${existing.quantity}</span>
                   <button class="btn btn-sm btn-secondary qty-btn plus">+</button>
                 </div>`
              : `<button class="btn btn-gold btn-sm add-cart" data-name="${name}" data-price="${price}">
                   <i class="bi bi-cart-plus"></i> Add
                 </button>`
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

// ===== EVENT DELEGATION =====
function setupCategory(containerId) {
  document.getElementById(containerId).addEventListener("click", e => {
    const addBtn = e.target.closest(".add-cart");
    const qtyBtn = e.target.closest(".qty-btn");

    if (addBtn) {
      const name = addBtn.dataset.name;
      const price = parseInt(addBtn.dataset.price);
      selectedItem = { name, price, customizations: [] };
      new bootstrap.Modal(document.getElementById("customModal")).show();
    }

    if (qtyBtn) {
      const name = qtyBtn.closest(".qty-controls").dataset.name;
      const item = cart.find(i => i.name === name);
      if (!item) return;

      if (qtyBtn.classList.contains("plus")) item.quantity++;
      if (qtyBtn.classList.contains("minus")) {
        item.quantity--;
        if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
      }
      saveCart();
      renderAllMenus();
      renderCart();
      toggleCartPanel(true);
    }
  });
}

// ===== SAVE CUSTOMIZATION =====
document.getElementById("saveCustom").addEventListener("click", () => {
  const form = document.getElementById("customForm");
  const customizations = Array.from(form.querySelectorAll("input:checked")).map(i => i.value);
  const existing = cart.find(i => i.name === selectedItem.name);

  if (existing) {
    existing.quantity++;
    existing.customizations = [...new Set([...existing.customizations, ...customizations])];
  } else {
    cart.push({ ...selectedItem, quantity: 1, customizations });
  }
  saveCart();
  renderAllMenus();
  renderCart();
  bootstrap.Modal.getInstance(document.getElementById("customModal")).hide();
  toggleCartPanel(true);
  form.reset();
});

// ===== CART BUTTONS =====
document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(true); });
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// ===== RENDER ALL MENUS =====
function renderAllMenus() {
  renderMenu("indianContainer", indianCuisineItems);
  renderMenu("breakfastContainer", breakfastItems, true);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderAllMenus();
  setupCategory("indianContainer");
  setupCategory("breakfastContainer");
  renderCart();
});
