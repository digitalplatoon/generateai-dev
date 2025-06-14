
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface LearningPreferencesStepProps {
  onComplete: () => void;
}

export const LearningPreferencesStep: React.FC<LearningPreferencesStepProps> = ({ onComplete }) => {
  const { updatePreferences } = useUserPreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    learning_pace: 'normal' as 'slow' | 'normal' | 'fast',
    preferred_role: 'Beginner',
    preferred_tech_stack: 'Python',
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await updatePreferences(preferences);
      onComplete();
    } catch (error) {
      console.error('Preferences update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Learning Preferences</h2>
        <p className="text-muted-foreground">
          Help us customize your learning experience.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold">Learning Pace</Label>
          <RadioGroup
            value={preferences.learning_pace}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, learning_pace: value as any }))}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="slow" id="slow" />
              <Label htmlFor="slow">Slow - Take my time with each concept</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal">Normal - Balanced learning approach</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fast" id="fast" />
              <Label htmlFor="fast">Fast - Quick progression through topics</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="role" className="text-base font-semibold">Experience Level</Label>
          <Select value={preferences.preferred_role} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_role: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner - New to AI</SelectItem>
              <SelectItem value="Intermediate">Intermediate - Some AI experience</SelectItem>
              <SelectItem value="Advanced">Advanced - Experienced with AI</SelectItem>
              <SelectItem value="Expert">Expert - AI Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tech-stack" className="text-base font-semibold">Preferred Technology</Label>
          <Select value={preferences.preferred_tech_stack} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_tech_stack: value }))}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your preferred tech stack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="JavaScript">JavaScript/TypeScript</SelectItem>
              <SelectItem value="R">R</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="C++">C++</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onComplete} className="flex-1">
          Skip for Now
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};
