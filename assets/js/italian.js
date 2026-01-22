
const continentalItems = [
  { name: "Mushroom Risotto", img: "/dummy/img/italian/Mushroom-Risotto.jpg", price: 280 },
  { name: "Quiche Lorraine", img: "/dummy/img/italian/Quiche-Lorraine.jpg", price: 270 },
  { name: "Club Sandwich", img: "/dummy/img/italian/club-sandwich.jpg", price: 250 },
  { name: "Smoky Lamb Shank", img: "img/continental/smoky-lamb-shank.jpg", price: 350 },
  { name: "Mediterranean Grill", img: "img/continental/mediterranean-grill.jpg", price: 320 },
  { name: "Grilled Vegetable Platter", img: "img/continental/veg-platter.jpg", price: 260 },
  { name: "Butter-Roasted Margherita Pizza", img: "img/continental/margherita-pizza.jpg", price: 300 },
  { name: "Slow-Cooked Chicken Alfredo", img: "img/continental/chicken-alfredo.jpg", price: 310 },
  { name: "Caesar Wrap", img: "img/continental/caesar-wrap.jpg", price: 240 },
  { name: "Pasta Primavera", img: "img/continental/pasta-primavera.jpg", price: 270 },
  { name: "Butter-Roasted Pesto Penne", img: "img/continental/pesto-penne.jpg", price: 280 },
  { name: "Spaghetti Aglio Olio", img: "img/continental/spaghetti-aglio-olio.jpg", price: 290 },
  { name: "Herb Crusted Mushroom Risotto", img: "img/continental/herb-risotto.jpg", price: 290 },
  { name: "Honey Glazed Beef Stroganoff", img: "img/continental/beef-stroganoff.jpg", price: 350 },
  { name: "Charred Ratatouille", img: "img/continental/ratatouille.jpg", price: 260 },
  { name: "Herb Crusted Pan Seared Salmon", img: "img/continental/pan-salmon.jpg", price: 360 },
  { name: "Crispy Penne Arrabbiata", img: "img/continental/penne-arrabbiata.jpg", price: 270 },
  { name: "Grilled Chicken with Herbs", img: "img/continental/grilled-chicken.jpg", price: 310 },
  { name: "Smoky Garlic Butter Prawns", img: "img/continental/garlic-prawns.jpg", price: 340 },
  { name: "Butter-Roasted Herb Crusted Fish", img: "img/continental/herb-fish.jpg", price: 330 },
  { name: "Pan-Seared Roast Beef with Jus", img: "img/continental/roast-beef.jpg", price: 370 },
  { name: "Crispy Pan Seared Salmon", img: "img/continental/crispy-salmon.jpg", price: 355 },
  { name: "Chicken Alfredo", img: "img/continental/chicken-alfredo2.jpg", price: 300 },
  { name: "Beef Stroganoff", img: "img/continental/beef-stroganoff2.jpg", price: 360 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

// Save cart to localStorage
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
  const container = document.getElementById("continentalContainer");
  if (!container) return;

  container.innerHTML = continentalItems.map(item => {
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

// Attach buttons events
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

// Cart open/close
document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(true); });
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

// Initial render
renderMenu();
renderCart();

