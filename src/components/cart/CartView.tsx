import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export function CartView() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Your cart is empty</h3>
              <p className="text-muted-foreground mt-1">
                Upload a grocery list to get started
              </p>
            </div>
            <Link to="/upload">
              <Button size="lg" className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Upload Grocery List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
          <Button variant="outline" size="sm" onClick={clearCart}>
            Clear All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                {/* Product Icon */}
                <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-3xl">
                  {item.product.image}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price.toFixed(2)} / {item.product.unit}
                  </p>
                  {item.product.brand && (
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center rounded-lg border bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subtotal */}
                <div className="text-right w-24">
                  <p className="font-semibold text-foreground">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="block mt-6">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
