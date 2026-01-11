import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuizStep {
  id: string;
  question: string;
  emoji: string;
  placeholder: string;
  subtitle: string;
  proTip?: string;
  type?: "text" | "number" | "email" | "select" | "location";
  options?: string[];
}

const quizSteps: QuizStep[] = [
  {
    id: "name",
    question: "What's your first name?",
    emoji: "👋",
    placeholder: "Enter your first name",
    subtitle: "Or the name/nickname you use on dating apps",
    proTip: "We'll also search for common nicknames and variations of your name to ensure we don't miss any posts.",
    type: "text",
  },
  {
    id: "age",
    question: "How old are you?",
    emoji: "🎂",
    placeholder: "Enter your age",
    subtitle: "This helps us narrow down the search results",
    proTip: "Age is one of the most common identifiers used in Tea posts.",
    type: "number",
  },
  {
    id: "location",
    question: "Where do you live?",
    emoji: "📍",
    placeholder: "Start typing your city...",
    subtitle: "We'll search posts in your area",
    proTip: "Most Tea posts mention the guy's location or where they met.",
    type: "location",
  },
  {
    id: "dating_apps",
    question: "Which dating apps do you use?",
    emoji: "💘",
    placeholder: "Select all that apply",
    subtitle: "Women often mention which app they met someone on",
    proTip: "This helps us narrow down to posts mentioning specific apps.",
    type: "select",
    options: ["Tinder", "Hinge", "Bumble", "Raya", "The League", "Feeld", "Coffee Meets Bagel", "OkCupid", "Other"],
  },
  {
    id: "height",
    question: "How tall are you?",
    emoji: "📏",
    placeholder: "e.g., 5'10\" or 178cm",
    subtitle: "Height is often mentioned in Tea posts",
    type: "text",
  },
  {
    id: "job",
    question: "What do you do for work?",
    emoji: "💼",
    placeholder: "Enter your job title or industry",
    subtitle: "Occupation is a common identifier in posts",
    proTip: "Job titles are frequently mentioned when women describe who they dated.",
    type: "text",
  },
  {
    id: "ethnicity",
    question: "What's your ethnicity?",
    emoji: "🌍",
    placeholder: "Select your ethnicity",
    subtitle: "Helps improve search accuracy",
    type: "select",
    options: ["White/Caucasian", "Black/African American", "Hispanic/Latino", "Asian", "Middle Eastern", "South Asian", "Mixed", "Other"],
  },
  {
    id: "relationship",
    question: "What are you looking for?",
    emoji: "💕",
    placeholder: "Select what you're looking for",
    subtitle: "This is often discussed in Tea posts",
    type: "select",
    options: ["Serious Relationship", "Casual Dating", "Something Casual", "Not Sure Yet", "Marriage"],
  },
  {
    id: "instagram",
    question: "What's your Instagram handle?",
    emoji: "📸",
    placeholder: "@yourusername",
    subtitle: "Optional - helps find linked posts",
    proTip: "Instagram handles are sometimes shared in Tea posts.",
    type: "text",
  },
  {
    id: "phone",
    question: "Last 4 digits of your phone?",
    emoji: "📱",
    placeholder: "XXXX",
    subtitle: "For verification purposes only",
    proTip: "We never store or share your phone number.",
    type: "text",
  },
  {
    id: "email",
    question: "What's your email?",
    emoji: "📧",
    placeholder: "Enter your email",
    subtitle: "We'll send your report here",
    proTip: "Your email is kept 100% confidential.",
    type: "email",
  },
  {
    id: "searching",
    question: "Searching the Tea database...",
    emoji: "🔍",
    placeholder: "",
    subtitle: "This may take a moment",
    type: "text",
  },
];

// Location suggestions mock data
const locationSuggestions = [
  "New York, NY, USA",
  "Los Angeles, CA, USA",
  "Chicago, IL, USA",
  "Houston, TX, USA",
  "Phoenix, AZ, USA",
  "Philadelphia, PA, USA",
  "San Antonio, TX, USA",
  "San Diego, CA, USA",
  "Dallas, TX, USA",
  "San Jose, CA, USA",
  "Austin, TX, USA",
  "Jacksonville, FL, USA",
  "Fort Worth, TX, USA",
  "Columbus, OH, USA",
  "Charlotte, NC, USA",
  "San Francisco, CA, USA",
  "Indianapolis, IN, USA",
  "Seattle, WA, USA",
  "Denver, CO, USA",
  "Washington, DC, USA",
  "Boston, MA, USA",
  "Nashville, TN, USA",
  "Miami, FL, USA",
  "Atlanta, GA, USA",
  "Portland, OR, USA",
];

