import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout';
import { StepIndicator } from '../components/layout/StepIndicator';
import { UploadZone } from '../components/upload/UploadZone';
import { ProcessingState } from '../components/upload/ProcessingState';
import { ReviewList } from '../components/review/ReviewList';
import { UploadStep, ParsedItem, Product, CartItem } from '../types/grocery';
import { extractTextFromImage, preprocessImage } from '../lib/ocr';
import { parseGroceryList } from '../lib/nlp';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function UploadPage() {
  const navigate = useNavigate();
  const { setCart } = useCart();
  const [step, setStep] = useState<UploadStep>('upload');
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'ocr' | 'nlp' | 'matching'>('ocr');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);

  const handleImageUpload = async (file: File) => {
    setStep('processing');
    setProgress(0);
    setProcessingStage('ocr');

    try {
      // Preprocess image
      const preprocessedImage = await preprocessImage(file);
      setProgress(10);

      // OCR
      const ocrResult = await extractTextFromImage(preprocessedImage, (p) => {
        setProgress(10 + Math.round(p * 0.5));
      });
      setProgress(60);
      setProcessingStage('nlp');

      // Simulate NLP processing time
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(75);
      setProcessingStage('matching');

      // Parse grocery list
      const items = parseGroceryList(ocrResult.text);
      setProgress(90);

      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(100);

      setParsedItems(items);
      setStep('review');

      if (items.length === 0) {
        toast.warning('No items detected. Try a clearer image or paste text directly.');
      } else {
        const matched = items.filter((i) => i.status === 'matched').length;
        toast.success(`Found ${items.length} items (${matched} matched)`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process image. Please try again.');
      setStep('upload');
    }
  };

  const handleTextSubmit = async (text: string) => {
    setStep('processing');
    setProgress(0);
    setProcessingStage('nlp');

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(50);
      setProcessingStage('matching');

      const items = parseGroceryList(text);
      setProgress(90);

      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(100);

      setParsedItems(items);
      setStep('review');

      if (items.length === 0) {
        toast.warning('No items detected. Check your list format.');
      } else {
        const matched = items.filter((i) => i.status === 'matched').length;
        toast.success(`Found ${items.length} items (${matched} matched)`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process text. Please try again.');
      setStep('upload');
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
      <StepIndicator currentStep={step} />

      <div className="mt-8">
        {step === 'upload' && (
          <UploadZone
            onImageUpload={handleImageUpload}
            onTextSubmit={handleTextSubmit}
            isProcessing={false}
          />
        )}

        {step === 'processing' && (
          <ProcessingState progress={progress} stage={processingStage} />
        )}

        {step === 'review' && (
          <ReviewList
            items={parsedItems}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onAddToCart={handleAddToCart}
            onAddNewItem={handleAddNewItem}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
