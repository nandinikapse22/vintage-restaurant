function updateTotal() {
  let subtotal = 0;
  document.querySelectorAll(".cart-item").forEach((item) => {
    const price = parseInt(
      item.querySelector(".item-price").innerText.replace("₹", "")
    );
    const qty = parseInt(item.querySelector(".qty").value);
    subtotal += price * qty;
  });
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  document.getElementById("subtotal").innerText = `₹${subtotal}`;
  document.getElementById("tax").innerText = `₹${tax}`;
  document.getElementById("total").innerText = `₹${total}`;
}

function removeItem(btn) {
  btn.closest(".cart-item").remove();
  updateTotal();
}

function buyNow(item, price) {
  alert(`🛒 You are buying ${item} for ₹${price}. Proceeding to checkout...`);
}
window.onload = updateTotal;
