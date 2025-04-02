// Menu inventory management script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize inventory for each menu item
    const menuInventory = {
        'b1': { name: 'Breakfast Sandwich', price: 5.99, quantity: 20 },
        'b2': { name: 'Veggie Omelette', price: 4.50, quantity: 15 },
        'l1': { name: 'Chicken Biryani', price: 8.99, quantity: 25 },
        'l2': { name: 'Veg Thali', price: 7.50, quantity: 18 },
        'l3': { name: 'Paneer Butter Masala', price: 9.25, quantity: 12 },
        's1': { name: 'Samosa Plate', price: 3.99, quantity: 30 },
        's2': { name: 'Vada Pav', price: 4.25, quantity: 22 },
        'bv1': { name: 'Masala Chai', price: 2.50, quantity: 40 },
        'bv2': { name: 'Mango Lassi', price: 3.75, quantity: 35 }
    };
    
    // Save inventory to local storage for persistence
    if (!localStorage.getItem('menuInventory')) {
        localStorage.setItem('menuInventory', JSON.stringify(menuInventory));
    } else {
        // Load inventory from local storage
        const savedInventory = JSON.parse(localStorage.getItem('menuInventory'));
        Object.keys(savedInventory).forEach(key => {
            menuInventory[key] = savedInventory[key];
        });
    }
    
    // Display inventory count for each menu item
    updateInventoryDisplay();
    
    // Add event listeners to all "Order" buttons
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        // Extract the original onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr.match(/placeOrder\('([^']+)',\s*'([^']+)',\s*([0-9.]+)\)/);
        
        if (match) {
            const itemId = match[1];
            const itemName = match[2];
            const itemPrice = parseFloat(match[3]);
            
            // Remove the original onclick attribute
            button.removeAttribute('onclick');
            
            // Add new event listener
            button.addEventListener('click', function() {
                orderWithInventory(itemId, itemName, itemPrice);
            });
        }
    });
    
    // Function to update inventory display for all items
    function updateInventoryDisplay() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemFooter = item.querySelector('.menu-item-footer');
            const orderButton = item.querySelector('.order-btn');
            
            if (!orderButton) return;
            
            // Extract the item ID from the button's onclick attribute
            const onclickAttr = orderButton.getAttribute('onclick') || '';
            const match = onclickAttr.match(/placeOrder\('([^']+)'/);
            
            if (match) {
                const itemId = match[1];
                
                // Check if inventory exists for this item
                if (menuInventory[itemId]) {
                    // Remove existing inventory display if it exists
                    const existingInventory = item.querySelector('.inventory-count');
                    if (existingInventory) {
                        existingInventory.remove();
                    }
                    
                    // Create inventory display element
                    const inventoryEl = document.createElement('span');
                    inventoryEl.className = 'inventory-count';
                    inventoryEl.textContent = `Available: ${menuInventory[itemId].quantity}`;
                    inventoryEl.style.color = '#777';
                    inventoryEl.style.fontSize = '14px';
                    inventoryEl.style.marginTop = '5px';
                    inventoryEl.style.display = 'block';
                    
                    // Insert before the footer
                    itemFooter.parentNode.insertBefore(inventoryEl, itemFooter);
                    
                    // Disable button if out of stock
                    if (menuInventory[itemId].quantity <= 0) {
                        orderButton.disabled = true;
                        orderButton.textContent = 'Out of Stock';
                        orderButton.style.backgroundColor = '#ccc';
                    } else {
                        orderButton.disabled = false;
                        orderButton.textContent = 'Order';
                        orderButton.style.backgroundColor = '';
                    }
                }
            }
        });
    }
    
    // Function to order item and redirect to booking page
    function orderWithInventory(itemId, itemName, itemPrice) {
        // Check if item is in stock
        if (menuInventory[itemId] && menuInventory[itemId].quantity > 0) {
            // Decrease inventory
            menuInventory[itemId].quantity--;
            
            // Update local storage
            localStorage.setItem('menuInventory', JSON.stringify(menuInventory));
            
            // Save selected item to localStorage for booking page
            const selectedItem = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            };
            
            localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
            
            // Show confirmation message
            showNotification(`${itemName} selected! Redirecting to order page...`);
            
            // Redirect to booking page immediately
            window.location.href = 'booking.html';
        } else {
            showNotification('Sorry, this item is out of stock!', 'error');
        }
    }
    
    // Create a notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else {
            notification.style.backgroundColor = '#f44336';
        }
        
        notification.style.color = 'white';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Add a reset inventory button (for demonstration purposes)
    
    resetButton.addEventListener('click', function() {
        // Reset inventory to initial values
        Object.keys(menuInventory).forEach(key => {
            menuInventory[key].quantity = Math.floor(Math.random() * 30) + 10; // Random stock between 10-40
        });
        
        // Update local storage
        localStorage.setItem('menuInventory', JSON.stringify(menuInventory));
        
        // Update display
        updateInventoryDisplay();
        
        showNotification('Inventory has been restocked!');
    });
    
    // Check if menu-categories exists, otherwise look for an appropriate container
    const menuCategoriesEl = document.querySelector('.menu-categories');
    if (menuCategoriesEl) {
        menuCategoriesEl.appendChild(resetButton);
    } else {
        // As a fallback, append to menu-banner if menu-filters doesn't exist
        const menuBannerEl = document.querySelector('.menu-banner');
        if (menuBannerEl) {
            menuBannerEl.appendChild(resetButton);
        }
    }
});

// Define the placeOrder function that will be available globally
// This replaces the original function and redirects to our orderWithInventory
function placeOrder(itemId, itemName, itemPrice) {
    // Get the menuInventory from localStorage
    const menuInventory = JSON.parse(localStorage.getItem('menuInventory')) || {};
    
    // Check if item is in stock
    if (menuInventory[itemId] && menuInventory[itemId].quantity > 0) {
        // Decrease inventory
        menuInventory[itemId].quantity--;
        
        // Update local storage
        localStorage.setItem('menuInventory', JSON.stringify(menuInventory));
        
        // Save selected item to localStorage for booking page
        const selectedItem = {
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1
        };
        
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
        
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = `${itemName} selected! Redirecting to order page...`;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Redirect to booking page immediately
        window.location.href = 'booking.html';
    } else {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = 'Sorry, this item is out of stock!';
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Also update the button to show Out of Stock
        const orderButtons = document.querySelectorAll(`.order-btn[onclick*="'${itemId}'"]`);
        orderButtons.forEach(button => {
            button.disabled = true;
            button.textContent = 'Out of Stock';
            button.style.backgroundColor = '#ccc';
        });
    }
}