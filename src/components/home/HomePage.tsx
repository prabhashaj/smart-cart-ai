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
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-pink-200/50 text-pink-700 text-sm font-semibold mb-8 shadow-lg">
              <Sparkles className="h-5 w-5 animate-pulse" />
              AI-Powered Grocery Shopping Revolution
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              From Grocery List to{' '}
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent">
                Cart in Seconds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload a photo of your handwritten grocery list and let our AI automatically
              detect items, find products, and fill your cart. Shopping has never been this easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="gap-4 px-10 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="gap-4 px-10 py-6 text-lg font-semibold border-2 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400 rounded-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats/Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">99%</div>
                <p className="text-gray-600 font-medium">Recognition Accuracy</p>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">3s</div>
                <p className="text-gray-600 font-medium">Average Processing Time</p>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">50K+</div>
                <p className="text-gray-600 font-medium">Happy Shoppers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-20 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Four simple steps to transform your grocery list into a ready-to-checkout cart
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/70 backdrop-blur-sm border-pink-100/50 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-6 mb-6 group-hover:from-pink-200 group-hover:to-rose-200 transition-all duration-300">
                    <feature.icon className="h-12 w-12 text-pink-600 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto overflow-hidden bg-white/70 backdrop-blur-sm border-pink-100/50 shadow-2xl rounded-3xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-12 md:p-16">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">
                    Ready to simplify your grocery shopping?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Upload your first grocery list and experience the magic of AI-powered shopping.
                  </p>
                  <Link to="/login">
                    <Button 
                      size="lg" 
                      className="gap-4 px-8 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-pink-500/25 transform hover:scale-105 w-full sm:w-auto"
                    >
                      <Upload className="h-6 w-6" />
                      Upload Your List
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-pink-100/60 to-rose-100/60 p-16 min-h-[400px] relative overflow-hidden">
                  <div className="text-[120px] animate-bounce" style={{animationDuration: '3s'}}>🛒</div>
                  
                  {/* Floating elements around cart */}
                  <div className="absolute top-16 left-16 text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>🥕</div>
                  <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '2s'}}>🍎</div>
                  <div className="absolute bottom-24 left-20 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>🥖</div>
                  <div className="absolute bottom-20 right-16 text-4xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>🥛</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
