 
     const menuItems = [
    { name: "Corn Flakes with Milk", price: 120, img: "/vintage-restaurant/img/desserts/grilled-kheer", category: "Breakfast" },
    { name: "Smoky Paneer Paratha", price: 320, img: "https://source.unsplash.com/400x300/?paneer-paratha", category: "Breakfast" },
    { name: "Breakfast Burrito", price: 260, img: "https://source.unsplash.com/400x300/?burrito", category: "Breakfast" },
    { name: "Huevos Rancheros", price: 220, img: "https://source.unsplash.com/400x300/?huevos-rancheros", category: "Breakfast" },
    { name: "Greek Salad", price: 180, img: "https://source.unsplash.com/400x300/?greek-salad", category: "Salad" },
    { name: "Chickpea Salad", price: 150, img: "https://source.unsplash.com/400x300/?chickpea-salad", category: "Salad" },
    { name: "Creamy Tomato Basil Soup", price: 450, img: "https://source.unsplash.com/400x300/?tomato-soup", category: "Soup" },
    { name: "Herb Crusted Prawn Tempura", price: 160, img: "https://source.unsplash.com/400x300/?prawn-tempura", category: "Seafood" },
    { name: "Smoky Mutton Seekh", price: 200, img: "https://source.unsplash.com/400x300/?mutton-seekh", category: "Starters" },
    { name: "Creamy Chicken Tikka", price: 220, img: "https://source.unsplash.com/400x300/?chicken-tikka", category: "Starters" },
    { name: "Goan Butter Chicken", price: 320, img: "https://source.unsplash.com/400x300/?butter-chicken", category: "Indian" },
    { name: "Honey Glazed Hyderabadi Biryani", price: 260, img: "https://source.unsplash.com/400x300/?biryani", category: "Indian" },
    { name: "Paneer Butter Masala", price: 180, img: "https://source.unsplash.com/400x300/?paneer-butter-masala", category: "Indian" },
    { name: "Smoky Korean Style Wings", price: 150, img: "https://source.unsplash.com/400x300/?korean-wings", category: "Starters" },
    { name: "Spicy Sweet & Sour Chicken", price: 450, img: "https://source.unsplash.com/400x300/?sweet-sour-chicken", category: "Chinese" },
    { name: "Quiche Lorraine", price: 160, img: "https://source.unsplash.com/400x300/?quiche-lorraine", category: "Continental" },
    { name: "Club Sandwich", price: 200, img: "https://source.unsplash.com/400x300/?club-sandwich", category: "Continental" },
    { name: "Pan-Seared Plain Basmati Rice", price: 120, img: "https://source.unsplash.com/400x300/?basmati-rice", category: "Rice" },
    { name: "Jeera Rice", price: 320, img: "https://source.unsplash.com/400x300/?jeera-rice", category: "Rice" },
    { name: "Apple Pie", price: 260, img: "https://source.unsplash.com/400x300/?apple-pie", category: "Desserts" },
    { name: "Chocolate Lava Cake", price: 220, img: "https://source.unsplash.com/400x300/?chocolate-lava-cake", category: "Desserts" },
    { name: "Herb Crusted Apple Fizz", price: 180, img: "https://source.unsplash.com/400x300/?apple-fizz", category: "Mocktails" },
    { name: "Butter-Roasted Sunrise Punch", price: 150, img: "https://source.unsplash.com/400x300/?sunrise-punch", category: "Mocktails" },
    { name: "Pan-Seared Domestic Beer (500ml)", price: 450, img: "https://source.unsplash.com/400x300/?beer", category: "Alcoholic" },
    { name: "Classic Blended Scotch (30ml)", price: 160, img: "https://source.unsplash.com/400x300/?scotch", category: "Alcoholic" }
  ];

    const menuContainer = document.getElementById("menuContainer");
    const cartPanel = document.getElementById("cartPanel");
    const cartPanelBody = document.getElementById("cartPanelBody");
    const cartTotal = document.getElementById("cartTotal");
    let cart = [];

    // Render menu
    menuItems.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="menu-card-body text-center">
          <h5>${item.name}</h5>
          <p class="text-secondary mb-1">${item.category}</p>
          <p class="fw-bold">₹${item.price}</p>
          <button class="btn-gold" id="addBtn-${index}">Add to Cart</button>
          <div class="quantity-control d-none" id="qty-${index}">
            <button class="dec">-</button>
            <span class="qty-value">1</span>
            <button class="inc">+</button>
          </div>
        </div>
      `;
      menuContainer.appendChild(card);

      const addBtn = card.querySelector(`#addBtn-${index}`);
      const qtyControl = card.querySelector(`#qty-${index}`);

      addBtn.addEventListener("click", () => {
        addBtn.classList.add("d-none");
        qtyControl.classList.remove("d-none");
        openCartPanel();
        addToCart(item, 1);
      });

      qtyControl.addEventListener("click", (e) => {
        if (e.target.classList.contains("inc")) {
          const qty = parseInt(qtyControl.querySelector(".qty-value").textContent) + 1;
          qtyControl.querySelector(".qty-value").textContent = qty;
          updateCart(item.name, qty);
        } else if (e.target.classList.contains("dec")) {
          let qty = parseInt(qtyControl.querySelector(".qty-value").textContent);
          if (qty > 1) {
            qty--;
            qtyControl.querySelector(".qty-value").textContent = qty;
            updateCart(item.name, qty);
          }
        }
      });
    });

    function addToCart(item, qty) {
      const existing = cart.find(i => i.name === item.name);
      if (existing) existing.qty += qty;
      else cart.push({ ...item, qty });
      renderCart();
    }

    function updateCart(name, qty) {
      const item = cart.find(i => i.name === name);
      if (item) item.qty = qty;
      renderCart();
    }

    function renderCart() {
      cartPanelBody.innerHTML = "";
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>${item.name}</strong>
              <p class="text-secondary small mb-0">${item.qty} × ₹${item.price}</p>
            </div>
            <span class="text-warning fw-bold">₹${item.price * item.qty}</span>
          </div>
        `;
        cartPanelBody.appendChild(div);
      });
      cartTotal.textContent = total;
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    function openCartPanel() {
      cartPanel.classList.add("open");
    }

    document.getElementById("cartClose").addEventListener("click", () => {
      cartPanel.classList.remove("open");
    });
  
