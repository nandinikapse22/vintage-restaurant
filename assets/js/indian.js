const indianCuisineItems = [
  "Dal Makhani", "Charred Chole Bhature", "Goan Rogan Josh", "Chettinad Dal Makhani",
  "Sarson ka Saag", "Chettinad Rogan Josh", "Goan Paneer Butter Masala", "Smoky Kashmiri Dal Makhani",
  "Butter-Roasted Rogan Josh", "Awadhi Rogan Josh", "Goan Butter Chicken", "Honey Glazed Hyderabadi Biryani",
  "Creamy Chettinad Hyderabadi Biryani", "Paneer Butter Masala", "Smoky Hyderabadi Hyderabadi Biryani",
  "Bhindi Masala", "Methi Chicken", "Bengali Butter Chicken", "Creamy Kadhi Pakora", "Egg Curry"
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render menu
function renderMenu() {
  const container = document.getElementById("indianContainer");
  container.innerHTML = indianCuisineItems.map(item => {
    const price = Math.floor(Math.random() * 300 + 150);
    const existing = cart.find(i => i.name === item);
    return `
      <div class="col-sm-6 col-lg-4">
        <div class="product-card">
          <div class="product-img" style="background-image:url('https://via.placeholder.com/400x300?text=${encodeURIComponent(item)}')"></div>
          <div class="product-info text-center">
            <h6>${item}</h6>
            <p class="price">₹${price}</p>
            ${
              existing
                ? `<div class="qty-controls" data-name="${item}">
                     <button class="qty-btn minus btn btn-outline-light btn-sm">-</button>
                     <span class="mx-2">${existing.quantity}</span>
                     <button class="qty-btn plus btn btn-outline-light btn-sm">+</button>
                   </div>`
                : `<button class="btn btn-gold btn-sm add-cart mt-2" data-name="${item}" data-price="${price}">
                     <i class="bi bi-cart-plus"></i> Add to Cart
                   </button>`
            }
          </div>
        </div>
      </div>`;
  }).join("");
}

// Event delegation
document.getElementById("indianContainer").addEventListener("click", e => {
  // Add to cart button
  const addBtn = e.target.closest(".add-cart");
  if (addBtn) {
    const name = addBtn.dataset.name;
    const price = Number(addBtn.dataset.price);
    selectedItem = { name, price, customizations: [] };
    new bootstrap.Modal(document.getElementById("customModal")).show();
  }

  // Quantity buttons
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    const ctrl = qtyBtn.closest(".qty-controls");
    const name = ctrl.dataset.name;
    const item = cart.find(i => i.name === name);
    if (!item) return;
    if (qtyBtn.classList.contains("plus")) item.quantity++;
    if (qtyBtn.classList.contains("minus")) item.quantity--;
    if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
    saveCart();
    renderMenu();
    renderCart();
    toggleCartPanel(true);
  }
});

// Render cart
function renderCart() {
  const body = document.getElementById("cartPanelBody");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  body.innerHTML = cart.length
    ? cart.map(i => `
        <div class="cart-item mb-3 border-bottom pb-2">
          <h6 class="text-light mb-1">${i.name} <span class="text-warning">x${i.quantity}</span></h6>
          <small class="text-secondary d-block">${(i.customizations && i.customizations.length) ? i.customizations.join(", ") : "No customizations"}</small>
          <p class="mb-0 text-warning fw-bold">₹${i.price * i.quantity}</p>
        </div>`).join("")
    : "<p class='text-center text-muted'>Your cart is empty.</p>";
  document.getElementById("cartTotal").innerText = total;
}

// Cart panel toggle
function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  panel.style.right = show ? "0" : "-350px";
}

// Save customization
document.getElementById("saveCustom").addEventListener("click", () => {
  const form = document.getElementById("customForm");
  const customizations = Array.from(form.querySelectorAll("input:checked")).map(i => i.value);
  const existing = cart.find(i => i.name === selectedItem.name);
  if (existing) {
    existing.quantity++;
    existing.customizations = [...new Set([...(existing.customizations || []), ...customizations])];
  } else {
    cart.push({ ...selectedItem, quantity: 1, customizations });
  }
  saveCart();
  renderMenu();
  renderCart();
  bootstrap.Modal.getInstance(document.getElementById("customModal")).hide();
  toggleCartPanel(true);
  form.reset();
});

// Cart open/close
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));
document.getElementById("cartBtn")?.addEventListener("click", () => { renderCart(); toggleCartPanel(true); });

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();
});
