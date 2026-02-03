import { Header } from '@/components/layout/Header';
import { CartView } from '@/components/cart/CartView';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>
        <CartView />
      </main>
    </div>
  );
}
