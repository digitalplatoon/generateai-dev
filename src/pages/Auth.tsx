
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { authSchema, sanitizeText } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = (formData: FormData, isSignUp: boolean) => {
    const data = {
      email: sanitizeText(formData.get('email') as string),
      password: formData.get('password') as string,
      ...(isSignUp && { fullName: sanitizeText(formData.get('fullName') as string) }),
    };

    try {
      authSchema.parse(data);
      setValidationErrors({});
      return data;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.errors?.forEach((error: any) => {
        errors[error.path[0]] = error.message;
      });
      setValidationErrors(errors);
      return null;
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const validatedData = validateForm(formData, false);

    if (!validatedData) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(validatedData.email, validatedData.password);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign In Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const validatedData = validateForm(formData, true);

    if (!validatedData) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(validatedData.email, validatedData.password, {
        full_name: validatedData.fullName
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created",
          description: "Please check your email to confirm your account!",
        });
        setError('Please check your email to confirm your account!');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/95 to-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold">G</span>
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              GenerateAI.dev
            </span>
          </div>
          <p className="text-light-gray">Welcome to the future of AI development</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-navy/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Sign In</CardTitle>
                <CardDescription className="text-light-gray">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      className="bg-navy border-white/20 text-white"
                      placeholder="your@email.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      className="bg-navy border-white/20 text-white"
                      placeholder="••••••••"
                    />
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm">{validationErrors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-navy/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-light-gray">
                  Join GenerateAI.dev and start building
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      required
                      className="bg-navy border-white/20 text-white"
                      placeholder="John Doe"
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-400 text-sm">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="bg-navy border-white/20 text-white"
                      placeholder="your@email.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      className="bg-navy border-white/20 text-white"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm">{validationErrors.password}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert className="mt-4 border-red-500/20 bg-red-500/10">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Auth;
