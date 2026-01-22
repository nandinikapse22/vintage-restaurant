const mocktailItems = [
  { name: "Virgin Mojito", img: "/img/mocktails/virgin-mojito.jpg", price: 180 },
  { name: "Pineapple Gingerale", img: "/img/mocktails/pineapple-gingerale.jpg", price: 190 },
  { name: "Mango Lassi", img: "/img/mocktails/mango-lassi.jpg", price: 160 },
  { name: "Tandoori Berry Blast", img: "/img/mocktails/tandoori-berry-blast.jpg", price: 200 },
  { name: "Ginger Lemon Cooler", img: "/img/mocktails/ginger-lemon-cooler.jpg", price: 170 },
  { name: "Charred Lemon Mint Spritz", img: "/img/mocktails/charred-lemon-mint-spritz.jpg", price: 210 },
  { name: "Herb Crusted Apple Fizz", img: "/img/mocktails/apple-fizz.jpg", price: 220 },
  { name: "Butter-Roasted Sunrise Punch", img: "/img/mocktails/sunrise-punch.jpg", price: 230 },
  { name: "Classic Virgin Pina Colada", img: "/img/mocktails/pina-colada.jpg", price: 200 },
  { name: "Cucumber Cooler", img: "/img/mocktails/cucumber-cooler.jpg", price: 180 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// Save & Render
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const body = document.getElementById("cartPanelBody");
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  body.innerHTML = cart.length
    ? cart.map(i => `
      <div class="cart-item d-flex align-items-center mb-3 border-bottom pb-2">
        <img src="${i.img}" alt="${i.name}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; margin-right:10px;">
        <div class="flex-grow-1">
          <h6 class="mb-0">${i.name}</h6>
          <small class="text-muted">${i.customizations?.join(", ") || "No customizations"}</small>
          <div class="d-flex align-items-center mt-1">
            <button class="btn btn-sm btn-outline-secondary me-1 minus" data-name="${i.name}">-</button>
            <span>${i.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary ms-1 plus" data-name="${i.name}">+</button>
            <span class="ms-auto text-warning fw-bold">₹${i.price * i.quantity}</span>
          </div>
        </div>
      </div>
    `).join("")
    : `<p class='text-center mt-3'>Your cart is empty.</p>`;

  document.getElementById("cartTotal").innerText = total;
}

function renderMenu() {
  const container = document.getElementById("mocktailContainer");
  container.innerHTML = mocktailItems.map(item => {
    const existing = cart.find(i => i.name === item.name);
    return `
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="product-card border rounded-3 shadow-sm p-2">
          <div class="product-img rounded" style="background-image:url('${item.img}'); background-size:cover; background-position:center; height:200px;"></div>
          <div class="product-info text-center mt-2">
            <h6>${item.name}</h6>
            <p class="price text-warning fw-semibold mb-1">₹${item.price}</p>
            ${
              existing
                ? `
                  <div class="qty-controls d-flex justify-content-center align-items-center" data-name="${item.name}">
                    <button class="qty-btn minus">-</button>
                    <span class="qty-count mx-2">${existing.quantity}</span>
                    <button class="qty-btn plus">+</button>
                  </div>
                `
                : `
                  <button class="btn btn-gold btn-sm add-cart mt-1" 
                    data-name="${item.name}" 
                    data-price="${item.price}" 
                    data-img="${item.img}">
                    <i class="bi bi-cart-plus"></i> Add
                  </button>
                `
            }
          </div>
        </div>
      </div>`;
  }).join("");
}

// Quantity update
function updateQuantity(name, change) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
  saveCart();
  renderMenu();
  renderCart();
}

// EVENT DELEGATION
document.addEventListener("click", e => {
  // Add to cart
  if (e.target.closest(".add-cart")) {
    const btn = e.target.closest(".add-cart");
    selectedItem = {
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      img: btn.dataset.img
    };
    new bootstrap.Modal(document.getElementById("customModal")).show();
  }

  // Plus / Minus in menu
  if (e.target.classList.contains("plus")) {
    updateQuantity(e.target.closest("[data-name]").dataset.name, 1);
  }
  if (e.target.classList.contains("minus")) {
    updateQuantity(e.target.closest("[data-name]").dataset.name, -1);
  }

  // Plus / Minus in cart
  if (e.target.closest(".cart-item .plus")) {
    updateQuantity(e.target.dataset.name, 1);
  }
  if (e.target.closest(".cart-item .minus")) {
    updateQuantity(e.target.dataset.name, -1);
  }
});

// Save customizations
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
  toggleCartPanel(true);
});

document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  toggleCartPanel(true);
});
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// Slide Cart
function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  panel.classList.toggle("active", show);
}

// Initial load
renderMenu();
renderCart();
