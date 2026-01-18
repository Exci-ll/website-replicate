import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 md:px-6 mb-8">
      {/* Separator line above section */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="mx-6 border-t-2 border-gray-400" />
      </div>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to find out?
        </h2>
        <p className="text-muted-foreground mb-8">
          2 minutes. 100% confidential.
        </p>
        
        <button 
          onClick={() => navigate("/search")}
          className="inline-flex items-center gap-3 bg-gray-900 text-white rounded-full py-4 px-8 font-semibold text-lg hover:bg-gray-800 transition-colors relative overflow-hidden group"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
          <span className="relative z-10">Check now</span>
          <div className="w-8 h-8 bg-[#c8e972] rounded-full flex items-center justify-center relative z-10">
            <ArrowRight className="w-4 h-4 text-gray-900" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default CTASection;
