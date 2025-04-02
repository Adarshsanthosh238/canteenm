// Add to Cart Notification Function
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification type class (success, error, warning)
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg>' : 
                    type === 'error' ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>' :
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" fill="currentColor"/></svg>'
                }
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.classList.remove('show');">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
            </button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        addNotificationStyles();
    }
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide notification after delay (unless it's an error)
    if (type !== 'error') {
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Add notification styles
function addNotificationStyles() {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.innerHTML = `
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 300px;
            max-width: 80%;
            background-color: white;
            color: #333;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 1100;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden;
        }
        
        .notification.show {
            bottom: 30px;
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 15px 20px;
        }
        
        .notification-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 15px;
            flex-shrink: 0;
            color: white;
        }
        
        .notification-message {
            flex: 1;
            font-size: 16px;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }
        
        .notification-close:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: #666;
        }
        
        /* Success notification */
        .notification.success {
            border-left: 6px solid var(--primary-color, #2ecc71);
        }
        
        .notification.success .notification-icon {
            color: var(--primary-color, #2ecc71);
        }
        
        /* Error notification */
        .notification.error {
            border-left: 6px solid #e74c3c;
        }
        
        .notification.error .notification-icon {
            color: #e74c3c;
        }
        
        /* Warning notification */
        .notification.warning {
            border-left: 6px solid #f39c12;
        }
        
        .notification.warning .notification-icon {
            color: #f39c12;
        }
        
        /* Animation for item added to cart */
        @keyframes cartPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .cart-pulse {
            animation: cartPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
            .notification {
                min-width: 90%;
                max-width: 95%;
            }
            
            .notification-message {
                font-size: 14px;
            }
        }
    `;
    
    document.head.appendChild(notificationStyles);
}

// Function to animate cart icon when item is added
function animateCartIcon() {
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
        cartToggle.classList.add('cart-pulse');
        setTimeout(() => {
            cartToggle.classList.remove('cart-pulse');
        }, 500);
    }
}

// Modified addToCart function to include notification
function addToCartWithNotification(id, name, price) {
    // Call the original addToCart function
    addToCart(id, name, price);
    
    // Show notification
    showNotification(`Added ${name} to cart`, 'success');
    
    // Animate cart icon
    animateCartIcon();
}

// Update all add to cart buttons to use the new function
function updateAddToCartButtons() {
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
                button.setAttribute('onclick', `addToCartWithNotification('${id}', '${name}', ${price})`);
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add notification styles
    addNotificationStyles();
    
    // Update add to cart buttons
    updateAddToCartButtons();
});