const Search = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [hasNavigated, setHasNavigated] = useState(false);

  const step = quizSteps[currentStep];
  const totalSteps = quizSteps.length;

  // Filter locations based on input
  useEffect(() => {
    if (step.type === "location" && inputValue.length > 0) {
      const filtered = locationSuggestions.filter(loc =>
        loc.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 5));
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setShowLocationSuggestions(false);
    }
  }, [inputValue, step.type]);

  const handleNext = useCallback(() => {
    let valueToSave = inputValue;
    
    if (step.type === "select" && step.id === "dating_apps") {
      valueToSave = selectedApps.join(", ");
    }

    if (valueToSave.trim() || step.id === "searching" || step.id === "instagram") {
      const newAnswers = { ...answers, [step.id]: valueToSave };
      setAnswers(newAnswers);
      
      if (currentStep === totalSteps - 1) {
        navigate("/checkout", { state: { answers: newAnswers } });
      } else if (step.id === "searching") {
        // Will be handled by effect
      } else {
        setCurrentStep(currentStep + 1);
        setInputValue("");
        setSelectedApps([]);
      }
    }
  }, [inputValue, step, selectedApps, answers, currentStep, totalSteps, navigate]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStep = quizSteps[currentStep - 1];
      if (prevStep.type === "select" && prevStep.id === "dating_apps") {
        const savedApps = answers[prevStep.id]?.split(", ").filter(Boolean) || [];
        setSelectedApps(savedApps);
        setInputValue("");
      } else {
        setInputValue(answers[prevStep.id] || "");
      }
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const toggleApp = (app: string) => {
    setSelectedApps(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  const selectLocation = (location: string) => {
    setInputValue(location);
    setShowLocationSuggestions(false);
  };

  // Auto-advance for searching step
  useEffect(() => {
    if (step.id === "searching" && !hasNavigated) {
      setHasNavigated(true);
      const timer = setTimeout(() => {
        navigate("/checkout", { state: { answers } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step.id, navigate, answers, hasNavigated]);

  const isNextDisabled = () => {
    if (step.id === "instagram") return false; // Optional field
    if (step.type === "select" && step.id === "dating_apps") {
      return selectedApps.length === 0;
    }
    return !inputValue.trim();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Card Container for Quiz - white card on cream background */}
      <div className="w-full max-w-md bg-card min-h-screen flex flex-col shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-center py-4 px-6 relative border-b border-border/50">
          <button 
            onClick={handleBack}
            className="absolute left-4 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
              <span className="text-lg">🍵</span>
            </div>
            <span className="font-bold text-foreground">tea checker</span>
          </div>
        </header>

        {/* Progress Bar - segmented style matching original */}
        <div className="px-4 py-3">
          <div className="flex gap-1">
            {quizSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? "bg-lime" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 flex flex-col px-6 py-6">
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-foreground">
              {step.question}
            </h1>

            {step.id !== "searching" ? (
              <>
                {step.type === "location" ? (
                  <div className="relative">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                        {step.emoji}
                      </span>
                      <Input
                        type="text"
                        placeholder={step.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue.length > 0 && setShowLocationSuggestions(true)}
                        className="h-14 pl-12 pr-4 rounded-xl bg-card border-2 border-border text-base focus-visible:ring-2 focus-visible:ring-lime focus-visible:border-lime"
                        autoFocus
                      />
                    </div>
                    
                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border-2 border-border shadow-lg z-50 overflow-hidden">
                        {filteredLocations.map((location, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectLocation(location)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                          >
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">{location}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Map Preview */}
                    {inputValue && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border h-40 bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-lime" />
                          <p className="text-sm">{inputValue || "Select a location"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : step.type === "select" ? (
                  <div className="flex flex-wrap gap-2">
                    {step.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => step.id === "dating_apps" ? toggleApp(option) : setInputValue(option)}
                        className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          step.id === "dating_apps"
                            ? selectedApps.includes(option)
                              ? "bg-lime border-lime text-foreground"
                              : "bg-card border-border hover:border-lime/50"
                            : inputValue === option
                              ? "bg-lime border-lime text-foreground"
                              : "bg-card border-border hover:border-lime/50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                      {step.emoji}
                    </span>
                    <Input
                      type={step.type === "number" ? "number" : step.type === "email" ? "email" : "text"}
                      placeholder={step.placeholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-14 pl-12 pr-4 rounded-xl bg-card border-2 border-border text-base focus-visible:ring-2 focus-visible:ring-lime focus-visible:border-lime"
                      autoFocus
                    />
                  </div>
                )}

                <p className="text-muted-foreground text-sm">{step.subtitle}</p>

                {step.proTip && (
                  <div className="bg-[#d4e8b8] rounded-xl p-4">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">Pro Tip:</span> {step.proTip}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="text-6xl animate-bounce">{step.emoji}</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-lime rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-lime rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-3 h-3 bg-lime rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
                <p className="text-muted-foreground">{step.subtitle}</p>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[100px]" />

          {/* Bottom Section */}
          {step.id !== "searching" && (
            <div className="space-y-4 pb-6">
              <Button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="w-full h-14 rounded-xl bg-muted hover:bg-lime text-foreground font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors data-[disabled=false]:bg-lime"
                data-disabled={isNextDisabled()}
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
    </div>
  );
};

export default Search;