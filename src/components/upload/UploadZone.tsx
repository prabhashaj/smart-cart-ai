import { useState, useCallback } from 'react';
import { Upload, Image, FileText, Type, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
  onTextSubmit: (text: string) => void;
  isProcessing: boolean;
}

export function UploadZone({ onImageUpload, onTextSubmit, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleProcessImage = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleTextProcess = () => {
    if (textInput.trim()) {
      onTextSubmit(textInput.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="image" className="gap-2">
              <Image className="h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-0">
            {!previewImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer',
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50 hover:bg-muted/30'
                )}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      Drop your grocery list here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" /> Images
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" /> PDFs
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-muted">
                  <img
                    src={previewImage}
                    alt="Uploaded grocery list"
                    className="w-full max-h-80 object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleClearImage}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : 'Extract Grocery Items'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <div className="space-y-4">
              <Textarea
                placeholder="Paste or type your grocery list here...

Example:
2 kg apples
1 liter milk
500g chicken breast
3 tomatoes
1 loaf bread"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[240px] resize-none"
                disabled={isProcessing}
              />
              <Button
                onClick={handleTextProcess}
                disabled={isProcessing || !textInput.trim()}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Processing...' : 'Process Grocery List'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
