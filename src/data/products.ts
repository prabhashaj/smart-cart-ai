import { Product } from '@/types/grocery';

export const productCatalog: Product[] = [
  // Fruits
  { id: '1', name: 'Apple', category: 'Fruits', price: 3.99, unit: 'kg', image: '🍎', inStock: true, synonyms: ['apples', 'red apple', 'green apple'] },
  { id: '2', name: 'Banana', category: 'Fruits', price: 1.99, unit: 'kg', image: '🍌', inStock: true, synonyms: ['bananas', 'banana bunch'] },
  { id: '3', name: 'Orange', category: 'Fruits', price: 4.49, unit: 'kg', image: '🍊', inStock: true, synonyms: ['oranges', 'navel orange'] },
  { id: '4', name: 'Grapes', category: 'Fruits', price: 5.99, unit: 'kg', image: '🍇', inStock: true, synonyms: ['grape', 'red grapes', 'green grapes'] },
  { id: '5', name: 'Mango', category: 'Fruits', price: 2.49, unit: 'pcs', image: '🥭', inStock: true, synonyms: ['mangoes', 'mangos'] },
  { id: '6', name: 'Strawberry', category: 'Fruits', price: 6.99, unit: 'pack', image: '🍓', inStock: true, synonyms: ['strawberries'] },
  { id: '7', name: 'Watermelon', category: 'Fruits', price: 8.99, unit: 'pcs', image: '🍉', inStock: false, synonyms: ['melon'] },
  
  // Vegetables
  { id: '10', name: 'Tomato', category: 'Vegetables', price: 2.99, unit: 'kg', image: '🍅', inStock: true, synonyms: ['tomatoes', 'cherry tomato'] },
  { id: '11', name: 'Potato', category: 'Vegetables', price: 1.49, unit: 'kg', image: '🥔', inStock: true, synonyms: ['potatoes', 'potato bag'] },
  { id: '12', name: 'Onion', category: 'Vegetables', price: 1.29, unit: 'kg', image: '🧅', inStock: true, synonyms: ['onions', 'red onion', 'white onion'] },
  { id: '13', name: 'Carrot', category: 'Vegetables', price: 1.99, unit: 'kg', image: '🥕', inStock: true, synonyms: ['carrots'] },
  { id: '14', name: 'Broccoli', category: 'Vegetables', price: 3.49, unit: 'pcs', image: '🥦', inStock: true, synonyms: ['brocolli'] },
  { id: '15', name: 'Lettuce', category: 'Vegetables', price: 2.49, unit: 'pcs', image: '🥬', inStock: true, synonyms: ['salad', 'iceberg lettuce'] },
  { id: '16', name: 'Cucumber', category: 'Vegetables', price: 1.79, unit: 'pcs', image: '🥒', inStock: true, synonyms: ['cucumbers'] },
  { id: '17', name: 'Bell Pepper', category: 'Vegetables', price: 4.99, unit: 'kg', image: '🫑', inStock: true, synonyms: ['capsicum', 'pepper', 'green pepper', 'red pepper'] },
  { id: '18', name: 'Garlic', category: 'Vegetables', price: 0.99, unit: 'pcs', image: '🧄', inStock: true, synonyms: ['garlic clove'] },
  { id: '19', name: 'Ginger', category: 'Vegetables', price: 5.99, unit: 'kg', image: '🫚', inStock: true, synonyms: ['fresh ginger'] },
  
  // Dairy
  { id: '20', name: 'Milk', category: 'Dairy', price: 3.49, unit: 'L', image: '🥛', inStock: true, brand: 'FreshDairy', synonyms: ['whole milk', 'skim milk', 'full cream milk'] },
  { id: '21', name: 'Eggs', category: 'Dairy', price: 4.99, unit: 'dozen', image: '🥚', inStock: true, synonyms: ['egg', 'free range eggs'] },
  { id: '22', name: 'Cheese', category: 'Dairy', price: 6.99, unit: 'pack', image: '🧀', inStock: true, synonyms: ['cheddar', 'mozzarella', 'cheese block'] },
  { id: '23', name: 'Butter', category: 'Dairy', price: 4.49, unit: 'pack', image: '🧈', inStock: true, synonyms: ['unsalted butter', 'salted butter'] },
  { id: '24', name: 'Yogurt', category: 'Dairy', price: 5.99, unit: 'pack', image: '🥛', inStock: true, synonyms: ['greek yogurt', 'natural yogurt'] },
  
  // Bakery
  { id: '30', name: 'Bread', category: 'Bakery', price: 2.99, unit: 'loaf', image: '🍞', inStock: true, synonyms: ['white bread', 'whole wheat bread', 'brown bread'] },
  { id: '31', name: 'Croissant', category: 'Bakery', price: 1.49, unit: 'pcs', image: '🥐', inStock: true, synonyms: ['croissants'] },
  { id: '32', name: 'Bagel', category: 'Bakery', price: 0.99, unit: 'pcs', image: '🥯', inStock: true, synonyms: ['bagels'] },
  
  // Meat & Protein
  { id: '40', name: 'Chicken Breast', category: 'Meat', price: 9.99, unit: 'kg', image: '🍗', inStock: true, synonyms: ['chicken', 'chicken fillet'] },
  { id: '41', name: 'Ground Beef', category: 'Meat', price: 11.99, unit: 'kg', image: '🥩', inStock: true, synonyms: ['beef mince', 'minced beef'] },
  { id: '42', name: 'Salmon', category: 'Meat', price: 19.99, unit: 'kg', image: '🐟', inStock: true, synonyms: ['salmon fillet', 'fresh salmon'] },
  { id: '43', name: 'Pork Chops', category: 'Meat', price: 12.99, unit: 'kg', image: '🥓', inStock: true, synonyms: ['pork'] },
  
  // Pantry
  { id: '50', name: 'Rice', category: 'Pantry', price: 4.99, unit: 'kg', image: '🍚', inStock: true, synonyms: ['white rice', 'basmati rice', 'jasmine rice'] },
  { id: '51', name: 'Pasta', category: 'Pantry', price: 2.49, unit: 'pack', image: '🍝', inStock: true, synonyms: ['spaghetti', 'penne', 'fusilli'] },
  { id: '52', name: 'Olive Oil', category: 'Pantry', price: 8.99, unit: 'bottle', image: '🫒', inStock: true, synonyms: ['extra virgin olive oil', 'cooking oil'] },
  { id: '53', name: 'Sugar', category: 'Pantry', price: 2.99, unit: 'kg', image: '🧂', inStock: true, synonyms: ['white sugar', 'brown sugar'] },
  { id: '54', name: 'Salt', category: 'Pantry', price: 1.49, unit: 'pack', image: '🧂', inStock: true, synonyms: ['table salt', 'sea salt'] },
  { id: '55', name: 'Flour', category: 'Pantry', price: 2.99, unit: 'kg', image: '🌾', inStock: true, synonyms: ['all purpose flour', 'wheat flour'] },
  { id: '56', name: 'Coffee', category: 'Pantry', price: 12.99, unit: 'pack', image: '☕', inStock: true, synonyms: ['ground coffee', 'instant coffee'] },
  { id: '57', name: 'Tea', category: 'Pantry', price: 5.99, unit: 'box', image: '🍵', inStock: true, synonyms: ['green tea', 'black tea', 'tea bags'] },
  
  // Beverages
  { id: '60', name: 'Orange Juice', category: 'Beverages', price: 4.99, unit: 'L', image: '🧃', inStock: true, synonyms: ['oj', 'fresh orange juice'] },
  { id: '61', name: 'Sparkling Water', category: 'Beverages', price: 1.99, unit: 'bottle', image: '💧', inStock: true, synonyms: ['soda water', 'mineral water'] },
  { id: '62', name: 'Cola', category: 'Beverages', price: 2.49, unit: 'bottle', image: '🥤', inStock: true, synonyms: ['coke', 'pepsi', 'soft drink'] },
  
  // Snacks
  { id: '70', name: 'Chips', category: 'Snacks', price: 3.99, unit: 'pack', image: '🍟', inStock: true, synonyms: ['potato chips', 'crisps'] },
  { id: '71', name: 'Chocolate', category: 'Snacks', price: 2.99, unit: 'bar', image: '🍫', inStock: true, synonyms: ['dark chocolate', 'milk chocolate'] },
  { id: '72', name: 'Cookies', category: 'Snacks', price: 4.49, unit: 'pack', image: '🍪', inStock: true, synonyms: ['biscuits', 'chocolate chip cookies'] },
  { id: '73', name: 'Nuts', category: 'Snacks', price: 7.99, unit: 'pack', image: '🥜', inStock: true, synonyms: ['almonds', 'cashews', 'peanuts', 'mixed nuts'] },
  
  // Frozen
  { id: '80', name: 'Ice Cream', category: 'Frozen', price: 6.99, unit: 'tub', image: '🍦', inStock: true, synonyms: ['vanilla ice cream', 'chocolate ice cream'] },
  { id: '81', name: 'Frozen Pizza', category: 'Frozen', price: 8.99, unit: 'pcs', image: '🍕', inStock: true, synonyms: ['pizza'] },
  { id: '82', name: 'Frozen Vegetables', category: 'Frozen', price: 3.99, unit: 'pack', image: '🥦', inStock: true, synonyms: ['mixed vegetables', 'frozen peas'] },
];

export const categories = [...new Set(productCatalog.map(p => p.category))];
