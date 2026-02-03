import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout';
import { CartView } from '../components/cart/CartView';

export default function CartPage() {
  return (
    <AuthenticatedLayout>
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>
      <CartView />
    </AuthenticatedLayout>
  );
}
