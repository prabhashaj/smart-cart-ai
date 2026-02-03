import { Loader2, Scan, Brain, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProcessingStateProps {
  progress: number;
  stage: 'ocr' | 'nlp' | 'matching';
}

const stages = [
  { key: 'ocr', label: 'Extracting Text', icon: Scan, description: 'Reading your grocery list...' },
  { key: 'nlp', label: 'Parsing Items', icon: Brain, description: 'Identifying items and quantities...' },
  { key: 'matching', label: 'Finding Products', icon: CheckCircle, description: 'Matching with store catalog...' },
];

export function ProcessingState({ progress, stage }: ProcessingStateProps) {
  const currentStageIndex = stages.findIndex((s) => s.key === stage);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">Processing Your List</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Our AI is analyzing your grocery list
            </p>
          </div>

          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>

          <div className="w-full space-y-3">
            {stages.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.key === stage;
              const isComplete = index < currentStageIndex;

              return (
                <div
                  key={s.key}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    isActive && 'bg-primary/10',
                    isComplete && 'opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                      isComplete && 'bg-primary/50 text-primary-foreground'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
