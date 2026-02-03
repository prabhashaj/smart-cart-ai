import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  const { walletBalance, transactions, addWalletBalance } = useCart();
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      addWalletBalance(amount);
      setTopUpAmount('');
      toast.success(`$${amount.toFixed(2)} added to wallet`);
    }
  };

  const quickAmounts = [25, 50, 100, 200];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Balance Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Wallet Balance</p>
                    <p className="text-4xl font-bold">${walletBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Top Up Section */}
              <div className="p-6">
                <h3 className="font-semibold mb-4">Add Funds</h3>
                <div className="flex gap-2 mb-4">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="flex-1"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTopUp} disabled={!topUpAmount} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Funds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No transactions yet
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4"
                    >
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center',
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        )}
                      >
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(transaction.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <p
                        className={cn(
                          'font-semibold',
                          transaction.type === 'credit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}$
                        {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
