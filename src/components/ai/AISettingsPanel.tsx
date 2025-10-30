
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAISettings } from '@/hooks/useAISettings';
import { Loader2, Shield, Clock, Brain, Zap } from 'lucide-react';

const AISettingsPanel = () => {
  const { settings, isLoading, updateSettings } = useAISettings();

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const handleTemperatureChange = (value: number[]) => {
    updateSettings({ temperature: value[0] });
  };

  const handleMaxTokensChange = (value: number[]) => {
    updateSettings({ max_tokens: value[0] });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Settings & Preferences
        </CardTitle>
        <CardDescription>
          Customize your AI interaction experience and data preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Output Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Output Controls</h3>
          </div>
          
          <div className="space-y-3">
            <Label>Temperature: {settings?.temperature?.toFixed(2) || 0.7}</Label>
            <Slider
              value={[settings?.temperature || 0.7]}
              onValueChange={handleTemperatureChange}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Controls creativity. Higher values make output more random, lower values more focused.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Max Tokens: {settings?.max_tokens || 1000}</Label>
            <Slider
              value={[settings?.max_tokens || 1000]}
              onValueChange={handleMaxTokensChange}
              max={4000}
              min={100}
              step={100}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Maximum length of AI responses. Higher values allow longer responses.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="model-select">Preferred Model</Label>
            <Select
              value={settings?.preferred_model || 'gpt-4o-mini'}
              onValueChange={(value) => updateSettings({ preferred_model: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast & Efficient)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Most Capable)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Balanced)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Quick)</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <Separator />

        {/* Privacy & Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Privacy & Security</h3>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="do-not-train"
              checked={settings?.do_not_train_consent || true}
              onCheckedChange={(checked) => updateSettings({ do_not_train_consent: checked })}
            />
            <Label htmlFor="do-not-train">Do not use my data for training</Label>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default AISettingsPanel;
