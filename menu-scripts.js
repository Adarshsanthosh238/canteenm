<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Canteen - Menu</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="menu-styles.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="header-container">
            <!-- Logo Section -->
            <div class="logo">
                <h1>Online Canteen</h1>
            </div>

            <!-- Navigation Menu -->
            <nav>
                <ul class="nav-menu">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="menu.html" class="active">Menu</a></li>
                    <li><a href="offers.html">Offers</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </nav>
            
            <!-- User Menu -->
            <div class="user-menu">
                <a href="cart.html" class="cart-icon">
                    <span class="material-icons">🛒</span>
                    <span class="cart-count" id="cartCount">0</span>
                </a>
                <div class="user-dropdown">
                    <span class="username" id="currentUser">Guest</span>
                    <div class="dropdown-content">
                        <a href="profile.html">My Profile</a>
                        <a href="orders.html">My Orders</a>
                        <a href="#" id="logoutBtn">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <div class="menu-banner">
            <h1>Our Menu</h1>
            <p>Explore our delicious offerings prepared with fresh ingredients</p>
        </div>

        <!-- Menu Category Navigation -->
        <div class="menu-categories">
            <button class="category-btn active" data-category="all">All Items</button>
            <button class="category-btn" data-category="breakfast">Breakfast</button>
            <button class="category-btn" data-category="lunch">Lunch</button>
            <button class="category-btn" data-category="snacks">Snacks</button>
            <button class="category-btn" data-category="beverages">Beverages</button>
        </div>

        <!-- Search and Sort Options -->
        <div class="menu-filters">
            <div class="search-container">
                <input type="text" id="searchMenu" placeholder="Search menu items...">
                <button id="searchBtn">🔍</button>
            </div>
            <div class="sort-container">
                <label for="sortMenu">Sort by:</label>
                <select id="sortMenu">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                </select>
            </div>
        </div>

        <!-- Menu Items Grid -->
        <div class="menu-grid" id="menuItemsContainer">
            <!-- Breakfast Items -->
            <div class="menu-item" data-category="breakfast" data-price="5.99">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Breakfast Sandwich">
                </div>
                <div class="menu-details">
                    <h3>Breakfast Sandwich</h3>
                    <p class="menu-description">Freshly baked bread with eggs, cheese, and your choice of meat</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹5.99</span>
                        <button class="add-to-cart-btn" onclick="addToCart('b1', 'Breakfast Sandwich', 5.99)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <div class="menu-item" data-category="breakfast" data-price="4.50">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Veggie Omelette">
                </div>
                <div class="menu-details">
                    <h3>Veggie Omelette</h3>
                    <p class="menu-description">Fluffy omelette with bell peppers, onions, tomatoes, and cheese</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹4.50</span>
                        <button class="add-to-cart-btn" onclick="addToCart('b2', 'Veggie Omelette', 4.50)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <!-- Lunch Items -->
            <div class="menu-item" data-category="lunch" data-price="8.99">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Chicken Biryani">
                </div>
                <div class="menu-details">
                    <h3>Chicken Biryani</h3>
                    <p class="menu-description">Aromatic basmati rice cooked with tender chicken pieces and spices</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹8.99</span>
                        <button class="add-to-cart-btn" onclick="addToCart('l1', 'Chicken Biryani', 8.99)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <div class="menu-item" data-category="lunch" data-price="7.50">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Veg Thali">
                </div>
                <div class="menu-details">
                    <h3>Veg Thali</h3>
                    <p class="menu-description">Complete meal with rice, roti, dal, sabzi, raita, and dessert</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹7.50</span>
                        <button class="add-to-cart-btn" onclick="addToCart('l2', 'Veg Thali', 7.50)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <div class="menu-item" data-category="lunch" data-price="9.25">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Paneer Butter Masala">
                </div>
                <div class="menu-details">
                    <h3>Paneer Butter Masala</h3>
                    <p class="menu-description">Cottage cheese cubes in rich tomato gravy with naan</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹9.25</span>
                        <button class="add-to-cart-btn" onclick="addToCart('l3', 'Paneer Butter Masala', 9.25)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <!-- Snack Items -->
            <div class="menu-item" data-category="snacks" data-price="3.99">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Samosa Plate">
                </div>
                <div class="menu-details">
                    <h3>Samosa Plate</h3>
                    <p class="menu-description">Two crispy pastries filled with spiced potatoes and peas, served with chutney</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹3.99</span>
                        <button class="add-to-cart-btn" onclick="addToCart('s1', 'Samosa Plate', 3.99)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <div class="menu-item" data-category="snacks" data-price="4.25">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Vada Pav">
                </div>
                <div class="menu-details">
                    <h3>Vada Pav</h3>
                    <p class="menu-description">Spicy potato fritter served in a bun with chutneys</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹4.25</span>
                        <button class="add-to-cart-btn" onclick="addToCart('s2', 'Vada Pav', 4.25)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <!-- Beverage Items -->
            <div class="menu-item" data-category="beverages" data-price="2.50">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Masala Chai">
                </div>
                <div class="menu-details">
                    <h3>Masala Chai</h3>
                    <p class="menu-description">Traditional Indian spiced tea with milk</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹2.50</span>
                        <button class="add-to-cart-btn" onclick="addToCart('bv1', 'Masala Chai', 2.50)">Add to Cart</button>
                    </div>
                </div>
            </div>

            <div class="menu-item" data-category="beverages" data-price="3.75">
                <div class="menu-image">
                    <img src="/api/placeholder/300/200" alt="Mango Lassi">
                </div>
                <div class="menu-details">
                    <h3>Mango Lassi</h3>
                    <p class="menu-description">Refreshing yogurt drink blended with mango pulp</p>
                    <div class="menu-item-footer">
                        <span class="menu-price">₹3.75</span>
                        <button class="add-to-cart-btn" onclick="addToCart('bv2', 'Mango Lassi', 3.75)">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Special Offers Section -->
        <div class="special-offers">
            <h2>Today's Specials</h2>
            <div class="special-offers-container">
                <div class="special-offer-card">
                    <div class="offer-details">
                        <h3>Combo Meal Deal</h3>
                        <p>Get any lunch item with a beverage at 10% off!</p>
                        <button class="cta-button">View Deal</button>
                    </div>
                </div>
                <div class="special-offer-card">
                    <div class="offer-details">
                        <h3>Happy Hours: 3PM-5PM</h3>
                        <p>All snack items at 15% discount!</p>
                        <button class="cta-button">View Deal</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-container">
            <!-- Company Contact Section -->
            <div class="footer-section">
                <h3>Company Contact</h3>
                <p>123 Street, Kerala, India</p>
                <p>+012 345 67890</p>
                <p>info@example.com</p>
            </div>

            <!-- Opening Hours Section -->
            <div class="footer-section">
                <h3>Opening Hours</h3>
                <p>Monday - Friday</p>
                <p>09AM - 04PM</p>
            </div>

            <!-- Description Section -->
            <div class="footer-section">
                <h3>About Us</h3>
                <p>Dedicated to providing you with delicious meals and excellent service, making your dining experience memorable.</p>
            </div>
        </div>

        <!-- Copyright Section -->
        <div class="copyright">
            <p>&copy; 2025 Online Canteen. All rights reserved.</p>
        </div>
    </footer>

    <script src="scripts.js"></script>
    <script src="menu-scripts.js"></script>
</body>
</html>