import { useState } from 'react';
import { Wallet, CreditCard, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CheckoutView() {
  const navigate = useNavigate();
  const { items, cartTotal, walletBalance, checkout, addWalletBalance } = useCart();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const insufficientBalance = walletBalance < cartTotal;

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      addWalletBalance(amount);
      setTopUpAmount('');
      toast.success(`$${amount.toFixed(2)} added to wallet`);
    }
  };

  const handleCheckout = async () => {
    if (insufficientBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const order = checkout();
    
    if (order) {
      toast.success('Order placed successfully!');
      navigate('/orders', { state: { newOrder: order } });
    } else {
      toast.error('Failed to place order');
    }
    
    setIsProcessing(false);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-96 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    <span className="text-2xl">{item.product.image}</span>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: 2-3 business days
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  * In a real app, you would enter your delivery address here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment */}
        <div className="space-y-6">
          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-4">
                ${walletBalance.toFixed(2)}
              </div>

              {insufficientBalance && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mb-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Insufficient Balance</p>
                    <p>You need ${(cartTotal - walletBalance).toFixed(2)} more</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleTopUp} disabled={!topUpAmount}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Quick top-up your wallet
              </p>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-6 gap-2"
                onClick={handleCheckout}
                disabled={insufficientBalance || isProcessing}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay with Wallet
                  </>
                )}
              </Button>

              {!insufficientBalance && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  New balance after purchase: ${(walletBalance - cartTotal).toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
