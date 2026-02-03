import { useState } from 'react';
import { ShoppingCart, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReviewItem } from './ReviewItem';
import { ParsedItem, Product } from '@/types/grocery';
import { searchProducts } from '@/lib/nlp';

interface ReviewListProps {
  items: ParsedItem[];
  onUpdateItem: (id: string, updates: Partial<ParsedItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: () => void;
  onAddNewItem: (product: Product, quantity: number) => void;
}

export function ReviewList({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddToCart,
  onAddNewItem,
}: ReviewListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const matchedItems = items.filter((item) => item.status === 'matched');
  const partialItems = items.filter((item) => item.status === 'partial');
  const unmatchedItems = items.filter((item) => item.status === 'unmatched');

  const estimatedTotal = items
    .filter((item) => item.matchedProduct)
    .reduce((sum, item) => sum + (item.matchedProduct!.price * item.quantity), 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchProducts(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddProduct = (product: Product) => {
    onAddNewItem(product, 1);
    setIsAddOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Summary Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Review Your Items</h2>
              <p className="text-muted-foreground">
                We found {items.length} items in your list
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated Total</p>
                <p className="text-2xl font-bold text-primary">
                  ${estimatedTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{matchedItems.length} matched</span>
            </div>
            {partialItems.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">{partialItems.length} partial</span>
              </div>
            )}
            {unmatchedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm">{unmatchedItems.length} not found</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <ReviewItem
            key={item.id}
            item={item}
            onUpdate={onUpdateItem}
            onRemove={onRemoveItem}
          />
        ))}
      </div>

      {/* Add New Item */}
      <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Another Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="center">
          <div className="space-y-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="max-h-64 overflow-auto space-y-1">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-xl">{product.image}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${product.price.toFixed(2)} / {product.unit}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Add to Cart Button */}
      <Button
        onClick={onAddToCart}
        size="lg"
        className="w-full gap-2"
        disabled={matchedItems.length === 0}
      >
        <ShoppingCart className="h-5 w-5" />
        Add {matchedItems.length} Items to Cart
      </Button>
    </div>
  );
}
