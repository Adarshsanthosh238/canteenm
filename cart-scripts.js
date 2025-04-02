// Shopping cart functionality
let cart = [];
let cartTotal = 0;

function addToCart(id, name, price, discount = 0) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    // Calculate discounted price if discount is provided
    const finalPrice = discount > 0 ? price * (1 - discount/100) : price;
    
    if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        cart[existingItemIndex].quantity += 1;
        // Update to ensure discounted price is always applied
        cart[existingItemIndex].originalPrice = price;
        cart[existingItemIndex].discount = discount;
        cart[existingItemIndex].price = finalPrice;
    } else {
        // Item doesn't exist, add new item
        cart.push({
            id: id,
            name: name, 
            originalPrice: price,
            price: finalPrice,
            discount: discount,
            quantity: 1
        });
    }
    
    // Update cart total
    updateCartTotal();
    
    // Update cart UI
    updateCartUI();
    
    // Save cart to localStorage
    saveCart();
    
    // Show confirmation message
    showNotification(`Added ${name} to cart${discount > 0 ? ` with ${discount}% discount` : ''}`);
}

function placeOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    // Save cart to localStorage before redirecting
    saveCart();
    
    // Redirect to ordering page
    window.location.href = "order.html";
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateCartUI() {
    // Check if cart UI exists, create if not
    let cartContainer = document.getElementById('cart-container');
    
    if (!cartContainer) {
        createCartUI();
        cartContainer = document.getElementById('cart-container');
    }
    
    // Get cart items container
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    // Add each item to cart UI
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Display discount information if present
        const discountInfo = item.discount > 0 ? 
            `<div class="discount-tag">-${item.discount}%</div>` : '';
        
        // Display original price if discounted
        const priceDisplay = item.discount > 0 ? 
            `<span class="item-price"><span class="original-price">₹${(item.originalPrice * item.quantity).toFixed(2)}</span> ₹${(item.price * item.quantity).toFixed(2)}</span>` : 
            `<span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>`;
        
        cartItem.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                ${discountInfo}
            </div>
            <div class="item-controls">
                <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
            </div>
            ${priceDisplay}
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">×</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update cart total display
    document.getElementById('cart-total').textContent = `₹${cartTotal.toFixed(2)}`;
    
    // Update cart count badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-badge').textContent = totalItems;
    
    // Show/hide empty cart message
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        document.getElementById('checkout-btn').disabled = false;
    }
}

