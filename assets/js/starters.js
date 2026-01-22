
  // All starter items you provided (kept names intact). Prices assigned where known or set to reasonable defaults.
  const startersItems = [
    { name: "Herb Crusted Loaded Nachos", img: "/img/starters/herb-crusted-loaded-nachos.jpg", price: 250 },
    { name: "Butter-Roasted Garlic Mushroom", img: "/img/starters/butter-roasted-garlic-mushroom.jpg", price: 220 },
    { name: "Hara Bhara Kebab", img: "/img/starters/hara-bhara-kebab.jpg", price: 200 },
    { name: "Spicy Crispy Corn", img: "/img/starters/spicy-crispy-corn.jpg", price: 180 },
    { name: "Charred Paneer Tikka", img: "/img/starters/charred-paneer-tikka.jpg", price: 230 },
    { name: "Pan-Seared Loaded Nachos", img: "/img/starters/pan-seared-loaded-nachos.jpg", price: 250 },
    { name: "Herb Crusted Papdi Chaat", img: "/img/starters/herb-crusted-papdi-chaat.jpg", price: 190 },
    { name: "Chicken Lollipop", img: "/img/starters/chicken-lollipop.jpg", price: 260 },
    { name: "Crispy Calamari (25)", img: "/img/starters/crispy-calamari.jpg", price: 280 },
    { name: "Hara Bhara Kebab (23)", img: "/img/starters/hara-bhara-kebab-23.jpg", price: 200 },
    { name: "Herb Crusted Prawn Tempura", img: "/img/starters/herb-crusted-prawn-tempura.jpg", price: 300 },
    { name: "Smoky Mutton Seekh", img: "/img/starters/smoky-mutton-seekh.jpg", price: 320 },
    { name: "Chicken Lollipop (28)", img: "/img/starters/chicken-lollipop-28.jpg", price: 260 },
    { name: "Pan-Seared Bruschetta", img: "/img/starters/pan-seared-bruschetta.jpg", price: 210 },
    { name: "Creamy Chicken Tikka", img: "/img/starters/creamy-chicken-tikka.jpg", price: 240 },
    { name: "Chicken Tikka", img: "/img/starters/chicken-tikka.jpg", price: 240 },
    { name: "Honey Glazed Samosa Chaat", img: "/img/starters/honey-glazed-samosa-chaat.jpg", price: 180 },
    { name: "Fish Amritsari", img: "/img/starters/fish-amritsari.jpg", price: 310 },
    { name: "Vegetable Spring Rolls", img: "/img/starters/vegetable-spring-rolls.jpg", price: 190 },
    { name: "Crispy Calamari", img: "/img/starters/crispy-calamari-2.jpg", price: 280 },
    { name: "Papdi Chaat", img: "/img/starters/papdi-chaat.jpg", price: 170 },
    { name: "Herb Crusted Crispy Baby Corn", img: "/img/starters/herb-crusted-baby-corn.jpg", price: 200 },
    { name: "Herb Crusted Buffalo Wings", img: "/img/starters/herb-crusted-buffalo-wings.jpg", price: 280 },
    { name: "Mutton Seekh", img: "/img/starters/mutton-seekh.jpg", price: 320 },
    { name: "Buffalo Wings", img: "/img/starters/buffalo-wings.jpg", price: 280 },
    { name: "Tangy Crispy Baby Corn", img: "/img/starters/tangy-crispy-baby-corn.jpg", price: 200 },
    { name: "Spinach & Cheese Croquette (34)", img: "/img/starters/spinach-cheese-croquette.jpg", price: 230 },
    { name: "Crispy Corn", img: "/img/starters/crispy-corn-2.jpg", price: 180 },
    { name: "Smoky Classic French Fries", img: "/img/starters/smoky-classic-fries.jpg", price: 160 },
    { name: "Paneer Tikka", img: "/img/starters/paneer-tikka.jpg", price: 230 },
    { name: "Herb Crusted Garlic Mushroom", img: "/img/starters/herb-crusted-garlic-mushroom-2.jpg", price: 220 },
    { name: "Charred Samosa Chaat", img: "/img/starters/charred-samosa-chaat.jpg", price: 180 },
    { name: "Classic Fish Amritsari", img: "/img/starters/classic-fish-amritsari.jpg", price: 310 },
    { name: "Prawn Tempura", img: "/img/starters/prawn-tempura.jpg", price: 300 },
    { name: "Spinach & Cheese Croquette", img: "/img/starters/spinach-cheese-croquette-2.jpg", price: 230 },
    { name: "Coconut Prawns (31)", img: "/img/starters/coconut-prawns.jpg", price: 310 },
    { name: "Bruschetta", img: "/img/starters/bruschetta.jpg", price: 210 },
    { name: "Vegetable Spring Rolls (27)", img: "/img/starters/vegetable-spring-rolls-27.jpg", price: 190 },
    { name: "Coconut Prawns", img: "/img/starters/coconut-prawns-2.jpg", price: 310 },
    { name: "Classic French Fries", img: "/img/starters/classic-french-fries.jpg", price: 140 }
  ];

  // Keep cart consistent with breakfast implementation
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let selectedItem = null;

  function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

  function renderCart() {
    const body = document.getElementById("cartPanelBody");
    const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    body.innerHTML = cart.map(i => `
      <div class="cart-item">
        <h6>${i.name} x${i.quantity}</h6>
        <small>${(i.customizations && i.customizations.length) ? i.customizations.join(", ") : "No customizations"}</small>
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
    const container = document.getElementById("startersContainer");
    container.innerHTML = startersItems.map(item => {
      const existing = cart.find(i => i.name === item.name);
      const imgPath = item.img || '/img/starters/placeholder.jpg';
      if (existing) {
        return `
          <div class="col-sm-6 col-lg-4">
            <div class="product-card">
              <div class="product-img" style="background-image:url('${imgPath}')"></div>
              <div class="product-info text-center">
                <h6>${item.name}</h6>
                <p class="price">₹${item.price}</p>
                <div class="qty-controls" data-name="${item.name}">
                  <button class="qty-btn minus">-</button>
                  <span class="qty-count">${existing.quantity}</span>
                  <button class="qty-btn plus">+</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      return `
        <div class="col-sm-6 col-lg-4">
          <div class="product-card">
            <div class="product-img" style="background-image:url('${imgPath}')"></div>
            <div class="product-info text-center">
              <h6>${item.name}</h6>
              <p class="price">₹${item.price}</p>
              <button class="btn btn-gold btn-sm add-cart" data-name="${item.name}" data-price="${item.price}">
                <i class="bi bi-cart-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
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
        if (item) {
          item.quantity++;
          saveCart(); renderMenu(); renderCart(); toggleCartPanel(true);
        }
      });
      ctrl.querySelector(".minus").addEventListener("click", () => {
        const item = cart.find(i => i.name === name);
        if (item) {
          item.quantity--;
          if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
          saveCart(); renderMenu(); renderCart(); toggleCartPanel(true);
        }
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
    const modalEl = document.getElementById("customModal");
    bootstrap.Modal.getInstance(modalEl).hide();
    toggleCartPanel(true);
  });

  document.getElementById("cartBtn").addEventListener("click", () => { renderCart(); toggleCartPanel(); });
  document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

  // initial render
  renderMenu();
  renderCart();
