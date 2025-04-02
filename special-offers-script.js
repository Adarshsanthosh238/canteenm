// Special Offers Management Script

/**
 * Handles the special offers section functionality
 * - Combo Meal Deal: 10% off lunch items with beverage
 * - Happy Hours: 15% discount on snack items from 3PM-5PM
 */

// Track if offers are active
let specialOffersActive = {
    comboMeal: true,
    happyHours: false
};

// Initialize time-based offers on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSpecialOffers();
    setupOfferEventListeners();
});

/**
 * Initialize special offers based on time of day
 */
function initializeSpecialOffers() {
    // Check if current time is during Happy Hours (3PM-5PM)
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    if (currentHour >= 15 && currentHour < 17) { // 3PM-5PM in 24-hour format
        specialOffersActive.happyHours = true;
        applyHappyHoursDiscount();
    }
    
    // Update offer displays
    updateOfferDisplays();
}

/**
 * Setup event listeners for the offer buttons
 */
function setupOfferEventListeners() {
    // Get all "View Deal" buttons
    const dealButtons = document.querySelectorAll('.view-deal-btn');
    
    // Add click event listener to each button
    dealButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Determine which deal was clicked based on its parent container
            const dealType = getDealTypeFromButton(this);
            
            if (dealType === 'combo') {
                applyComboMealDiscount();
            } else if (dealType === 'happy-hours') {
                applyHappyHoursDiscount();
            }
            
            // Show confirmation message
            showDealActivatedMessage(dealType);
        });
    });
}

/**
 * Determine deal type from button context
 * @param {HTMLElement} button - The clicked button element
 * @return {string} - 'combo' or 'happy-hours'
 */
function getDealTypeFromButton(button) {
    const parentText = button.closest('.specials-item').querySelector('h3').textContent.toLowerCase();
    
    if (parentText.includes('combo')) {
        return 'combo';
    } else if (parentText.includes('happy hours')) {
        return 'happy-hours';
    }
    
    return 'unknown';
}

/**
 * Apply the Combo Meal discount (10% off lunch + beverage)
 */
function applyComboMealDiscount() {
    specialOffersActive.comboMeal = true;
    
    // Find all lunch items
    const lunchItems = document.querySelectorAll('.menu-item[data-category="lunch"]');
    const beverageItems = document.querySelectorAll('.menu-item[data-category="beverages"]');
    
    // Apply visual indicator to eligible items
    lunchItems.forEach(item => {
        applyDiscountIndicator(item, '10% Off in Combo');
    });
    
    beverageItems.forEach(item => {
        applyDiscountIndicator(item, '10% Off in Combo');
    });
    
    // Update offer display
    updateOfferDisplays();
}

/**
 * Apply the Happy Hours discount (15% off snacks)
 */
function applyHappyHoursDiscount() {
    specialOffersActive.happyHours = true;
    
    // Find all snack items
    const snackItems = document.querySelectorAll('.menu-item[data-category="snacks"]');
    
    // Apply visual indicator to eligible items
    snackItems.forEach(item => {
        applyDiscountIndicator(item, '15% Off - Happy Hour!');
        
        // Also update price display to show discounted price
        updatePriceWithDiscount(item, 15);
    });
    
    // Update offer display
    updateOfferDisplays();
}

/**
 * Apply visual discount indicator to menu item
 * @param {HTMLElement} item - The menu item element
 * @param {string} message - Discount message to display
 */
