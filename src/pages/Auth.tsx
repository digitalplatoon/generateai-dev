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
import SEOHead from '@/components/seo/SEOHead';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { lovable } from '@/integrations/lovable/index';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPasswordReset, setShowPasswordReset] = useState(false);

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
        setError(null);
        setSuccessMessage('Please check your email to confirm your account!');
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
    <>
      <SEOHead
        title="Sign In / Sign Up - GenerateAI.dev"
        description="Access your GenerateAI.dev account or create a new one to start building with our AI development platform."
        keywords="sign in, sign up, login, register, authentication, developer account"
        canonical="https://generateai.dev/auth"
      />
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

          {showPasswordReset ? (
            <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4 border-white/20 text-white hover:bg-white/10 flex items-center justify-center gap-2 py-6"
                onClick={async () => {
                  setIsLoading(true);
                  setError(null);
                  try {
                    const result = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin,
                    });
                    if (result.error) {
                      setError(result.error.message || 'Google sign-in failed');
                    }
                    if (result.redirected) return;
                  } catch (err) {
                    setError('Google sign-in failed. Please try again.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <Separator className="flex-1 bg-white/10" />
                <span className="text-light-gray text-sm">or</span>
                <Separator className="flex-1 bg-white/10" />
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
                  <CardFooter className="flex-col gap-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="text-light-gray hover:text-white"
                      onClick={() => setShowPasswordReset(true)}
                    >
                      Forgot your password?
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
            </>
          )}

          {successMessage && (
            <Alert className="mt-4 border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-400">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mt-4 border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default Auth;
