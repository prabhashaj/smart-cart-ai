import { Package, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { orders } = useCart();

  const statusConfig = {
    pending: { label: 'Pending', variant: 'secondary' as const },
    confirmed: { label: 'Confirmed', variant: 'default' as const },
    delivered: { label: 'Delivered', variant: 'outline' as const },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Order History</h1>

        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">No orders yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Your order history will appear here
                  </p>
                </div>
                <Link to="/upload">
                  <Button className="mt-4">Start Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {format(order.createdAt, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <Badge variant={status.variant}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Items Preview */}
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm"
                          >
                            <span>{item.product.image}</span>
                            <span>{item.product.name}</span>
                            <span className="text-muted-foreground">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 5 && (
                          <div className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                            +{order.items.length - 5} more
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex flex-wrap gap-6 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{order.items.length} items</span>
                        </div>
                        {order.deliveryDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Est. delivery: {format(order.deliveryDate, 'MMM d')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