function applyDiscountIndicator(item, message) {
    // Remove any existing discount indicator
    const existingIndicator = item.querySelector('.discount-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create discount indicator
    const indicator = document.createElement('div');
    indicator.className = 'discount-indicator';
    indicator.textContent = message;
    indicator.style.position = 'absolute';
    indicator.style.top = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = '#FF4757';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '20px';
    indicator.style.fontSize = '12px';
    indicator.style.fontWeight = 'bold';
    indicator.style.zIndex = '10';
    
    // Add to item
    item.style.position = 'relative';
    item.appendChild(indicator);
}

/**
 * Update price display to show discounted price
 * @param {HTMLElement} item - The menu item element
 * @param {number} discountPercentage - Discount percentage to apply
 */
function updatePriceWithDiscount(item, discountPercentage) {
    const priceElement = item.querySelector('.menu-price');
    if (!priceElement) return;
    
    // Get the original price
    const originalPrice = parseFloat(priceElement.textContent.replace('₹', ''));
    if (isNaN(originalPrice)) return;
    
    // Calculate discounted price
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    
    // Update the display
    priceElement.innerHTML = `<span style="text-decoration: line-through; color: #777; margin-right: 5px;">₹${originalPrice.toFixed(2)}</span> ₹${discountedPrice.toFixed(2)}`;
}

/**
 * Show notification that a deal has been activated
 * @param {string} dealType - Type of deal activated
 */
function showDealActivatedMessage(dealType) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'deal-notification';
    
    // Set notification styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'all 0.3s ease';
    
    // Set notification message based on deal type
    if (dealType === 'combo') {
        notification.textContent = 'Combo Meal Deal activated! 10% off when you order a lunch item with a beverage.';
    } else if (dealType === 'happy-hours') {
        notification.textContent = 'Happy Hours discount activated! 15% off all snack items.';
    } else {
        notification.textContent = 'Special offer activated!';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Update the visual display of special offer cards
 * based on their active status
 */
function updateOfferDisplays() {
    const comboOffer = document.querySelector('.specials-item:nth-child(1)');
    const happyHoursOffer = document.querySelector('.specials-item:nth-child(2)');
    
    if (comboOffer) {
        if (specialOffersActive.comboMeal) {
            comboOffer.style.background = 'rgba(46, 204, 113, 0.2)';
            comboOffer.querySelector('.view-deal-btn').textContent = 'Active';
            comboOffer.querySelector('.view-deal-btn').style.backgroundColor = '#2ecc71';
            comboOffer.querySelector('.view-deal-btn').style.color = 'white';
        } else {
            comboOffer.style.background = 'transparent';
            comboOffer.querySelector('.view-deal-btn').textContent = 'View Deal';
            comboOffer.querySelector('.view-deal-btn').style.backgroundColor = 'white';
            comboOffer.querySelector('.view-deal-btn').style.color = '#7fff6b';
        }
    }
    
    if (happyHoursOffer) {
        if (specialOffersActive.happyHours) {
            happyHoursOffer.style.background = 'rgba(46, 204, 113, 0.2)';
            happyHoursOffer.querySelector('.view-deal-btn').textContent = 'Active';
            happyHoursOffer.querySelector('.view-deal-btn').style.backgroundColor = '#2ecc71';
            happyHoursOffer.querySelector('.view-deal-btn').style.color = 'white';
        } else {
            happyHoursOffer.style.background = 'transparent';
            happyHoursOffer.querySelector('.view-deal-btn').textContent = 'View Deal';
            happyHoursOffer.querySelector('.view-deal-btn').style.backgroundColor = 'white';
            happyHoursOffer.querySelector('.view-deal-btn').style.color = '#7fff6b';
        }
    }
}

/**
 * Calculate combined discount when applicable
 * @param {Object} item - Menu item object
 * @return {number} - Final price after all applicable discounts
 */
function calculateFinalPrice(item) {
    let price = parseFloat(item.dataset.price);
    if (isNaN(price)) return price;
    
    let discount = 0;
    
    // Apply combo meal discount
    if (specialOffersActive.comboMeal && 
        (item.dataset.category === 'lunch' || item.dataset.category === 'beverages')) {
        discount += 10;
    }
    
    // Apply happy hours discount
    if (specialOffersActive.happyHours && item.dataset.category === 'snacks') {
        discount += 15;
    }
    
    // Calculate final price
    return price * (1 - discount / 100);
}

// Add this function to the cart script to apply discounts during checkout
/**
 * Add item to cart with appropriate discounts applied
 * @param {string} id - Item ID
 * @param {string} name - Item name
 * @param {number} price - Original item price
 */
// In special-offers-script.js

// Replace or add this version of addToCartWithDiscount
function addToCartWithDiscount(id, name, price) {
    // Find the menu item to check for discounts
    const menuItem = document.querySelector(`.menu-item[data-id="${id}"]`);
    let finalPrice = price;
    let category = "";
    
    // If we can't find by data-id, try to determine category from name
    if (!menuItem) {
        if (id.startsWith('b') && !id.startsWith('bv')) {
            category = "breakfast";
        } else if (id.startsWith('l')) {
            category = "lunch";
        } else if (id.startsWith('s')) {
            category = "snacks";
        } else if (id.startsWith('bv')) {
            category = "beverages";
        }
    } else {
        category = menuItem.dataset.category;
    }
    
    // Apply combo meal discount (10%)
    if (specialOffersActive.comboMeal && 
        (category === 'lunch' || category === 'beverages')) {
        finalPrice = price * 0.9; // 10% off
    }
    
    // Apply happy hours discount (15%)
    if (specialOffersActive.happyHours && category === 'snacks') {
        finalPrice = price * 0.85; // 15% off
    }
    
    // Call the original addToCart function with the discounted price
    addToCart(id, name, finalPrice);
    
    // Show notification
  
}

// Update the updateCartButtons function to ensure it correctly attaches to all menu items
function updateCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        const onClick = button.getAttribute('onclick');
        if (onClick && onClick.includes('addToCart')) {
            // Extract parameters from the original onclick
            const match = onClick.match(/addToCart\('([^']+)',\s*'([^']+)',\s*([0-9.]+)\)/);
            
            if (match && match.length === 4) {
                const id = match[1];
                const name = match[2];
                const price = parseFloat(match[3]);
                
                // Replace with the new function
                button.setAttribute('onclick', `addToCartWithDiscount('${id}', '${name}', ${price})`);
                
                // Add data-id attribute to help with category identification
                const menuItem = button.closest('.menu-item');
                if (menuItem) {
                    menuItem.setAttribute('data-id', id);
                }
            }
        }
    });
}


// Run this function after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSpecialOffers();
    setupOfferEventListeners();
    updateCartButtons();
});