"""
Product Manager
Handles product catalog, search, and recommendations
"""

from typing import List, Dict, Optional

class ProductManager:
    def __init__(self):
        self.products = [
            # Electronics
            {
                'id': 1,
                'name': 'Wireless Headphones Pro',
                'category': 'Electronics',
                'price': 199.99,
                'image': '🎧',
                'description': 'Premium noise-canceling wireless headphones with 30-hour battery life',
                'tags': ['audio', 'wireless', 'premium']
            },
            {
                'id': 2,
                'name': 'Smart Watch Ultra',
                'category': 'Electronics',
                'price': 399.99,
                'image': '⌚',
                'description': 'Advanced fitness tracking with heart rate monitor and GPS',
                'tags': ['wearable', 'fitness', 'smart']
            },
            {
                'id': 3,
                'name': 'Portable Charger 20000mAh',
                'category': 'Electronics',
                'price': 49.99,
                'image': '🔋',
                'description': 'High-capacity power bank with fast charging support',
                'tags': ['charging', 'portable', 'accessory']
            },
            {
                'id': 4,
                'name': 'Wireless Mouse',
                'category': 'Electronics',
                'price': 29.99,
                'image': '🖱️',
                'description': 'Ergonomic wireless mouse with precision tracking',
                'tags': ['computer', 'wireless', 'accessory']
            },
            {
                'id': 5,
                'name': 'USB-C Hub 7-in-1',
                'category': 'Electronics',
                'price': 59.99,
                'image': '🔌',
                'description': 'Multi-port adapter with HDMI, USB 3.0, and SD card reader',
                'tags': ['computer', 'adapter', 'accessory']
            },
            # Home & Living
            {
                'id': 6,
                'name': 'Smart LED Bulbs (4-Pack)',
                'category': 'Home',
                'price': 79.99,
                'image': '💡',
                'description': 'Color-changing smart bulbs with app control',
                'tags': ['smart-home', 'lighting', 'iot']
            },
            {
                'id': 7,
                'name': 'Robot Vacuum Cleaner',
                'category': 'Home',
                'price': 299.99,
                'image': '🤖',
                'description': 'Automatic vacuum with mapping and scheduling',
                'tags': ['cleaning', 'smart-home', 'automation']
            },
            {
                'id': 8,
                'name': 'Air Purifier',
                'category': 'Home',
                'price': 149.99,
                'image': '🌬️',
                'description': 'HEPA filter air purifier for large rooms',
                'tags': ['health', 'air-quality', 'home']
            },
            {
                'id': 9,
                'name': 'Smart Thermostat',
                'category': 'Home',
                'price': 179.99,
                'image': '🌡️',
                'description': 'Energy-saving thermostat with learning capabilities',
                'tags': ['smart-home', 'energy', 'iot']
            },
            # Fitness & Sports
            {
                'id': 10,
                'name': 'Yoga Mat Premium',
                'category': 'Fitness',
                'price': 39.99,
                'image': '🧘',
                'description': 'Non-slip eco-friendly yoga mat with carrying strap',
                'tags': ['yoga', 'fitness', 'exercise']
            },
            {
                'id': 11,
                'name': 'Resistance Bands Set',
                'category': 'Fitness',
                'price': 24.99,
                'image': '💪',
                'description': '5-piece resistance band set with different strengths',
                'tags': ['strength', 'fitness', 'exercise']
            },
            {
                'id': 12,
                'name': 'Water Bottle 32oz',
                'category': 'Fitness',
                'price': 19.99,
                'image': '💧',
                'description': 'Insulated stainless steel water bottle',
                'tags': ['hydration', 'fitness', 'accessory']
            },
            # Fashion & Accessories
            {
                'id': 13,
                'name': 'Leather Backpack',
                'category': 'Fashion',
                'price': 89.99,
                'image': '🎒',
                'description': 'Premium leather backpack with laptop compartment',
                'tags': ['bag', 'leather', 'travel']
            },
            {
                'id': 14,
                'name': 'Sunglasses Polarized',
                'category': 'Fashion',
                'price': 69.99,
                'image': '🕶️',
                'description': 'UV protection polarized sunglasses',
                'tags': ['eyewear', 'fashion', 'protection']
            },
            {
                'id': 15,
                'name': 'Minimalist Wallet',
                'category': 'Fashion',
                'price': 34.99,
                'image': '👛',
                'description': 'Slim RFID-blocking wallet with card holder',
                'tags': ['wallet', 'minimalist', 'accessory']
            },
            # Books & Learning
            {
                'id': 16,
                'name': 'E-Reader Premium',
                'category': 'Books',
                'price': 139.99,
                'image': '📚',
                'description': 'High-resolution e-ink display with adjustable backlight',
                'tags': ['reading', 'digital', 'books']
            },
            {
                'id': 17,
                'name': 'Notebook Set',
                'category': 'Books',
                'price': 24.99,
                'image': '📓',
                'description': 'Premium hardcover notebooks (3-pack)',
                'tags': ['writing', 'stationery', 'productivity']
            },
            {
                'id': 18,
                'name': 'Desk Organizer',
                'category': 'Office',
                'price': 29.99,
                'image': '📋',
                'description': 'Bamboo desk organizer with multiple compartments',
                'tags': ['organization', 'office', 'productivity']
            }
        ]
        
        self.categories = list(set(p['category'] for p in self.products))
    
    def get_all_products(self) -> List[Dict]:
        """Get all products"""
        return self.products
    
    def get_product_by_id(self, product_id: int) -> Optional[Dict]:
        """Get single product by ID"""
        for product in self.products:
            if product['id'] == product_id:
                return product
        return None
    
    def get_products_by_category(self, category: str) -> List[Dict]:
        """Get products by category"""
        return [p for p in self.products if p['category'] == category]
    
    def search_products(self, query: str) -> List[Dict]:
        """Search products by name, description, or tags"""
        query_lower = query.lower()
        results = []
        
        for product in self.products:
            # Check name
            if query_lower in product['name'].lower():
                results.append(product)
                continue
            
            # Check description
            if query_lower in product['description'].lower():
                results.append(product)
                continue
            
            # Check tags
            if any(query_lower in tag.lower() for tag in product['tags']):
                results.append(product)
                continue
        
        return results
    
    def get_categories(self) -> List[str]:
        """Get all categories"""
        return self.categories
    
    def get_related_products(self, product_id: int, limit: int = 4) -> List[Dict]:
        """Get related products based on category and tags"""
        product = self.get_product_by_id(product_id)
        if not product:
            return []
        
        # Score products by similarity
        scored_products = []
        for p in self.products:
            if p['id'] == product_id:
                continue
            
            score = 0
            
            # Same category = +3 points
            if p['category'] == product['category']:
                score += 3
            
            # Shared tags = +1 point each
            shared_tags = set(p['tags']) & set(product['tags'])
            score += len(shared_tags)
            
            if score > 0:
                scored_products.append((p, score))
        
        # Sort by score and return top N
        scored_products.sort(key=lambda x: x[1], reverse=True)
        return [p for p, _ in scored_products[:limit]]
