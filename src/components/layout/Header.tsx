import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Wallet, Home, History, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

export function Header() {
  const location = useLocation();
  const { itemCount, walletBalance } = useCart();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'Upload List', icon: Upload },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, badge: itemCount },
    { path: '/orders', label: 'Orders', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold text-foreground">SmartCart AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon, badge }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                className="relative gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                    {badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/wallet">
            <Button variant="outline" size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="font-semibold">${walletBalance.toFixed(2)}</span>
            </Button>
          </Link>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            {navItems.map(({ path, icon: Icon, badge }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  size="icon"
                  className="relative"
                >
                  <Icon className="h-5 w-5" />
                  {badge !== undefined && badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
                    >
                      {badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
