
// fungsi inspirasi books and Novel
let cart = [];
let total = 0;

function addToCart(itemName, price) {
  cart.push({ name: itemName, price: price });
  total += price;
  updateCart();
}

function updateCart() {
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';
  
  cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - $${item.price}`;
    cartItemsElement.appendChild(listItem);
  });
  
  document.getElementById('total').textContent = `Total: $${total}`;
}


// untuk sumbit ke halaman berikutnya
document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault(); // Mencegah formulir dikirim secara default
  window.location.href = "sukses.html"; // Memindahkan ke halaman berikutnya
});