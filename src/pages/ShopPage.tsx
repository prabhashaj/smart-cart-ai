import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Filter, Grid3x3, Plus, Minus, Star, Heart, User, LogOut, Upload } from 'lucide-react';
import { UploadZone } from '../components/upload/UploadZone';
import { ProcessingState } from '../components/upload/ProcessingState';
import { ReviewList } from '../components/review/ReviewList';
import { StepIndicator } from '../components/layout/StepIndicator';
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productCatalog, categories } from '../data/products';
import { Product, ParsedItem, CartItem, UploadStep } from '../types/grocery';
import { extractTextFromImage, preprocessImage } from '../lib/ocr';
import { parseGroceryList } from '../lib/nlp';
import { toast } from 'sonner';

const ShopPage = () => {
  const navigate = useNavigate();
  const { addItem, updateQuantity, items, itemCount, cartTotal, setCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadStep, setUploadStep] = useState<UploadStep>('upload');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'ocr' | 'nlp' | 'matching'>('ocr');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    categories.forEach(category => {
      grouped[category] = productCatalog.filter(p => p.category === category);
    });
    
    return grouped;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = productCatalog;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.synonyms && p.synonyms.some(s => s.toLowerCase().includes(query)))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const getItemQuantity = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    return item?.quantity || 0;
  };

  const getCartItemId = (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    return item?.id;
  };

  const handleAddProductToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleRemoveFromCart = (productId: string) => {
    const cartItemId = getCartItemId(productId);
    if (cartItemId) {
      const currentQuantity = getItemQuantity(productId);
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadStep('processing');
    setProcessingProgress(0);
    setProcessingStage('ocr');

    try {
      // Preprocess image
      const preprocessedImage = await preprocessImage(file);
      setProcessingProgress(10);

      // OCR
      const ocrResult = await extractTextFromImage(preprocessedImage, (p) => {
        setProcessingProgress(10 + Math.round(p * 0.5));
      });
      setProcessingProgress(60);
      setProcessingStage('nlp');

      // Simulate NLP processing time
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessingProgress(75);
      setProcessingStage('matching');

      // Parse grocery list
      const items = parseGroceryList(ocrResult.text);
      setProcessingProgress(90);

      await new Promise((resolve) => setTimeout(resolve, 300));
      setProcessingProgress(100);

      setParsedItems(items);
      setUploadStep('review');

      if (items.length === 0) {
        toast.warning('No items detected. Try a clearer image or paste text directly.');
      } else {
        const matched = items.filter((i) => i.status === 'matched').length;
        toast.success(`Found ${items.length} items (${matched} matched)`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process image. Please try again.');
      setUploadStep('upload');
    }
  };

  const handleTextSubmit = async (text: string) => {
    setUploadStep('processing');
    setProcessingProgress(0);
    setProcessingStage('nlp');

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProcessingProgress(50);
      setProcessingStage('matching');

      const items = parseGroceryList(text);
      setProcessingProgress(90);

      await new Promise((resolve) => setTimeout(resolve, 200));
      setProcessingProgress(100);

      setParsedItems(items);
      setUploadStep('review');

      if (items.length === 0) {
        toast.warning('No items detected. Check your list format.');
      } else {
        const matched = items.filter((i) => i.status === 'matched').length;
        toast.success(`Found ${items.length} items (${matched} matched)`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process text. Please try again.');
      setUploadStep('upload');
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<ParsedItem>) => {
    setParsedItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setParsedItems((items) => items.filter((item) => item.id !== id));
  };

  const handleAddNewItem = (product: Product, quantity: number) => {
    const newItem: ParsedItem = {
      id: crypto.randomUUID(),
      rawText: product.name,
      name: product.name,
      quantity,
      unit: product.unit,
      confidence: 1,
      matchedProduct: product,
      status: 'matched',
    };
    setParsedItems((items) => [...items, newItem]);
  };

  const handleAddToCart = () => {
    const matchedItems = parsedItems.filter(
      (item) => item.status === 'matched' && item.matchedProduct
    );

    const cartItems: CartItem[] = matchedItems.map((item) => ({
      id: crypto.randomUUID(),
      product: item.matchedProduct!,
      quantity: item.quantity,
      subtotal: item.matchedProduct!.price * item.quantity,
    }));

    setCart(cartItems);
    toast.success(`${cartItems.length} items added to cart`);
    navigate('/cart');
  };

  return (
    <AuthenticatedLayout>
      {/* Pale Pink Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200">
        {/* Enhanced Pale Pink Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/80 via-rose-100/60 to-pink-150/80 animate-pulse"></div>
        
        {/* Large Animated Orbs with Dynamic Movement */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/60 to-rose-300/50 rounded-full filter blur-3xl" style={{animation: 'drift-large 15s ease-in-out infinite, pulse 8s ease-in-out infinite'}}></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-rose-300/55 to-pink-400/45 rounded-full filter blur-3xl" style={{animation: 'float-horizontal 12s ease-in-out infinite, pulse 10s ease-in-out infinite', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-gradient-to-r from-pink-400/50 to-rose-200/60 rounded-full filter blur-3xl" style={{animation: 'spiral-movement 18s linear infinite, bounce 6s ease-in-out infinite', animationDelay: '4s'}}></div>
        
        {/* Floating Shapes with Enhanced Movement */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-pink-300/40 to-rose-400/35 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'gentle-sway 20s ease-in-out infinite, spin 25s linear infinite'}}></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-l from-rose-300/45 to-pink-300/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'float-vertical 16s ease-in-out infinite, spin 30s linear infinite reverse', animationDelay: '5s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400/35 to-rose-300/45 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'drift-large 22s ease-in-out infinite, spin 20s linear infinite', animationDelay: '10s'}}></div>
        
        {/* Small Floating Particles with Dynamic Dance */}
        <div className="absolute top-20 left-1/5 w-4 h-4 bg-pink-400/80 rounded-full" style={{animation: 'particle-dance 8s ease-in-out infinite', animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/5 w-6 h-6 bg-rose-400/70 rounded-full" style={{animation: 'particle-dance 10s ease-in-out infinite', animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/6 w-3 h-3 bg-pink-500/90 rounded-full" style={{animation: 'particle-dance 6s ease-in-out infinite', animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-rose-500/80 rounded-full" style={{animation: 'particle-dance 7s ease-in-out infinite', animationDelay: '1.5s'}}></div>
        
        {/* Geometric Elements with Dynamic Movement */}
        <div className="absolute top-1/4 right-1/6 w-12 h-12 bg-pink-300/60 transform rotate-45" style={{animation: 'float-horizontal 12s ease-in-out infinite, spin 15s linear infinite'}}></div>
        <div className="absolute bottom-1/4 left-1/8 w-8 h-8 bg-rose-300/70 rounded-full" style={{animation: 'particle-dance 8s ease-in-out infinite', animationDelay: '3s'}}></div>
        <div className="absolute top-3/4 right-2/3 w-10 h-10 bg-pink-400/55 transform rotate-45" style={{animation: 'float-vertical 10s ease-in-out infinite, bounce 6s ease-in-out infinite', animationDelay: '2s'}}></div>
        
        {/* Large Slow Rotating Element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/20 via-rose-200/25 to-pink-200/20 rounded-full" style={{animation: 'gentle-sway 40s ease-in-out infinite, spin 60s linear infinite'}}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Enhanced Header Section */}
        <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100/50">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              Smart Grocery Shopping
            </h1>
            <p className="text-gray-600 text-lg">AI-powered shopping made simple and delightful</p>
          </div>
          {/* Enhanced Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-pink-200/50 rounded-xl shadow-sm focus:border-pink-400 focus:ring-pink-400/20 text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {/* Enhanced Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] h-12 bg-white/80 backdrop-blur-sm border-pink-200/50 rounded-xl shadow-sm focus:border-pink-400 focus:ring-pink-400/20">
                  <Filter className="h-4 w-4 mr-2 text-pink-500" />
                  <SelectValue placeholder="Sort by" className="text-gray-700" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-pink-200/50">
                  <SelectItem value="name" className="focus:bg-pink-50">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low" className="focus:bg-pink-50">Price (Low-High)</SelectItem>
                  <SelectItem value="price-high" className="focus:bg-pink-50">Price (High-Low)</SelectItem>
                </SelectContent>
              </Select>

              {/* Enhanced Upload Toggle */}
              <Button
                variant={showUpload ? 'default' : 'outline'}
                onClick={() => {
                  if (showUpload) {
                    setShowUpload(false);
                  } else {
                    setShowUpload(true);
                    setUploadStep('upload');
                    setProcessingProgress(0);
                    setParsedItems([]);
                  }
                }}
                className={`gap-3 px-6 h-12 rounded-xl font-medium transition-all duration-300 ${
                  showUpload 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-pink-500/25' 
                    : 'border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400'
                }`}
              >
                <Upload className="h-5 w-5" />
                {showUpload ? 'Hide Upload' : 'Upload List'}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Upload Section */}
        {showUpload && (
          <div className="mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-pink-100/50 transform transition-all duration-500 ease-out animate-in slide-in-from-top-5">
            {/* Step Indicator */}
            <div className="mb-4">
              <StepIndicator currentStep={uploadStep} />
            </div>
            
            {uploadStep === 'upload' && (
              <div className="mt-4 transform transition-all duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-5">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                    Upload Your Grocery List
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Take a photo or paste your handwritten grocery list
                  </p>
                </div>
                <UploadZone
                  onImageUpload={handleImageUpload}
                  onTextSubmit={handleTextSubmit}
                  isProcessing={false}
                />
              </div>
            )}

            {uploadStep === 'processing' && (
              <div className="mt-4 transform transition-all duration-500 ease-out animate-in fade-in-0">
                <ProcessingState
                  progress={processingProgress}
                  stage={processingStage}
                />
              </div>
            )}

            {uploadStep === 'review' && (
              <div className="mt-4 transform transition-all duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-5">
                <ReviewList
                  items={parsedItems}
                  onUpdateItem={handleUpdateItem}
                  onRemoveItem={handleRemoveItem}
                  onAddToCart={handleAddToCart}
                  onAddNewItem={handleAddNewItem}
                />
              </div>
            )}
          </div>
        )}



        {/* Category Tabs */}
        <Tabs defaultValue="All" className="w-full mb-8" onValueChange={setSelectedCategory}>
          <TabsList className="bg-white/80 backdrop-blur-sm border border-pink-200/50 rounded-xl p-2 shadow-lg flex-wrap h-auto gap-2">
            <TabsTrigger 
              value="All" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all duration-300"
            >
              All Products
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category}
                value={category}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all duration-300"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products by Category - Show when "All" is selected and no search */}
        {selectedCategory === 'All' && !searchQuery ? (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryProducts = productsByCategory[category] || [];
              
              return (
                <div key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {category}
                    </h2>
                    <div className="flex-1 h-1 bg-gradient-to-r from-pink-500/50 to-transparent rounded-full"></div>
                  </div>

                  {/* Category Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => {
                      const quantity = getItemQuantity(product.id);
                      
                      return (
                        <Card 
                          key={product.id} 
                          className="group transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 bg-white/85 backdrop-blur-lg border-pink-200/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/25" 
                        >
                          <CardContent className="p-6 relative overflow-hidden">
                            {/* Hover Background Animation */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/0 via-rose-50/30 to-pink-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="flex flex-col h-full relative z-10">
                              {/* Product Image with Hover Animation Only */}
                              <div className="text-7xl mb-4 text-center transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl"></div>
                                <span className="relative z-10 inline-block group-hover:drop-shadow-lg">{product.image}</span>
                              </div>
                              
                              {/* Stock Badge */}
                              {!product.inStock && (
                                <Badge variant="destructive" className="mb-3 w-fit bg-red-100 text-red-700 border-red-200">
                                  Out of Stock
                                </Badge>
                              )}

                              {/* Product Info with Hover Animations */}
                              <div className="flex-1 space-y-3">
                                <h3 className="font-bold text-xl text-gray-800 group-hover:text-pink-700 transition-all duration-300 group-hover:scale-105 transform origin-left">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300 transform group-hover:translate-x-1">
                                  {product.category}
                                </p>
                                <div className="flex items-baseline gap-2 transform group-hover:scale-105 transition-transform duration-300">
                                  <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:via-rose-700 group-hover:to-pink-800 transition-all duration-300">
                                    ${product.price.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">/ {product.unit}</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {quantity > 0 ? (
                                <div className="flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-rose-50/60 to-pink-50/80 backdrop-blur-sm rounded-xl p-3 border border-pink-200/60 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleRemoveFromCart(product.id)}
                                    className="h-10 w-10 rounded-full hover:bg-pink-200/60 text-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-pink-500/25"
                                  >
                                    <Minus className="h-5 w-5" />
                                  </Button>
                                  <span className="font-bold text-xl text-pink-700 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                    {quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleAddProductToCart(product)}
                                    className="h-10 w-10 rounded-full hover:bg-pink-200/60 text-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-pink-500/25"
                                    disabled={!product.inStock}
                                  >
                                    <Plus className="h-5 w-5" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  className="w-full h-12 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-500 shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 active:scale-95 relative overflow-hidden"
                                  onClick={() => handleAddProductToCart(product)}
                                  disabled={!product.inStock}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                                  <span>Add to Cart</span>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered Products Grid */
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory}
                <span className="text-gray-500 ml-2">({filteredProducts.length} items)</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const quantity = getItemQuantity(product.id);
                
                return (
                  <Card 
                    key={product.id} 
                    className="group transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 bg-white/85 backdrop-blur-lg border-pink-200/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/25" 
                  >
                    <CardContent className="p-6 relative overflow-hidden">
                      {/* Hover Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/0 via-rose-50/30 to-pink-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="flex flex-col h-full relative z-10">
                        {/* Product Image with Hover Animation Only */}
                        <div className="text-7xl mb-4 text-center transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl"></div>
                          <span className="relative z-10 inline-block group-hover:drop-shadow-lg">{product.image}</span>
                        </div>
                        
                        {/* Stock Badge */}
                        {!product.inStock && (
                          <Badge variant="destructive" className="mb-3 w-fit bg-red-100 text-red-700 border-red-200">
                            Out of Stock
                          </Badge>
                        )}

                        {/* Product Info with Hover Animations */}
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-xl text-gray-800 group-hover:text-pink-700 transition-all duration-300 group-hover:scale-105 transform origin-left">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300 transform group-hover:translate-x-1">
                            {product.category}
                          </p>
                          <div className="flex items-baseline gap-2 transform group-hover:scale-105 transition-transform duration-300">
                            <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:via-rose-700 group-hover:to-pink-800 transition-all duration-300">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">/ {product.unit}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {quantity > 0 ? (
                          <div className="flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-rose-50/60 to-pink-50/80 backdrop-blur-sm rounded-xl p-3 border border-pink-200/60 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveFromCart(product.id)}
                              className="h-10 w-10 rounded-full hover:bg-pink-200/60 text-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-pink-500/25"
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                            <span className="font-bold text-xl text-pink-700 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                              {quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleAddProductToCart(product)}
                              className="h-10 w-10 rounded-full hover:bg-pink-200/60 text-pink-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-pink-500/25"
                              disabled={!product.inStock}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full h-12 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-500 shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 active:scale-95 relative overflow-hidden"
                            onClick={() => handleAddProductToCart(product)}
                            disabled={!product.inStock}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <Plus className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                            <span>Add to Cart</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Animated Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000">
            <div className="text-9xl mb-6 animate-bounce inline-block transform hover:scale-110 transition-transform duration-500">🛒</div>
            <div className="space-y-4">
              <p className="text-gray-500 text-2xl font-semibold animate-in slide-in-from-left-6 duration-700" style={{animationDelay: '200ms'}}>
                No products found
              </p>
              <p className="text-sm text-gray-400 animate-in slide-in-from-right-6 duration-700" style={{animationDelay: '400ms'}}>
                Try adjusting your search or filters
              </p>
              <div className="mt-8 animate-in fade-in-0 duration-1000" style={{animationDelay: '600ms'}}>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Animated Cart Summary Footer */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t-2 border-pink-300/60 shadow-2xl z-50 animate-in slide-in-from-bottom-full duration-700 hover:bg-white/98 transition-all">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-pulse"></div>
          
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between group">
              <div className="space-y-1 transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-gray-600 font-medium animate-in fade-in-0 slide-in-from-left-4">
                  <span className="inline-block animate-pulse bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-bold">
                    {itemCount}
                  </span>
                  {" "}items in cart
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-left-8 duration-500 group-hover:scale-110 transition-transform">
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
              <Link to="/cart" className="group/link">
                <Button 
                  size="lg" 
                  className="gap-3 px-8 h-14 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-pink-500/40 transform hover:scale-110 active:scale-95 animate-in slide-in-from-right-8 duration-700 group-hover/link:animate-pulse relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10">View Cart</span>
                  <ShoppingCart className="h-5 w-5 relative z-10 group-hover/link:rotate-12 group-hover/link:scale-110 transition-transform duration-300" />
                  
                  {/* Floating Badge Animation */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800 animate-bounce border-2 border-white shadow-lg">
                    {itemCount}
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default ShopPage;