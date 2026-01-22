
const offers = [
  { title: "Weekend Brunch Special", desc: "Enjoy a 20% discount on all brunch items every Saturday and Sunday.", img: "img/offers/weekend-brunch-special.jpg", coupon: "BRUNCH20" },
  { title: "Happy Hour Drinks", desc: "Get 1+1 on selected cocktails and mocktails from 5 PM to 8 PM.", img: "img/offers/happy-hour-drinks.jpg", coupon: "HAPPYHOUR1" },
  { title: "Family Meal Combo", desc: "Order a family combo and get a dessert platter free.", img: "img/offers/family-meal-combo.jpg", coupon: "FAMILYFREE" },
  { title: "Festive Discounts", desc: "Celebrate the season with up to 30% off on selected dishes.", img: "img/offers/festive-discounts.jpg", coupon: "FESTIVE30" },
  { title: "Student Offer", desc: "Students get 15% off on showing their college ID.", img: "img/offers/student-offer.jpg", coupon: "STUDENT15" },
  { title: "Loyalty Card Bonus", desc: "Earn double points on all orders every Friday.", img: "img/offers/loyalty-card-bonus.jpg", coupon: "LOYALFRIDAY" }
];

// Generate offer cards
const offersContainer = document.getElementById('offersContainer');
offersContainer.innerHTML = offers.map(off => `
  <div class="col-md-6 col-lg-4">
    <div class="offer-card">
      <img src="${off.img}" alt="${off.title}">
      <div class="card-body">
        <h5>${off.title}</h5>
        <p>${off.desc}</p>
        <button class="btn btn-gold btn-sm" data-bs-toggle="modal" data-bs-target="#couponModal" onclick="showCoupon('${off.coupon}')">Grab Offer</button>
      </div>
    </div>
  </div>
`).join("");

// Show coupon in modal
function showCoupon(code){
  document.getElementById('couponCode').textContent = code;
  document.getElementById('copyMessage').style.display = 'none';
}

// Copy coupon code
function copyCoupon(){
  const code = document.getElementById('couponCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const msg = document.getElementById('copyMessage');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 1500);
  });
}
