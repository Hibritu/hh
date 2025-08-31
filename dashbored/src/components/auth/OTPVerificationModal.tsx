import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, ArrowLeft, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export const OTPVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationSuccess 
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP format
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyEmail(email, otp);
      
      // Check if verification was successful
      if (response?.success || response?.message) {
        toast({
          title: "Email verified!",
          description: response.message || "Your account has been successfully verified. You can now sign in.",
        });
        onVerificationSuccess();
        onClose();
      } else {
        throw new Error("Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      // Handle specific error cases
      let errorMessage = "Invalid or expired OTP code. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Focus back on input for better UX
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResending || timeLeft > 0) return;
    
    setIsResending(true);
    try {
      const response = await authAPI.resendOtp(email);
      
      if (response?.success || response?.message) {
        toast({
          title: "OTP resent",
          description: response.message || "A new verification code has been sent to your email.",
        });
        
        // Clear any existing interval
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
        
        // Start countdown
        setTimeLeft(60);
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error("Failed to resend OTP");
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      
      let errorMessage = "Failed to resend verification code. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    
    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleVerify(e);
    }
  };
  
  // Handle paste event for better UX
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setOtp(pastedData);
      // Auto-submit if we have 6 digits
      if (pastedData.length === 6) {
        handleVerify(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Verify Your Email
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit verification code to<br />
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  ref={inputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  onPaste={handlePaste}
                  className="text-center text-2xl font-mono tracking-widest h-14"
                  maxLength={6}
                  required
                  disabled={isLoading}
                  aria-label="Enter 6-digit verification code"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                variant="premium"
                disabled={isLoading || otp.length !== 6}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verifying...
                  </>
                ) : 'Verify Email'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending || timeLeft > 0}
                className="text-sm h-9 px-3"
                aria-label={timeLeft > 0 ? `Resend code in ${timeLeft} seconds` : 'Resend verification code'}
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : timeLeft > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5" />
                    Resend in {timeLeft}s
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Resend code
                  </span>
                )}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};