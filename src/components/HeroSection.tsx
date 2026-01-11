import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="mx-4 md:mx-6 rounded-3xl bg-[#c8e972] p-6 md:p-10 lg:p-14">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            see what's being{" "}
            <span className="text-underline-sketch">said about you</span>
          </h1>
          <p className="text-base md:text-lg text-gray-800 mb-6">
            Check if you've been posted on Tea, the anonymous dating review app with 11M+ women sharing experiences. 🍵
          </p>
          
          {/* Avatar Group */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img 
                src="https://i.pravatar.cc/40?img=52" 
                alt="User" 
                className="w-9 h-9 rounded-full border-2 border-white"
              />
              <img 
                src="https://i.pravatar.cc/40?img=22" 
                alt="User" 
                className="w-9 h-9 rounded-full border-2 border-white"
              />
              <img 
                src="https://i.pravatar.cc/40?img=23" 
                alt="User" 
                className="w-9 h-9 rounded-full border-2 border-white"
              />
            </div>
            <span className="text-sm text-gray-800">
              <strong>50,000+</strong> guys have checked
            </span>
          </div>
        </div>

        {/* Right CTA Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-center mb-3">
              <div className="w-10 h-10 bg-[#c8e972]/30 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🍵</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1 text-gray-900">Have you been posted?</h2>
            <p className="text-gray-500 text-center text-sm mb-5">
              Find out what women are saying about you on Tea
            </p>
            
            {/* Badges */}
            <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium">
                🔒 Anonymous
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium">
                ⚡ Instant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium">
                🎯 94% Accurate
              </span>
            </div>

            {/* CTA Button - Black like original with shine effect */}
            <button 
              onClick={() => navigate("/search")}
              className="w-full bg-gray-900 text-white rounded-xl py-3.5 px-5 flex items-center justify-between font-semibold hover:bg-gray-800 transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
              <div className="text-left relative z-10">
                <div className="text-base">Check now</div>
                <div className="text-xs opacity-70 font-normal">Get your report in 3 min</div>
              </div>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              <strong className="text-[#9cbd4a]">50,000+</strong> guys found answers – will you? 👆
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;