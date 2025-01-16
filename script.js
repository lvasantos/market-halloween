// GLOBAL VARIABLES
let currentSlide = 0;

let cart = [];

function moveSlide(n) {
    const slides = document.querySelectorAll(".carousel-slide img");
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    const offset = -currentSlide * 100;
    document.querySelector(".carousel-slide").style.transform = `translateX(${offset}%)`;
}

setInterval(() => moveSlide(1), 3000);

async function fetchProducts() {
    const response = await fetch('resources/products.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image">
                ${product.svg}
            </div>
            <div class="product-details">
                <p class="product-name">${product.name}</p>
                <p class="product-price">€ ${product.price}</p>
            </div>
            <button class="buy-btn" onclick="addToCart({ name: '${product.name}', price: ${product.price}, image: '${product.image}' })">
                Add to cart
            </button>
        `;

        productGrid.appendChild(productCard);
    });
}


document.addEventListener('DOMContentLoaded', fetchProducts);


function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert(`Thank you for your purchase! Total: €${document.getElementById("cart-total").innerText.split("€")[1]}`);
    cart = [];
    updateCart();
    toggleCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    cart.forEach(product => {
        const item = document.createElement("li");
        item.className = "cart-item";
        item.innerHTML = `
            <div class="cart-item-details">
                <p class="cart-item-name">${product.name}</p>
                <p class="cart-item-price">€${(product.price * product.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${product.name}')">
                <i class="ph-bold ph-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(item);
        total += product.price * product.quantity;
        itemCount += product.quantity;
    });

    document.getElementById("cart-total").innerText = `Total: €${total.toFixed(2)}`;

    cartCount.innerText = itemCount;
    cartCount.style.display = itemCount > 0 ? "block" : "none";
}

function toggleCart() {
    const cartElement = document.getElementById("cart");
    const isCartVisible = cartElement.style.display === "flex";

    if (isCartVisible) {
        cartElement.style.display = "none";
        document.removeEventListener("click", closeCartOnOutsideClick);
    } else {
        cartElement.style.display = "flex";
        setTimeout(() => {
            document.addEventListener("click", closeCartOnOutsideClick);
        }, 0);
    }
}

function closeCartOnOutsideClick(event) {
    const cartElement = document.getElementById("cart");
    const cartIcon = document.getElementById("cart-icon");

    if (!cartElement.contains(event.target) && !cartIcon.contains(event.target)) {
        // cartElement.style.display = "none";
        document.removeEventListener("click", closeCartOnOutsideClick);
    }
}