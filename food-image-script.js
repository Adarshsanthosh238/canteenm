document.addEventListener('DOMContentLoaded', function() {
    // Check if images are already stored in localStorage
    let cachedImages = JSON.parse(localStorage.getItem('foodImages')) || {};

    const foodImages = cachedImages || {
        'Breakfast Sandwich': 'https://source.unsplash.com/featured/?breakfast,sandwich',
        'Veggie Omelette': 'https://source.unsplash.com/featured/?omelette,vegetable',
        'Chicken Biryani': 'https://source.unsplash.com/featured/?biryani,chicken',
        'Veg Thali': 'https://source.unsplash.com/featured/?thali,indian',
        'Paneer Butter Masala': 'https://source.unsplash.com/featured/?paneer,curry',
        'Samosa Plate': 'https://source.unsplash.com/featured/?samosa,indian',
        'Vada Pav': 'https://source.unsplash.com/featured/?vada,indian',
        'Masala Chai': 'https://source.unsplash.com/featured/?chai,tea',
        'Mango Lassi': 'https://source.unsplash.com/featured/?lassi,mango'
    };

    // Save images to localStorage so they don’t change
    if (!localStorage.getItem('foodImages')) {
        localStorage.setItem('foodImages', JSON.stringify(foodImages));
    }

    function replacePlaceholderImages() {
        document.querySelectorAll('.menu-item').forEach(item => {
            const itemName = item.querySelector('h3').textContent;
            const imgElement = item.querySelector('img');
            
            if (foodImages[itemName] && imgElement) {
                imgElement.src = foodImages[itemName];
                imgElement.alt = itemName;
            }
        });
    }

    replacePlaceholderImages();
});
