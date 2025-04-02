document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close-btn');
    const orderNumberDisplay = document.getElementById('orderNumberDisplay');
    const modalBtn = document.querySelector('.modal-btn');
    
    // Generate a random order number
    function generateOrderNumber() {
        return Math.floor(10000 + Math.random() * 90000);
    }
    
    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const deliveryTime = document.getElementById('deliveryTime').value;
        const itemCount = document.getElementById('itemCount').value;
        
        if (!name || !mobile || !deliveryTime || !itemCount) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Basic mobile number validation
        if (!/^\d{10,}$/.test(mobile.replace(/[^0-9]/g, ''))) {
            alert('Please enter a valid mobile number.');
            return;
        }
        
        // Display order confirmation
        const orderNumber = generateOrderNumber();
        orderNumberDisplay.textContent = orderNumber;
        modal.style.display = 'block';
        
        // Reset form
        orderForm.reset();
    });
    
    // Close modal when clicking the × button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Track order button (for demonstration purposes)
    modalBtn.addEventListener('click', function() {
        // In a real application, this would redirect to an order tracking page
        modal.style.display = 'none';
        alert('Redirecting to order tracking page...');
        // window.location.href = 'tracking.html?order=' + orderNumberDisplay.textContent;
    });
});