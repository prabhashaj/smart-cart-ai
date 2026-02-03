import { Header } from '@/components/layout/Header';
import { CheckoutView } from '@/components/checkout/CheckoutView';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CheckoutView />
      </main>
    </div>
  );
}
