import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple validation for demo - in real app this would be API call
    if (username === "admin" && password === "password") {
      toast({
        title: "Login Successful!",
        description: "Welcome to Reckkit",
      });
      
      // Smooth redirect with loading animation
      setTimeout(() => {
        navigate("/upload");
      }, 1000);
    } else {
      setIsLoading(false);
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-bounce"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center animate-slide-up">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-bounce-in">
                <span className="text-2xl font-bold text-white">R</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent animate-bounce-in">
                Reckkit
              </h1>
              <p className="text-muted-foreground mt-3 text-lg">Professional PDF Validation Platform</p>
            </div>
          </div>

          <Card className="card-reckkit animate-bounce-in backdrop-blur-sm bg-card/95 border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Enter your credentials to access the validation platform
              </CardDescription>
            </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                  Username
                </Label>
                <div className="relative group">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-reckkit h-12 text-base group-hover:shadow-lg transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-reckkit h-12 text-base pr-12 group-hover:shadow-lg transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  "Sign In to Reckkit"
                )}
              </Button>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  className="text-primary hover:text-secondary transition-all duration-200 text-sm font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid"
                  onClick={() => toast({ title: "Reset link sent!", description: "Check your email for password reset instructions." })}
                >
                  Forgot your password?
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

          <div className="text-center bg-accent/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">Demo Credentials</p>
            <p className="text-xs text-muted-foreground">Username: <span className="font-mono text-primary">admin</span> • Password: <span className="font-mono text-primary">password</span></p>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Login Failed</AlertDialogTitle>
            <AlertDialogDescription>
              Invalid username or password. Please check your credentials and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowErrorDialog(false)} variant="outline">
              Try Again
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;