import { useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="w-full py-4 px-4 md:px-6 flex items-center justify-between bg-[#f5f0e8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center">
            <span className="text-lg">🍵</span>
          </div>
          <span className="font-bold text-foreground">tea checker</span>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 rounded-full border-foreground/20 bg-card hover:bg-muted text-sm"
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
