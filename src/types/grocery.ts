// Core types for SmartCart AI

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
  brand?: string;
  synonyms?: string[];
}

export interface ParsedItem {
  id: string;
  rawText: string;
  name: string;
  quantity: number;
  unit: string;
  confidence: number;
  matchedProduct?: Product;
  alternativeProducts?: Product[];
  status: 'matched' | 'partial' | 'unmatched';
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: Date;
  deliveryDate?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  walletBalance: number;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: Date;
  orderId?: string;
}

export type UploadStep = 'upload' | 'processing' | 'review' | 'cart' | 'checkout' | 'success';
