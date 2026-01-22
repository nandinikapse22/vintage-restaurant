
const dessertItems = [
  { name: "Apple Pie", img: "/img/desserts/apple-pie.jpg", price: 210 },
  { name: "Chocolate Lava Cake", img: "/img/desserts/chocolate-lava-cake.jpg", price: 240 },
  { name: "Mango Mousse", img: "/img/desserts/mango-mousse.jpg", price: 220 },
  { name: "Caramel Custard", img: "/img/desserts/caramel-custard.jpg", price: 200 },
  { name: "Honey Glazed Tiramisu", img: "/img/desserts/honey-tiramisu.jpg", price: 270 },
  { name: "Slow-Cooked Lemon Tart", img: "/img/desserts/lemon-tart.jpg", price: 230 },
  { name: "Panna Cotta", img: "/img/desserts/panna-cotta.jpg", price: 250 },
  { name: "Gulab Jamun", img: "/img/desserts/gulab-jamun.jpg", price: 160 },
  { name: "Crème Brûlée", img: "/img/desserts/creme-brulee.jpg", price: 280 },
  { name: "Charred Kulfi", img: "/img/desserts/charred-kulfi.jpg", price: 190 },
  { name: "Smoky Berry Parfait", img: "/img/desserts/berry-parfait.jpg", price: 240 },
  { name: "Banana Fritter", img: "/img/desserts/banana-fritter.jpg", price: 180 },
  { name: "Cheesecake", img: "/img/desserts/cheesecake.jpg", price: 260 },
  { name: "Grilled Kheer", img: "/img/desserts/grilled-kheer.jpg", price: 170 },
  { name: "Chocolate Truffle", img: "/img/desserts/choco-truffle.jpg", price: 230 },
  { name: "Sticky Toffee Pudding", img: "/img/desserts/toffee-pudding.jpg", price: 250 },
  { name: "Rasmalai", img: "/img/desserts/rasmalai.jpg", price: 180 },
  { name: "Date & Walnut Roll", img: "/img/desserts/date-walnut-roll.jpg", price: 210 },
  { name: "Brownie Sundae", img: "/img/desserts/brownie-sundae.jpg", price: 260 },
  { name: "Cardamom Flan", img: "/img/desserts/cardamom-flan.jpg", price: 220 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

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

function toggleCartPanel(show = true) {
  const panel = document.getElementById("cartPanel");
  if (!panel) return;
  panel.classList.toggle("active", show);
}

function renderMenu() {
  const container = document.getElementById("dessertContainer");
  if (!container) return;

  container.innerHTML = dessertItems.map(item => {
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

function attachEvents() {
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const target = e.target.closest("button");
      const name = target.dataset.name;
      const price = parseInt(target.dataset.price);
      selectedItem = { name, price };
      new bootstrap.Modal(document.getElementById("customModal")).show();
    });
  });

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

document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(true); });
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

renderMenu();
renderCart();

