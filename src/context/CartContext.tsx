import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product, Order, WalletTransaction } from '@/types/grocery';

interface CartState {
  items: CartItem[];
  walletBalance: number;
  orders: Order[];
  transactions: WalletTransaction[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; items: CartItem[] }
  | { type: 'ADD_WALLET_BALANCE'; amount: number }
  | { type: 'CHECKOUT'; order: Order }
  | { type: 'ADD_TRANSACTION'; transaction: WalletTransaction };

const initialState: CartState = {
  items: [],
  walletBalance: 250.00, // Initial wallet balance
  orders: [],
  transactions: [
    {
      id: '1',
      type: 'credit',
      amount: 250.00,
      description: 'Welcome bonus',
      createdAt: new Date(),
    },
  ],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? {
                  ...item,
                  quantity: item.quantity + action.quantity,
                  subtotal: (item.quantity + action.quantity) * item.product.price,
                }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        id: crypto.randomUUID(),
        product: action.product,
        quantity: action.quantity,
        subtotal: action.quantity * action.product.price,
      };

      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.itemId),
      };

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.itemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId
            ? {
                ...item,
                quantity: action.quantity,
                subtotal: action.quantity * item.product.price,
              }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_CART':
      return { ...state, items: action.items };

    case 'ADD_WALLET_BALANCE':
      return {
        ...state,
        walletBalance: state.walletBalance + action.amount,
      };

    case 'CHECKOUT': {
      const transaction: WalletTransaction = {
        id: crypto.randomUUID(),
        type: 'debit',
        amount: action.order.total,
        description: `Order #${action.order.id.slice(0, 8)}`,
        createdAt: new Date(),
        orderId: action.order.id,
      };

      return {
        ...state,
        items: [],
        walletBalance: state.walletBalance - action.order.total,
        orders: [action.order, ...state.orders],
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
      };

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  addWalletBalance: (amount: number) => void;
  checkout: () => Order | null;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const cartTotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setCart = (items: CartItem[]) => {
    dispatch({ type: 'SET_CART', items });
  };

  const addWalletBalance = (amount: number) => {
    const transaction: WalletTransaction = {
      id: crypto.randomUUID(),
      type: 'credit',
      amount,
      description: 'Wallet top-up',
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TRANSACTION', transaction });
    dispatch({ type: 'ADD_WALLET_BALANCE', amount });
  };

  const checkout = (): Order | null => {
    if (state.items.length === 0 || cartTotal > state.walletBalance) {
      return null;
    }

    const order: Order = {
      id: crypto.randomUUID(),
      items: [...state.items],
      total: cartTotal,
      status: 'confirmed',
      createdAt: new Date(),
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    };

    dispatch({ type: 'CHECKOUT', order });
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCart,
        addWalletBalance,
        checkout,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
