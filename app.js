const STRIPE_LINK = "https://buy.stripe.com/test_dRm9ASdp2eVjgeH8GpbMQ00";

function getCart(){
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();
  renderCart();
}

function addToCart(name, price){
  let cart = getCart();
  const item = cart.find(i => i.name === name);

  if(item){ item.qty++; }
  else { cart.push({name, price, qty:1}); }

  saveCart(cart);
}

function removeFromCart(name){
  let cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
}

function updateQuantity(name, qty){
  let cart = getCart();
  cart.find(i => i.name === name).qty = qty;
  saveCart(cart);
}

function calculateTotal(){
  return getCart().reduce((t,i)=>t+i.price*i.qty,0).toFixed(2);
}

function updateCount(){
  const count = getCart().reduce((t,i)=>t+i.qty,0);
  const el = document.getElementById("cart-count");
  if(el) el.textContent = count;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
  renderCart();
}

function buyNow(){
  window.location.href = STRIPE_LINK;
}

function renderCart(){
  const cartDiv = document.getElementById("cart");
  if(!cartDiv) return;

  let cart = getCart();

  cartDiv.innerHTML = "<h2>Cart</h2>";

  cart.forEach(item=>{
    cartDiv.innerHTML += `
      <div>
        ${item.name} x
        <input type="number" value="${item.qty}" min="1"
        onchange="updateQuantity('${item.name}',this.value)">
        <button onclick="removeFromCart('${item.name}')">Remove</button>
      </div>
    `;
  });

  cartDiv.innerHTML += `<hr>Total: $${calculateTotal()}</hr>`;
  cartDiv.innerHTML += `<button onclick="buyNow()">Checkout</button>`;
}

updateCount();
 
