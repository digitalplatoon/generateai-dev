import { useState } from 'react';
import { Copy, Check, Sparkles, Code, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SeoGeneratedPrompt } from '@/types/seo';

interface PromptViewerProps {
  prompts: SeoGeneratedPrompt[];
  onGenerate: () => Promise<unknown>;
  isGenerating: boolean;
  hasIssues: boolean;
}

const promptTypeConfig = {
  lovable_fix: { 
    label: 'Lovable Fix', 
    icon: Sparkles, 
    description: 'Optimized for Lovable AI editor' 
  },
  developer_fix: { 
    label: 'Developer Fix', 
    icon: Code, 
    description: 'Technical implementation guide' 
  },
  content_seo: { 
    label: 'Content/SEO', 
    icon: FileText, 
    description: 'Content optimization recommendations' 
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
}

export function PromptViewer({ prompts, onGenerate, isGenerating, hasIssues }: PromptViewerProps) {
  const promptsByType = {
    lovable_fix: prompts.filter(p => p.prompt_type === 'lovable_fix'),
    developer_fix: prompts.filter(p => p.prompt_type === 'developer_fix'),
    content_seo: prompts.filter(p => p.prompt_type === 'content_seo'),
  };

  if (prompts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Prompts Generated Yet</h3>
          <p className="text-muted-foreground mb-4">
            {hasIssues 
              ? 'Generate AI-powered fix prompts based on the scan issues.'
              : 'Run a scan first to identify issues, then generate prompts.'}
          </p>
          <Button onClick={onGenerate} disabled={isGenerating || !hasIssues}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Prompts
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Generated Prompts</h3>
        <Button variant="outline" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="lovable_fix">
        <TabsList className="grid w-full grid-cols-3">
          {(Object.keys(promptTypeConfig) as Array<keyof typeof promptTypeConfig>).map((type) => {
            const config = promptTypeConfig[type];
            const Icon = config.icon;
            return (
              <TabsTrigger key={type} value={type} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(promptTypeConfig) as Array<keyof typeof promptTypeConfig>).map((type) => {
          const typePrompts = promptsByType[type];
          const config = promptTypeConfig[type];
          
          return (
            <TabsContent key={type} value={type}>
              {typePrompts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No {config.label.toLowerCase()} prompts generated yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {typePrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader className="py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {config.label} Prompt
                        </CardTitle>
                        <CopyButton text={prompt.prompt_content} />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ScrollArea className="h-[400px]">
                          <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg">
                            {prompt.prompt_content}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
