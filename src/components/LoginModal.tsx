import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login with email:", email);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-12 bg-[#c8e972] rounded-lg flex items-center justify-center border border-gray-900">
              <span className="text-3xl">🍵</span>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome back
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Sign in with your email to view your results
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-lime"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-foreground text-card hover:opacity-90 font-semibold flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            No report yet?{" "}
            <button 
              onClick={() => {
                onClose();
                navigate("/search");
              }}
              className="text-foreground underline hover:opacity-80"
            >
              Start a new search
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
