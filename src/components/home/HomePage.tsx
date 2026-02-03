import { ArrowRight, Upload, Brain, ShoppingCart, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Upload,
    title: 'Upload Your List',
    description: 'Take a photo of your handwritten list or paste text',
  },
  {
    icon: Brain,
    title: 'AI Recognition',
    description: 'Our AI extracts items, quantities, and units automatically',
  },
  {
    icon: ShoppingCart,
    title: 'Auto-Fill Cart',
    description: 'Items are matched to products and added to your cart',
  },
  {
    icon: CreditCard,
    title: 'Quick Checkout',
    description: 'Review, edit, and checkout with one click',
  },
];

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Grocery Shopping
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              From Grocery List to{' '}
              <span className="text-primary">Cart in Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload a photo of your handwritten grocery list and let our AI automatically
              detect items, find products, and fill your cart. Shopping has never been this easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <ShoppingCart className="h-4 w-4" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four simple steps to transform your grocery list into a ready-to-checkout cart
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Ready to simplify your grocery shopping?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Upload your first grocery list and experience the magic of AI-powered shopping.
                  </p>
                  <Link to="/upload">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      <Upload className="h-4 w-4" />
                      Upload Your List
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-12">
                  <div className="text-8xl">🛒</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
