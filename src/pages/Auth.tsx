import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Stethoscope, AlertCircle, CheckCircle, Mail } from 'lucide-react';

// Clean up auth state utility
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowEmailConfirmation(false);
    setConfirmationEmail('');
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out attempt during test login:', err);
      }

      // Create a mock session for testing
      const mockUser = {
        id: 'test-user-id',
        email: 'user@deep.com',
        user_metadata: {
          full_name: 'Test User'
        },
        email_confirmed_at: new Date().toISOString()
      };

      // Store mock session in localStorage for testing
      localStorage.setItem('mock_auth_session', JSON.stringify(mockUser));
      
      toast.success('Test login successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Test login error:', error);
      toast.error('Test login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for hardcoded test credentials
    if (email === 'user@deep.com' && password === 'deephealth') {
      await handleTestLogin();
      return;
    }

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out attempt during sign in:', err);
      }

      console.log('Attempting to sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link before signing in.');
          setShowEmailConfirmation(true);
          setConfirmationEmail(email);
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.email);
        toast.success('Signed in successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Clean up any existing auth state first
      cleanupAuthState();
      
      console.log('Attempting to sign up with:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
          setActiveTab('signin');
          resetForm();
        } else if (error.message.includes('rate_limit') || error.message.includes('email_send_rate_limit')) {
          toast.error('Too many signup attempts. Please wait a few minutes and try again.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        console.log('Sign up successful:', data.user.email);
        setConfirmationEmail(email);
        
        if (data.user.email_confirmed_at) {
          // Email already confirmed, user is logged in
          toast.success('Account created and signed in successfully!');
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        } else {
          // Email confirmation required
          toast.success('Account created successfully! Please check your email to confirm your account.');
          setShowEmailConfirmation(true);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: confirmationEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error('Please wait before requesting another confirmation email.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Confirmation email sent! Please check your inbox.');
      }
    } catch (error) {
      console.error('Error resending confirmation:', error);
      toast.error('Failed to resend confirmation email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a confirmation link to <strong>{confirmationEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Click the link in your email to confirm your account.</p>
                <p>After confirming, return here to sign in.</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleResendConfirmation}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend confirmation email'
                  )}
                </Button>
                
                <Button
                  onClick={() => {
                    setShowEmailConfirmation(false);
                    setActiveTab('signin');
                  }}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-medical-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Deepai EMR</h1>
          <p className="text-gray-600 mt-2">Electronic Medical Records System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
