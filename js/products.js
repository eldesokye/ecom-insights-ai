// Product Database and Management
class ProductManager {
    constructor() {
        this.products = [
            // Electronics
            {
                id: 1,
                name: "Wireless Headphones Pro",
                category: "Electronics",
                price: 199.99,
                image: "🎧",
                description: "Premium noise-canceling wireless headphones with 30-hour battery life",
                tags: ["audio", "wireless", "premium"]
            },
            {
                id: 2,
                name: "Smart Watch Ultra",
                category: "Electronics",
                price: 399.99,
                image: "⌚",
                description: "Advanced fitness tracking with heart rate monitor and GPS",
                tags: ["wearable", "fitness", "smart"]
            },
            {
                id: 3,
                name: "Portable Charger 20000mAh",
                category: "Electronics",
                price: 49.99,
                image: "🔋",
                description: "High-capacity power bank with fast charging support",
                tags: ["charging", "portable", "accessory"]
            },
            {
                id: 4,
                name: "Wireless Mouse",
                category: "Electronics",
                price: 29.99,
                image: "🖱️",
                description: "Ergonomic wireless mouse with precision tracking",
                tags: ["computer", "wireless", "accessory"]
            },
            {
                id: 5,
                name: "USB-C Hub 7-in-1",
                category: "Electronics",
                price: 59.99,
                image: "🔌",
                description: "Multi-port adapter with HDMI, USB 3.0, and SD card reader",
                tags: ["computer", "adapter", "accessory"]
            },
            // Home & Living
            {
                id: 6,
                name: "Smart LED Bulbs (4-Pack)",
                category: "Home",
                price: 79.99,
                image: "💡",
                description: "Color-changing smart bulbs with app control",
                tags: ["smart-home", "lighting", "iot"]
            },
            {
                id: 7,
                name: "Robot Vacuum Cleaner",
                category: "Home",
                price: 299.99,
                image: "🤖",
                description: "Automatic vacuum with mapping and scheduling",
                tags: ["cleaning", "smart-home", "automation"]
            },
            {
                id: 8,
                name: "Air Purifier",
                category: "Home",
                price: 149.99,
                image: "🌬️",
                description: "HEPA filter air purifier for large rooms",
                tags: ["health", "air-quality", "home"]
            },
            {
                id: 9,
                name: "Smart Thermostat",
                category: "Home",
                price: 179.99,
                image: "🌡️",
                description: "Energy-saving thermostat with learning capabilities",
                tags: ["smart-home", "energy", "iot"]
            },
            // Fitness & Sports
            {
                id: 10,
                name: "Yoga Mat Premium",
                category: "Fitness",
                price: 39.99,
                image: "🧘",
                description: "Non-slip eco-friendly yoga mat with carrying strap",
                tags: ["yoga", "fitness", "exercise"]
            },
            {
                id: 11,
                name: "Resistance Bands Set",
                category: "Fitness",
                price: 24.99,
                image: "💪",
                description: "5-piece resistance band set with different strengths",
                tags: ["strength", "fitness", "exercise"]
            },
            {
                id: 12,
                name: "Water Bottle 32oz",
                category: "Fitness",
                price: 19.99,
                image: "💧",
                description: "Insulated stainless steel water bottle",
                tags: ["hydration", "fitness", "accessory"]
            },
            // Fashion & Accessories
            {
                id: 13,
                name: "Leather Backpack",
                category: "Fashion",
                price: 89.99,
                image: "🎒",
                description: "Premium leather backpack with laptop compartment",
                tags: ["bag", "leather", "travel"]
            },
            {
                id: 14,
                name: "Sunglasses Polarized",
                category: "Fashion",
                price: 69.99,
                image: "🕶️",
                description: "UV protection polarized sunglasses",
                tags: ["eyewear", "fashion", "protection"]
            },
            {
                id: 15,
                name: "Minimalist Wallet",
                category: "Fashion",
                price: 34.99,
                image: "👛",
                description: "Slim RFID-blocking wallet with card holder",
                tags: ["wallet", "minimalist", "accessory"]
            },
            // Books & Learning
            {
                id: 16,
                name: "E-Reader Premium",
                category: "Books",
                price: 139.99,
                image: "📚",
                description: "High-resolution e-ink display with adjustable backlight",
                tags: ["reading", "digital", "books"]
            },
            {
                id: 17,
                name: "Notebook Set",
                category: "Books",
                price: 24.99,
                image: "📓",
                description: "Premium hardcover notebooks (3-pack)",
                tags: ["writing", "stationery", "productivity"]
            },
            {
                id: 18,
                name: "Desk Organizer",
                category: "Office",
                price: 29.99,
                image: "📋",
                description: "Bamboo desk organizer with multiple compartments",
                tags: ["organization", "office", "productivity"]
            }
        ];
        
        this.categories = [...new Set(this.products.map(p => p.category))];
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.includes(lowerQuery))
        );
    }

    getCategories() {
        return this.categories;
    }

    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        // Find products in same category or with similar tags
        return this.products
            .filter(p => p.id !== productId)
            .map(p => {
                let score = 0;
                if (p.category === product.category) score += 3;
                score += p.tags.filter(tag => product.tags.includes(tag)).length;
                return { product: p, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.product);
    }
}

// Export for use in other modules
window.ProductManager = ProductManager;
