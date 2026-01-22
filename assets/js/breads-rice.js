
const breadRiceItems = [
  { name: "Herb Crusted Cheese Garlic Naan", img: "/img/breads/herb-cheese-naan.jpg", price: 140 },
  { name: "Veg Fried Rice", img: "/img/breads/veg-fried-rice.jpg", price: 160 },
  { name: "Smoky Mushroom Fried Rice", img: "/img/breads/mushroom-fried-rice.jpg", price: 180 },
  { name: "Honey Glazed Egg Fried Rice", img: "/img/breads/honey-egg-fried-rice.jpg", price: 190 },
  { name: "Lemon Rice", img: "/img/breads/lemon-rice.jpg", price: 150 },
  { name: "Steamed Rice", img: "/img/breads/steamed-rice.jpg", price: 130 },
  { name: "Keema Naan", img: "/img/breads/keema-naan.jpg", price: 200 },
  { name: "Rumali Roti", img: "/img/breads/rumali-roti.jpg", price: 80 },
  { name: "Lachha Paratha", img: "/img/breads/lachha-paratha.jpg", price: 120 },
  { name: "Butter Naan", img: "/img/breads/butter-naan.jpg", price: 100 },
  { name: "Herb Crusted Garlic Naan", img: "/img/breads/herb-garlic-naan.jpg", price: 130 },
  { name: "Coriander Rice", img: "/img/breads/coriander-rice.jpg", price: 160 },
  { name: "Parotta", img: "/img/breads/parotta.jpg", price: 120 },
  { name: "Tandoori Roti", img: "/img/breads/tandoori-roti.jpg", price: 90 },
  { name: "Stuffed Saffron Rice", img: "/img/breads/saffron-rice.jpg", price: 190 },
  { name: "Peas Pulao", img: "/img/breads/peas-pulao.jpg", price: 170 },
  { name: "Roomali Roti", img: "/img/breads/roomali-roti.jpg", price: 80 },
  { name: "Pan-Seared Plain Basmati Rice", img: "/img/breads/plain-basmati.jpg", price: 150 },
  { name: "Jeera Rice", img: "/img/breads/jeera-rice.jpg", price: 150 },
  { name: "Tomato Rice", img: "/img/breads/tomato-rice.jpg", price: 160 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// Save cart in localStorage
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

// Render cart panel
function renderCart() {
  const body = document.getElementById("cartPanelBody");
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = "<p class='text-center text-muted'>Your cart is empty.</p>";
    document.getElementById("cartTotal").innerText = 0;
    return;
  }

  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <h6>${i.name} × ${i.quantity}</h6>
      <small>${i.customizations?.join(", ") || "No customizations"}</small>
      <p class="mb-0 text-warning">₹${i.price * i.quantity}</p>
    </div>
  `).join("");
  document.getElementById("cartTotal").innerText = total;
}

// Toggle cart panel
function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  if (!panel) return;
  panel.classList.toggle("active", show);
}

// Render menu items
function renderMenu() {
  const container = document.getElementById("breadRiceContainer");
  if (!container) return;

  container.innerHTML = breadRiceItems.map(item => {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
      return `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="product-card text-center">
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
    } else {
      return `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="product-card text-center">
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
    }
  }).join("");

  attachEvents();
}

// Attach all button events
function attachEvents() {
  // Add to cart
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const target = e.target.closest("button");
      const name = target.dataset.name;
      const price = parseInt(target.dataset.price);
      selectedItem = { name, price };
      new bootstrap.Modal(document.getElementById("customModal")).show();
    });
  });

  // Quantity controls
  document.querySelectorAll(".qty-controls").forEach(ctrl => {
    const name = ctrl.dataset.name;
    ctrl.querySelector(".plus").addEventListener("click", () => {
      const item = cart.find(i => i.name === name);
      if (item) item.quantity++;
      saveCart(); renderMenu(); renderCart(); toggleCartPanel(true);
    });
    ctrl.querySelector(".minus").addEventListener("click", () => {
      const item = cart.find(i => i.name === name);
      if (!item) return;
      item.quantity--;
      if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
      saveCart(); renderMenu(); renderCart(); toggleCartPanel(true);
    });
  });
}

// Save customizations
document.getElementById("saveCustom").addEventListener("click", () => {
  const form = document.getElementById("customForm");
  const customizations = Array.from(form.querySelectorAll("input:checked")).map(i => i.value);

  const existing = cart.find(i => i.name === selectedItem.name);
  if (existing) existing.quantity += 1;
  else cart.push({ ...selectedItem, quantity: 1, customizations });

  saveCart(); renderMenu(); renderCart();
  bootstrap.Modal.getInstance(document.getElementById("customModal")).hide();
  toggleCartPanel(true);
});

// Cart buttons
document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(true); });
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// Initial render
renderMenu();
renderCart();

