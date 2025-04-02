// Sample menu data (Replace with actual data)
let menuItems = [
    { name: "Margherita Pizza", category: "Pizza", image: "margherita.jpg" },
    { name: "Veg Burger", category: "Burger", image: "veg-burger.jpg" },
    { name: "French Fries", category: "Snacks", image: "fries.jpg" },
    { name: "Pasta Alfredo", category: "Pasta", image: "pasta-alfredo.jpg" }
];

// Function to display menu items
function displayMenu(items) {
    let menuContainer = document.getElementById("menu");
    menuContainer.innerHTML = ""; // Clear previous items

    items.forEach((item) => {
        let card = document.createElement("div");
        card.classList.add("menu-item"); // Important for filtering
        card.setAttribute("data-category", item.category.toLowerCase()); // Important for filtering

        let imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");
        let image = document.createElement("img");
        image.setAttribute("src", item.image);
        imgContainer.appendChild(image);
        card.appendChild(imgContainer);

        let container = document.createElement("div");
        container.classList.add("container");

        let name = document.createElement("h5");
        name.classList.add("item-name");
        name.innerText = item.name;
        container.appendChild(name);

        card.appendChild(container);
        menuContainer.appendChild(card);
    });
}

// Function to filter menu items
function filterProduct(category) {
    let items = document.querySelectorAll('.menu-item'); // Selecting dynamically created items

    items.forEach(item => {
        let itemCategory = item.getAttribute('data-category').toLowerCase();

        if (category === 'all' || itemCategory === category.toLowerCase()) {
            item.style.display = "block"; // Show item
        } else {
            item.style.display = "none"; // Hide item
        }
    });

    // Category button active state
    let buttons = document.querySelectorAll(".category-btn");
    buttons.forEach((button) => {
        if (category.toLowerCase() === button.innerText.toLowerCase()) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Search functionality
document.getElementById("search").addEventListener("click", () => {
    let searchInput = document.getElementById("search-input").value.toLowerCase();
    let filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchInput));
    displayMenu(filteredItems);
});

// Initial load
window.onload = () => {
    displayMenu(menuItems);
};
