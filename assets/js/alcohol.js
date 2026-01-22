const alcoholicItems = [
  { name: "Pan-Seared Domestic Beer (500ml)", img: "/img/alcohol/pan-seared-beer.jpg", price: 250 },
  { name: "Classic Blended Scotch (30ml)", img: "/img/alcohol/classic-scotch.jpg", price: 350 },
  { name: "Creamy Imported Beer (330ml)", img: "/img/alcohol/imported-beer.jpg", price: 300 },
  { name: "House White Wine (Glass)", img: "/img/alcohol/white-wine.jpg", price: 400 },
  { name: "Old Fashioned", img: "/img/alcohol/old-fashioned.jpg", price: 450 },
  { name: "Mojito (Alcoholic)", img: "/img/alcohol/mojito.jpg", price: 350 },
  { name: "House Red Wine (Glass)", img: "/img/alcohol/red-wine.jpg", price: 400 },
  { name: "Stuffed Whisky - Single Malt (30ml)", img: "/img/alcohol/single-malt.jpg", price: 500 },
  { name: "Gin & Tonic", img: "/img/alcohol/gin-tonic.jpg", price: 350 },
  { name: "Classic Margarita", img: "/img/alcohol/margarita.jpg", price: 450 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedItem = null;

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

function renderCart() {
  const body = document.getElementById("cartPanelBody");
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <h6>${i.name} x${i.quantity}</h6>
      <small>${i.customizations?.join(", ") || "No customizations"}</small>
      <p class="mb-0 text-warning">₹${i.price * i.quantity}</p>
    </div>
  `).join("") || "<p class='text-center'>Your cart is empty.</p>";
  document.getElementById("cartTotal").innerText = total;
}

function toggleCartPanel(show=true) {
  const panel = document.getElementById("cartPanel");
  if(show) panel.classList.add("active");
  else panel.classList.remove("active");
}

function renderMenu() {
  const container = document.getElementById("alcoholContainer");
  container.innerHTML = alcoholicItems.map(item => {
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
  attachEvents();
}

function attachEvents() {
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const name = e.target.closest("button").dataset.name;
      const price = parseInt(e.target.closest("button").dataset.price);
      selectedItem = { name, price };
      new bootstrap.Modal(document.getElementById("customModal")).show();
    });
  });

  document.querySelectorAll(".qty-controls").forEach(ctrl => {
    const name = ctrl.dataset.name;
    ctrl.querySelector(".plus").addEventListener("click", () => {
      const item = cart.find(i => i.name === name);
      item.quantity++;
      saveCart(); renderMenu(); renderCart(); toggleCartPanel(true);
    });
    ctrl.querySelector(".minus").addEventListener("click", () => {
      const item = cart.find(i => i.name === name);
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
  saveCart(); renderMenu(); renderCart(); bootstrap.Modal.getInstance(document.getElementById("customModal")).hide(); toggleCartPanel(true);
});

document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(); });
document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

renderMenu();