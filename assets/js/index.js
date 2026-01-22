document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🧹 Sanitize any string prices (in case old data exists)
  cart = cart.map(i => ({
    ...i,
    price: parseFloat(String(i.price).replace(/[^\d.]/g, "")) || 0,
  }));

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Render Cart Panel
  function renderCart() {
    const body = document.getElementById("cartPanelBody");
const total = cart.reduce((t, i) => {
  const price = parseFloat(String(i.price).replace(/[^\d.]/g, "")) || 0;
  const qty = parseInt(i.quantity) || 0;
  return t + price * qty;
}, 0);


    if (cart.length === 0) {
      body.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
    } else {
      body.innerHTML = cart
        .map(
          i => `
        <div class="cart-item d-flex align-items-center gap-3">
          <img src="${i.img}" alt="${i.name}" 
               style="width:55px; height:55px; object-fit:cover; border-radius:6px;">
          <div class="flex-grow-1">
            <h6 class="mb-0">${i.name}</h6>
            <small>₹${i.price} x ${i.quantity}</small>
          </div>
          <p class="mb-0">₹${(i.price * i.quantity).toFixed(2)}</p>
        </div>
      `
        )
        .join("");
    }

    document.getElementById("cartTotal").innerText = total.toFixed(2);
  }

  // Toggle Cart Panel visibility
  function toggleCartPanel(show = true) {
    const panel = document.getElementById("cartPanel");
    panel.style.right = show ? "0" : "-350px";
  }

  // Initialize Add to Cart & Quantity Buttons
  function initCartFunctionality() {
    document.querySelectorAll(".product-card").forEach(card => {
      const name = card.querySelector("h6").innerText;
      const priceText = card.querySelector(".price").innerText;
      const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;
      const img = card.querySelector(".product-img").style.backgroundImage
        .replace('url("', '')
        .replace('")', '')
        .replace("url(", "")
        .replace(")", "");

      const qtyControls = card.querySelector(".qty-controls");
      const plusBtn = qtyControls.querySelector(".plus");
      const minusBtn = qtyControls.querySelector(".minus");
      const qtyCount = qtyControls.querySelector(".qty-count");

      // Update quantity display
      function updateQtyDisplay() {
        const item = cart.find(i => i.name === name);
        qtyCount.innerText = item ? item.quantity : 0;
      }

      // Plus Button
      plusBtn.addEventListener("click", () => {
        let item = cart.find(i => i.name === name);
        if (item) item.quantity++;
        else cart.push({ name, price, img, quantity: 1 });
        saveCart();
        renderCart();
        updateQtyDisplay();
        toggleCartPanel(true);
      });

      // Minus Button
      minusBtn.addEventListener("click", () => {
        let item = cart.find(i => i.name === name);
        if (item) {
          item.quantity--;
          if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
          saveCart();
          renderCart();
          updateQtyDisplay();
          toggleCartPanel(true);
        }
      });

      updateQtyDisplay();
    });
  }

  // Close Cart Panel
  document.getElementById("cartClose").addEventListener("click", () => toggleCartPanel(false));

  // Navbar Cart Button
  const navCartBtn = document.querySelector(".btn.btn-gold.btn-sm i.bi-cart3");
  if (navCartBtn) {
    navCartBtn.closest("button").addEventListener("click", (e) => {
      e.preventDefault();
      renderCart();
      toggleCartPanel(true);
    });
  }

  // Search Functionality
  const searchForm = document.querySelector('form.d-flex.me-3');
  const searchInput = searchForm.querySelector('input[type="search"]');

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const name = card.querySelector('h6').innerText.toLowerCase();
      if (name.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('input', performSearch);

  // Initialize
  initCartFunctionality();
  renderCart();
});
