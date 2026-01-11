import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 md:px-6 mb-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to find out?
        </h2>
        <p className="text-muted-foreground mb-8">
          Takes less than 2 minutes. 100% confidential.
        </p>
        
        <button 
          onClick={() => navigate("/search")}
          className="inline-flex items-center gap-3 bg-foreground text-card rounded-full py-4 px-8 font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          Check if you've been posted
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default CTASection;
