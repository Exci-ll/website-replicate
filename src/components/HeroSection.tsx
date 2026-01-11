import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-4 md:mx-6 rounded-3xl gradient-lime p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            see what's being{" "}
            <span className="text-underline-sketch">said about you</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8">
            Check if you've been posted on Tea, the anonymous dating review app with 11M+ women sharing experiences. 🍵
          </p>
          
          {/* Avatar Group */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <img 
                src="https://i.pravatar.cc/40?img=52" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-card"
              />
              <img 
                src="https://i.pravatar.cc/40?img=22" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-card"
              />
              <img 
                src="https://i.pravatar.cc/40?img=23" 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-card"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              <strong>50,000+</strong> guys have checked
            </span>
          </div>
        </div>

        {/* Right CTA Card */}
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <span className="text-4xl">🍵</span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Have you been posted?</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">
              Find out what women are saying about you on Tea
            </p>
            
            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                🔒 Anonymous
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                ⚡ Instant
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm font-medium">
                🎯 94% Accurate
              </span>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => navigate("/search")}
              className="w-full bg-foreground text-card rounded-xl py-4 px-6 flex items-center justify-between font-semibold hover:opacity-90 transition-opacity"
            >
              <div className="text-left">
                <div className="text-lg">Check now</div>
                <div className="text-sm opacity-70 font-normal">Get your report in 3 min</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              <strong className="text-lime-dark">50,000+</strong> guys found answers – will you? 👆
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
