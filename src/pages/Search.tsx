import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuizStep {
  id: string;
  question: string;
  emoji: string;
  placeholder: string;
  subtitle: string;
  proTip?: string;
}

const quizSteps: QuizStep[] = [
  {
    id: "name",
    question: "What's your first name?",
    emoji: "👋",
    placeholder: "Enter your first name",
    subtitle: "Or the name/nickname you use on dating apps",
    proTip: "We'll also search for common nicknames and variations of your name to ensure we don't miss any posts.",
  },
  {
    id: "age",
    question: "How old are you?",
    emoji: "🎂",
    placeholder: "Enter your age",
    subtitle: "This helps us narrow down the search results",
    proTip: "Age is one of the most common identifiers used in Tea posts.",
  },
  {
    id: "city",
    question: "What city do you live in?",
    emoji: "📍",
    placeholder: "Enter your city",
    subtitle: "We'll search posts in your area",
    proTip: "Most Tea posts mention the guy's location or where they met.",
  },
  {
    id: "dating_apps",
    question: "Which dating apps do you use?",
    emoji: "💘",
    placeholder: "e.g., Tinder, Hinge, Bumble",
    subtitle: "Select all that apply",
    proTip: "Women often mention which app they met someone on.",
  },
  {
    id: "height",
    question: "How tall are you?",
    emoji: "📏",
    placeholder: "e.g., 5'10\" or 178cm",
    subtitle: "Height is often mentioned in Tea posts",
  },
  {
    id: "job",
    question: "What do you do for work?",
    emoji: "💼",
    placeholder: "Enter your job title",
    subtitle: "Occupation is a common identifier",
  },
  {
    id: "ethnicity",
    question: "What's your ethnicity?",
    emoji: "🌍",
    placeholder: "Select your ethnicity",
    subtitle: "Helps improve search accuracy",
  },
  {
    id: "relationship",
    question: "What are you looking for?",
    emoji: "💕",
    placeholder: "e.g., Relationship, Casual, Not sure",
    subtitle: "This is often discussed in Tea posts",
  },
  {
    id: "instagram",
    question: "What's your Instagram handle?",
    emoji: "📸",
    placeholder: "@yourusername",
    subtitle: "Optional - helps find linked posts",
    proTip: "Instagram handles are sometimes shared in Tea posts.",
  },
  {
    id: "phone",
    question: "Last 4 digits of your phone?",
    emoji: "📱",
    placeholder: "XXXX",
    subtitle: "For verification purposes only",
    proTip: "We never store or share your phone number.",
  },
  {
    id: "email",
    question: "What's your email?",
    emoji: "📧",
    placeholder: "Enter your email",
    subtitle: "We'll send your report here",
    proTip: "Your email is kept 100% confidential.",
  },
  {
    id: "searching",
    question: "Searching the Tea database...",
    emoji: "🔍",
    placeholder: "",
    subtitle: "This may take a moment",
  },
];

const Search = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");

  const step = quizSteps[currentStep];
  const totalSteps = quizSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (inputValue.trim() || step.id === "searching") {
      setAnswers({ ...answers, [step.id]: inputValue });
      
      if (currentStep === totalSteps - 1) {
        // Navigate to checkout
        navigate("/checkout", { state: { answers: { ...answers, [step.id]: inputValue } } });
      } else if (step.id === "searching") {
        // Auto-advance after searching animation
        setTimeout(() => {
          navigate("/checkout", { state: { answers } });
        }, 3000);
      } else {
        setCurrentStep(currentStep + 1);
        setInputValue("");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInputValue(answers[quizSteps[currentStep - 1].id] || "");
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleNext();
    }
  };

  // Auto-advance for searching step
  if (step.id === "searching") {
    setTimeout(() => {
      navigate("/checkout", { state: { answers } });
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-4 px-6 relative">
        <button 
          onClick={handleBack}
          className="absolute left-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🍵</span>
          <span className="font-bold text-foreground">tea checker</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <div className="flex gap-1">
          {quizSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-lime" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-8 max-w-lg mx-auto w-full">
        <div className="w-full space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {step.question}
          </h1>

          {step.id !== "searching" ? (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  {step.emoji}
                </span>
                <Input
                  type={step.id === "age" ? "number" : step.id === "email" ? "email" : "text"}
                  placeholder={step.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-14 pl-12 pr-4 rounded-xl bg-card border-border text-lg focus-visible:ring-2 focus-visible:ring-lime"
                  autoFocus
                />
              </div>

              <p className="text-muted-foreground text-sm">{step.subtitle}</p>

              {step.proTip && (
                <div className="bg-lime/20 rounded-xl p-4">
                  <p className="text-sm">
                    <span className="font-semibold">Pro Tip:</span> {step.proTip}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="text-6xl animate-bounce">{step.emoji}</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-lime rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-lime rounded-full animate-pulse delay-150" />
              </div>
              <p className="text-muted-foreground">{step.subtitle}</p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section */}
        {step.id !== "searching" && (
          <div className="w-full space-y-4 pb-8">
            <Button
              onClick={handleNext}
              disabled={!inputValue.trim()}
              className="w-full h-14 rounded-xl bg-lime text-foreground hover:bg-lime/90 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              🍵 Tea has 11M+ women sharing dating experiences
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
