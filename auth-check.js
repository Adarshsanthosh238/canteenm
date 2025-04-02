// Enhanced user authentication check and UI management
document.addEventListener('DOMContentLoaded', function() {
    // Authentication management
    handleUserAuthentication();
    
    // Feature animations (moved to a separate function for clarity)
    animateFeatureBoxes();
    
    // Slider functionality (moved to a separate function for clarity)
    initializeSlider();
});

// Handle user authentication state and UI
function handleUserAuthentication() {
    try {
        const loggedInUserData = localStorage.getItem('loggedInUser');
        const navContainer = document.querySelector('.nav-menu');
        const loginMenuItem = document.querySelector('.nav-menu li a[href="login.html"]');
        
        // If no navigation menu exists, exit early
        if (!navContainer) return;
        
        if (loggedInUserData && loginMenuItem) {
            // Parse user info with error handling
            try {
                const user = JSON.parse(loggedInUserData);
                updateNavForLoggedInUser(user, loginMenuItem);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                // Clear corrupted data
                localStorage.removeItem('loggedInUser');
                return;
            }
        } else if (!loginMenuItem && !loggedInUserData) {
            // If login menu item doesn't exist but should (user not logged in)
            // This handles the case where the login menu item might have been removed
            addLoginButton(navContainer);
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
    }
}

// Update navigation for logged in user
function updateNavForLoggedInUser(user, loginMenuItem) {
    // Update the nav menu
    loginMenuItem.textContent = user.name;
    loginMenuItem.href = "#";
    
    // Create a dropdown for user menu
    const userDropdown = createUserDropdown();
    
    // Add dropdown to the login menu item's parent (li element)
    const menuParent = loginMenuItem.parentNode;
    menuParent.style.position = 'relative';
    menuParent.appendChild(userDropdown);
    
    // Toggle dropdown on click
    loginMenuItem.addEventListener('click', function(e) {
        e.preventDefault();
        userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!loginMenuItem.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });
    
    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
}

// Create user dropdown menu
function createUserDropdown() {
    const userDropdown = document.createElement('div');
    userDropdown.className = 'user-dropdown';
    userDropdown.innerHTML = `
        <ul>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="profile.html">My Profile</a></li>
            <li><a href="orders.html">My Orders</a></li>
            <li><a href="#" id="logout-btn">Logout</a></li>
        </ul>
    `;
    userDropdown.style.display = 'none';
    userDropdown.style.position = 'absolute';
    userDropdown.style.backgroundColor = 'white';
    userDropdown.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    userDropdown.style.zIndex = '1000';
    userDropdown.style.minWidth = '150px';
    userDropdown.style.borderRadius = '8px';
    userDropdown.style.overflow = 'hidden';
    userDropdown.style.top = '100%';
    userDropdown.style.right = '0';
    
    // Add CSS for dropdown
    addDropdownStyles();
    
    return userDropdown;
}

// Add login button to navigation
function addLoginButton(navContainer) {
    const loginLi = document.createElement('li');
    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.textContent = 'Login';
    loginLi.appendChild(loginLink);
    navContainer.appendChild(loginLi);
}

// Add dropdown styles
function addDropdownStyles() {
    // Only add styles if they don't already exist
    if (!document.getElementById('user-dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'user-dropdown-styles';
        style.textContent = `
            .user-dropdown ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .user-dropdown ul li {
                margin: 0;
            }
            .user-dropdown ul li a {
                color: #333;
                padding: 10px 15px;
                display: block;
                text-decoration: none;
                transition: background-color 0.3s;
            }
            .user-dropdown ul li a:hover {
                background-color: #f5f5f5;
                color: #4CAF50;
            }
        `;
        document.head.appendChild(style);
    }
}

// Animate feature boxes
function animateFeatureBoxes() {
    const featureBoxes = document.querySelectorAll('.feature-box');
    if (featureBoxes.length > 0) {
        featureBoxes.forEach((box, index) => {
            // Add a slight delay for each box for a cascading effect
            box.style.opacity = '0';
            box.style.transform = 'translateY(20px)';
            box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }
}

// Initialize slider functionality
function initializeSlider() {
    const sliderDots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slides = document.querySelectorAll('.slide');
    
    if (sliderDots.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;
        const totalSlides = sliderDots.length;
        
        // Update the active dot and slide
        function updateSlider() {
            // Update dots
            sliderDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Update slides if they exist
            if (slides.length > 0) {
                slides.forEach((slide, index) => {
                    slide.style.display = index === currentSlide ? 'block' : 'none';
                });
            }
        }
        
        // Initialize the slider
        updateSlider();
        
        // Previous slide
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        // Next slide
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
        
        // Click on a specific dot
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateSlider();
            });
        });
        
        // Auto-advance slides every 5 seconds
        const slideshowInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
        
        // Pause slideshow on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideshowInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                setInterval(() => {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    updateSlider();
                }, 5000);
            });
        }
    }
}