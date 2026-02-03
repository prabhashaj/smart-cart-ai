import Fuse from 'fuse.js';
import { ParsedItem, Product } from '@/types/grocery';
import { productCatalog } from '@/data/products';

// Quantity patterns
const quantityPatterns = [
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(kg|kgs|kilogram|kilograms?)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(g|grams?|gm)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(l|liter|liters|litre|litres)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(ml|milliliter|milliliters)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(pcs|pieces?|pc|nos?|number)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(pack|packs|packet|packets)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(dozen|doz)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(bottle|bottles)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(box|boxes)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(can|cans)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(bag|bags)/i,
  /(\d+(?:\.\d+)?)\s*(?:x|×)?\s*(loaf|loaves)/i,
  /^(\d+(?:\.\d+)?)\s+/,  // Just number at start
  /\s+(\d+(?:\.\d+)?)$/,  // Just number at end
];

// Word to number mapping
const wordToNumber: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'half': 0.5, 'quarter': 0.25, 'a': 1, 'an': 1,
};

// Unit normalization
const unitNormalization: Record<string, string> = {
  'kg': 'kg', 'kgs': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
  'g': 'g', 'grams': 'g', 'gm': 'g', 'gram': 'g',
  'l': 'L', 'liter': 'L', 'liters': 'L', 'litre': 'L', 'litres': 'L',
  'ml': 'ml', 'milliliter': 'ml', 'milliliters': 'ml',
  'pcs': 'pcs', 'pieces': 'pcs', 'pc': 'pcs', 'piece': 'pcs', 'nos': 'pcs', 'number': 'pcs',
  'pack': 'pack', 'packs': 'pack', 'packet': 'pack', 'packets': 'pack',
  'dozen': 'dozen', 'doz': 'dozen',
  'bottle': 'bottle', 'bottles': 'bottle',
  'box': 'box', 'boxes': 'box',
  'can': 'can', 'cans': 'can',
  'bag': 'bag', 'bags': 'bag',
  'loaf': 'loaf', 'loaves': 'loaf',
};

// Create Fuse instance for fuzzy matching
const fuseOptions = {
  keys: ['name', 'synonyms'],
  threshold: 0.4,
  includeScore: true,
};

const fuse = new Fuse(productCatalog, fuseOptions);

function extractQuantityAndUnit(text: string): { quantity: number; unit: string; cleanText: string } {
  let quantity = 1;
  let unit = 'pcs';
  let cleanText = text;

  // Check for word numbers
  for (const [word, num] of Object.entries(wordToNumber)) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) {
      quantity = num;
      cleanText = cleanText.replace(regex, '').trim();
    }
  }

  // Check for numeric patterns
  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (match) {
      quantity = parseFloat(match[1]);
      if (match[2]) {
        const normalizedUnit = unitNormalization[match[2].toLowerCase()];
        if (normalizedUnit) {
          unit = normalizedUnit;
        }
      }
      cleanText = cleanText.replace(pattern, '').trim();
      break;
    }
  }

  // Clean up the text
  cleanText = cleanText
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { quantity, unit, cleanText };
}

function findMatchingProduct(itemName: string): {
  product: Product | undefined;
  alternatives: Product[];
  confidence: number;
} {
  const results = fuse.search(itemName);
  
  if (results.length === 0) {
    return { product: undefined, alternatives: [], confidence: 0 };
  }

  const bestMatch = results[0];
  const confidence = 1 - (bestMatch.score || 0);
  
  // Get alternatives (skip first one as it's the best match)
  const alternatives = results
    .slice(1, 4)
    .filter(r => (1 - (r.score || 0)) > 0.3)
    .map(r => r.item);

  return {
    product: bestMatch.item,
    alternatives,
    confidence,
  };
}

export function parseGroceryList(text: string): ParsedItem[] {
  const lines = text
    .split(/[\n,;]/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const parsedItems: ParsedItem[] = [];

  for (const line of lines) {
    const { quantity, unit, cleanText } = extractQuantityAndUnit(line);
    
    if (cleanText.length < 2) continue;

    const { product, alternatives, confidence } = findMatchingProduct(cleanText);

    const status: ParsedItem['status'] = 
      product && confidence > 0.7 ? 'matched' :
      product && confidence > 0.4 ? 'partial' :
      'unmatched';

    parsedItems.push({
      id: crypto.randomUUID(),
      rawText: line,
      name: cleanText,
      quantity,
      unit: product?.unit || unit,
      confidence,
      matchedProduct: product,
      alternativeProducts: alternatives,
      status,
    });
  }

  return parsedItems;
}

export function searchProducts(query: string, limit = 10): Product[] {
  if (!query || query.length < 2) return [];
  
  const results = fuse.search(query, { limit });
  return results.map(r => r.item);
}