function createCartUI() {
    // Create cart container
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-container';
    cartContainer.className = 'cart-container';
    
    // Create cart content with improved UI
    cartContainer.innerHTML = `
        <div class="cart-header">
            <h3>Your Cart <span id="cart-count" class="cart-count">0</span></h3>
            <button id="close-cart" onclick="toggleCart()">×</button>
        </div>
        <div id="cart-items" class="cart-items"></div>
        <div id="empty-cart-message" class="empty-cart-message">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
            </svg>
            <p>Your cart is empty</p>
            <small>Add items from the menu to get started</small>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cart-total">₹0.00</span>
            </div>
            <button id="checkout-btn" class="checkout-btn" onclick="placeOrder()">Place Order</button>
            <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
        </div>
    `;
    
    // Create cart toggle button if it doesn't exist
    if (!document.getElementById('cart-toggle')) {
        const cartToggle = document.createElement('button');
        cartToggle.id = 'cart-toggle';
        cartToggle.className = 'cart-toggle';
        cartToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span id="cart-badge" class="cart-badge">0</span>
        `;
        cartToggle.onclick = toggleCart;
        
        // Add to header
        const header = document.querySelector('.header-container');
        if (header) {
            header.appendChild(cartToggle);
        } else {
            document.body.insertBefore(cartToggle, document.body.firstChild);
        }
    }
    
    // Add cart container to body
    document.body.appendChild(cartContainer);
    
    // Add cart styles if not already added
    if (!document.getElementById('cart-styles')) {
        addCartStyles();
    }
}

function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.classList.toggle('active');
}

function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCartTotal();
        updateCartUI();
        saveCart();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartTotal();
        updateCartUI();
        saveCart();
    } else if (item && item.quantity === 1) {
        removeFromCart(id);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartTotal();
    updateCartUI();
    saveCart();
    showNotification('Item removed from cart');
}

function clearCart() {
    cart = [];
    updateCartTotal();
    updateCartUI();
    saveCart();
    showNotification('Cart cleared');
}

function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function addCartStyles() {
    const cartStyles = document.createElement('style');
    cartStyles.id = 'cart-styles';
    cartStyles.innerHTML = `
        /* Improved Cart Styles */
        .cart-toggle {
            position: relative;
            background: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .cart-toggle:hover {
            background: var(--secondary-color, #45a049);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .cart-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #ff6b6b;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .cart-container {
            position: fixed;
            top: 0;
            right: -400px;
            width: 350px;
            height: 100vh;
            background-color: white;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            transition: right 0.3s ease;
            border-radius: 0;
        }
        
        .cart-container.active {
            right: 0;
        }
        
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background-color: #f9f9f9;
        }
        
        .cart-header h3 {
            margin: 0;
            color: var(--text-dark, #333);
            font-weight: 600;
        }
        
        .cart-count {
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
        }
        
        #close-cart {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-dark, #333);
            transition: all 0.2s;
        }
        
        #close-cart:hover {
            color: #ff6b6b;
        }
        
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }
        
        .empty-cart-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            color: var(--text-light, #888);
            height: 100%;
        }
        
        .empty-cart-message svg {
            margin-bottom: 15px;
            color: #ddd;
        }
        
        .empty-cart-message p {
            font-size: 18px;
            margin: 5px 0;
        }
        
        .empty-cart-message small {
            color: #aaa;
        }
        
        .cart-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 5px;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .cart-item:hover {
            background-color: #f9f9f9;
        }
        
        .item-details {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            color: var(--text-dark, #333);
            margin-bottom: 4px;
        }
        
        .discount-tag {
            display: inline-block;
            background-color: #ff6b6b;
            color: white;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 2px;
            font-weight: bold;
        }
        
        .item-controls {
            display: flex;
            align-items: center;
            margin: 0 15px;
        }
        
        .quantity-btn {
            width: 28px;
            height: 28px;
            background-color: #f0f0f0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quantity-btn:hover {
            background-color: #e0e0e0;
        }
        
        .item-quantity {
            margin: 0 10px;
            min-width: 20px;
            text-align: center;
            font-weight: 500;
        }
        
        .item-price {
            font-weight: 500;
            color: var(--primary-color, #4CAF50);
            margin-right: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 12px;
            margin-bottom: 2px;
        }
        
        .remove-btn {
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .remove-btn:hover {
            background-color: #ffeeee;
            color: #ff6b6b;
        }
        
        .cart-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            background-color: #f9f9f9;
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 15px;
            color: var(--text-dark, #333);
            font-size: 18px;
        }
        
        .checkout-btn {
            width: 100%;
            padding: 14px;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
        }
        
        .checkout-btn:hover {
            background-color: var(--secondary-color, #45a049);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
        }
        
        .checkout-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }
        
        .clear-cart-btn {
            width: 100%;
            padding: 12px;
            background-color: transparent;
            color: #999;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .clear-cart-btn:hover {
            color: #ff6b6b;
            border-color: #ffcccc;
            background-color: #fff5f5;
        }
        
        .cart-notification {
            position: fixed;
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--text-dark, #333);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            transition: bottom 0.3s ease;
            font-weight: 500;
        }
        
        .cart-notification.show {
            bottom: 30px;
        }
        
        .menu-item-actions {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 15px;
        }
        
        .add-to-cart-btn {
            padding: 10px 15px;
            background-color: white;
            color: var(--primary-color, #4CAF50);
            border: 1px solid var(--primary-color, #4CAF50);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .add-to-cart-btn:hover {
            background-color: rgba(76, 175, 80, 0.1);
            transform: translateY(-2px);
        }
        
        .order-btn {
            padding: 10px 15px;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .order-btn:hover {
            background-color: var(--secondary-color, #45a049);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
        }
        
        .discount-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #ff6b6b;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 480px) {
            .cart-container {
                width: 100%;
                right: -100%;
            }
            
            .cart-toggle {
                width: 45px;
                height: 45px;
            }
            
            .menu-item-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(cartStyles);
}

// Save cart to localStorage - improved to ensure all cart data is saved properly
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', cartTotal);
    
    // Also save cart items in the format expected by order.html
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    const savedTotal = localStorage.getItem('cartTotal');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedTotal) {
        cartTotal = parseFloat(savedTotal);
    }
}

// Function to update menu item footers to include discount badges and both buttons
function updateMenuItemButtons() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const footer = item.querySelector('.menu-item-footer');
        if (!footer) return;
        
        // Check if the buttons have already been updated
        if (footer.querySelector('.menu-item-actions')) return;
        
        const priceElement = footer.querySelector('.menu-price');
        const orderButton = footer.querySelector('.order-btn');
        
        if (!priceElement || !orderButton) return;
        
        // Get item details from the order button's onclick attribute
        const onclickAttr = orderButton.getAttribute('onclick');
        if (!onclickAttr) return;
        
        // Extract parameters from placeOrder function call
        const match = onclickAttr.match(/placeOrder\('([^']+)',\s*'([^']+)',\s*([\d.]+)\)/);
        if (!match) return;
        
        const [_, id, name, price] = match;
        
        // Randomly add a discount to some items (for demonstration)
        const hasDiscount = Math.random() > 0.7; // 30% chance for discount
        const discountPercentage = hasDiscount ? Math.round([10, 15, 20, 25][Math.floor(Math.random() * 4)]) : 0;
        
        // If item has discount, add a discount badge
        if (hasDiscount) {
            const discountBadge = document.createElement('div');
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `-${discountPercentage}%`;
            item.style.position = 'relative';
            item.appendChild(discountBadge);
            
            // Also update the price display to show original and discounted price
            const originalPrice = parseFloat(price);
            const discountedPrice = originalPrice * (1 - discountPercentage/100);
            
            priceElement.innerHTML = `
                <span style="text-decoration: line-through; color: #999; font-size: 14px;">₹${originalPrice.toFixed(2)}</span>
                <span style="color: #4CAF50; font-weight: 600;">₹${discountedPrice.toFixed(2)}</span>
            `;
        }
        
        // Create the actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'menu-item-actions';
        
        // Create add to cart button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
        `;
        addToCartBtn.onclick = function() {
            // Pass the discount percentage if available
            addToCart(id, name, parseFloat(price), discountPercentage);
        };
        
        // Remove the old onclick from the order button to prevent direct navigation
        orderButton.removeAttribute('onclick');
        orderButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Order Now
        `;
        orderButton.onclick = function() {
            // For direct order, also pass discount information
            const finalPrice = discountPercentage > 0 ? parseFloat(price) * (1 - discountPercentage/100) : parseFloat(price);
            
            // Save a single item to localStorage for the order page
            const singleItem = [{
                id: id,
                name: name,
                price: finalPrice,
                originalPrice: parseFloat(price),
                discount: discountPercentage, 
                quantity: 1
            }];
            localStorage.setItem('cartItems', JSON.stringify(singleItem));
            
            window.location.href = `order.html`;
        };
        
        // Add buttons to actions div
        actionsDiv.appendChild(addToCartBtn);
        actionsDiv.appendChild(orderButton);
        
        // Clear the footer and rebuild it
        footer.innerHTML = '';
        footer.appendChild(priceElement);
        footer.appendChild(actionsDiv);
    });
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved cart
    loadCart();
    
    // Create cart UI
    createCartUI();
    
    // Update cart UI
    updateCartUI();
    
    // Update menu item buttons
    updateMenuItemButtons();
    
    // Save cart when page is unloaded
    window.addEventListener('beforeunload', saveCart);
});