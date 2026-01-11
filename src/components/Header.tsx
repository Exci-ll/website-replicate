import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍵</span>
          <span className="font-bold text-lg text-foreground">tea checker</span>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 rounded-full border-foreground/20 bg-card hover:bg-muted"
          onClick={() => setIsLoginOpen(true)}
        >
          <LogIn className="w-4 h-4" />
          Login
        </Button>
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
