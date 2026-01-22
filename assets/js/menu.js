const categories = [
  {name:"Breakfast", link:"breakfast.html", img:"img/menu-images/breakfast-img.jpg"},
  {name:"Soups & Salads", link:"soups-and-salad.html", img:"img/menu-images/salad-and-soup.jpg"},
  {name:"Starters / Appetizers", link:"starters-and-appetizers.html", img:"img/menu-images/abcd.jpg"},
  {name:"Indian Cuisine", link:"indian-cusine.html", img:"img/menu-images/indian-platter.jpg"},
  {name:"Chinese Cuisine", link:"chinese-cuisine.html", img:"img/menu-images/chinese-platter.jpg"},
  {name:"Continental / Italian", link:"continental-italian.html", img:"img/menu-images/Continental-Italian.jpg"},
  {name:"Breads & Rice", link:"breads-rice.html", img:"img/menu-images/bread-rice.jpg"},
  {name:"Desserts", link:"desserts.html", img:"img/menu-images/desserts.jpg"},
  {name:"Mocktails & Shakes", link:"mocktails-shakes.html", img:"img/menu-images/mocktails.jpg"},
  {name:"Alcoholic Drinks", link:"alcoholic-drinks.html", img:"img/menu-images/alcohol.jpg"}
];

// Select the row container
const menuContainer = document.querySelector("#categories .row");

// Generate cards and inject
menuContainer.innerHTML = categories.map(cat => `
  <div class="col-sm-6 col-lg-4">
    <div class="menu-card card bg-dark text-light h-100">
      <img src="${cat.img}" class="card-img-top" alt="${cat.name}">
      <div class="card-body text-center">
        <h5 class="card-title text-warning">${cat.name}</h5>
        <a href="${cat.link}" class="btn btn-gold btn-sm mt-2">View Menu</a>
      </div>
    </div>
  </div>
`).join("");
