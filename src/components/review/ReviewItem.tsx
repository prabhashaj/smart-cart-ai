import { useState } from 'react';
import { Check, AlertCircle, RefreshCw, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ParsedItem, Product } from '@/types/grocery';
import { searchProducts } from '@/lib/nlp';
import { cn } from '@/lib/utils';

interface ReviewItemProps {
  item: ParsedItem;
  onUpdate: (id: string, updates: Partial<ParsedItem>) => void;
  onRemove: (id: string) => void;
}

export function ReviewItem({ item, onUpdate, onRemove }: ReviewItemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchProducts(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectProduct = (product: Product) => {
    onUpdate(item.id, {
      matchedProduct: product,
      status: 'matched',
      confidence: 1,
      unit: product.unit,
    });
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0.5, item.quantity + delta);
    onUpdate(item.id, { quantity: newQuantity });
  };

  const statusConfig = {
    matched: { icon: Check, color: 'text-green-600', bg: 'bg-green-50', label: 'Matched' },
    partial: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Partial Match' },
    unmatched: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Not Found' },
  };

  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <Card className={cn('transition-all hover:shadow-md', status.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Icon */}
          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-card flex items-center justify-center text-2xl">
            {item.matchedProduct?.image || '📦'}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-foreground truncate">
                {item.matchedProduct?.name || item.name}
              </h4>
              <Badge variant="outline" className={cn('text-xs', status.color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Original: "{item.rawText}"
            </p>

            {/* Product Selection */}
            {item.status !== 'matched' && (
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Find Product
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2" align="start">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="h-8"
                    />
                    {searchResults.length > 0 && (
                      <div className="max-h-48 overflow-auto space-y-1">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                          >
                            <span className="text-xl">{product.image}</span>
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ${product.price.toFixed(2)} / {product.unit}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {item.alternativeProducts && item.alternativeProducts.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="text-xs text-muted-foreground mb-1">Suggestions:</p>
                        <div className="space-y-1">
                          {item.alternativeProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleSelectProduct(product)}
                              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                            >
                              <span className="text-xl">{product.image}</span>
                              <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${product.price.toFixed(2)} / {product.unit}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-0.5)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(0.5)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
          </div>

          {/* Price */}
          {item.matchedProduct && (
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ${(item.matchedProduct.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                ${item.matchedProduct.price.toFixed(2)}/{item.unit}
              </p>
            </div>
          )}

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
