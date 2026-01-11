import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

interface QuizStep {
  id: string;
  question: string;
  emoji: string;
  placeholder: string;
  subtitle: string;
  proTip?: string;
  bottomText?: string;
  type?: "text" | "number" | "email" | "select" | "location" | "disclaimer";
  options?: string[];
  isOptional?: boolean;
}

// Exact quiz steps from teachecker.app - 11 steps total
const quizSteps: QuizStep[] = [
  {
    id: "name",
    question: "What's your first name?",
    emoji: "👋",
    placeholder: "Enter your first name",
    subtitle: "Or the name/nickname you use on dating apps",
    proTip: "We'll also search for common nicknames and variations of your name to ensure we don't miss any posts.",
    bottomText: "Tea has 11M+ women sharing dating experiences",
    type: "text",
  },
  {
    id: "age",
    question: "How old are you?",
    emoji: "🎂",
    placeholder: "Enter your age",
    subtitle: "This helps us narrow down the search results",
    proTip: "Age is one of the most common identifiers used in Tea posts.",
    bottomText: "Age helps us find accurate matches",
    type: "number",
  },
  {
    id: "location",
    question: "Where do you date?",
    emoji: "📍",
    placeholder: "Start typing your city...",
    subtitle: "The city or area where you've been active on dating apps",
    bottomText: "Location matching helps find local posts",
    type: "location",
  },
  {
    id: "dating_apps",
    question: "Which dating apps do you use?",
    emoji: "💘",
    placeholder: "Select all that apply",
    subtitle: "Women often mention which app they met someone on",
    proTip: "Dating app mentions help narrow down relevant posts.",
    bottomText: "App-specific searches improve accuracy",
    type: "select",
    options: ["Tinder", "Hinge", "Bumble", "Raya", "The League", "Feeld", "Coffee Meets Bagel", "OkCupid", "Other"],
  },
  {
    id: "job",
    question: "What do you do for work?",
    emoji: "💼",
    placeholder: "Enter your job title or industry",
    subtitle: "Occupation is a common identifier in posts",
    proTip: "Job titles are frequently mentioned when women describe who they dated.",
    bottomText: "Profession helps identify you in posts",
    type: "text",
  },
  {
    id: "ethnicity",
    question: "What's your ethnicity?",
    emoji: "🌍",
    placeholder: "Select your ethnicity",
    subtitle: "Helps improve search accuracy",
    bottomText: "Ethnicity is often mentioned in Tea posts",
    type: "select",
    options: ["White/Caucasian", "Black/African American", "Hispanic/Latino", "Asian", "Middle Eastern", "South Asian", "Mixed", "Other"],
  },
  {
    id: "relationship",
    question: "What are you looking for?",
    emoji: "💕",
    placeholder: "Select what you're looking for",
    subtitle: "This is often discussed in Tea posts",
    bottomText: "Relationship intent is commonly mentioned",
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
    bottomText: "Social media links increase search accuracy",
    type: "text",
    isOptional: true,
  },
  {
    id: "phone",
    question: "Last 4 digits of your phone?",
    emoji: "📱",
    placeholder: "XXXX",
    subtitle: "For verification purposes only",
    proTip: "We never store or share your phone number.",
    bottomText: "Phone verification ensures accurate results",
    type: "text",
  },
  {
    id: "email",
    question: "What's your email?",
    emoji: "📧",
    placeholder: "Enter your email",
    subtitle: "We'll send your report here",
    proTip: "Your email is kept 100% confidential.",
    bottomText: "Get your full report delivered instantly",
    type: "email",
  },
  {
    id: "searching",
    question: "Searching the Tea database...",
    emoji: "🔍",
    placeholder: "",
    subtitle: "Scanning 11M+ posts for mentions of you",
    type: "text",
  },
];

// Google Maps libraries
const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const Search = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchProgress, setSearchProgress] = useState(0);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const hasNavigatedRef = useRef(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBtoiqRpEWSG1Mc4XLINiT9GMo6J27NvXs",
    libraries,
  });

  const step = quizSteps[currentStep];
  const totalSteps = quizSteps.length;

  // Initialize Google Places services
  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Handle location autocomplete
  useEffect(() => {
    if (step.type === "location" && inputValue.length > 1 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: inputValue,
          types: ["(cities)"],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setLocationSuggestions(predictions);
            setShowLocationSuggestions(true);
          } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
          }
        }
      );
    } else if (step.type === "location" && inputValue.length <= 1) {
      setShowLocationSuggestions(false);
    }
  }, [inputValue, step.type]);

  // Searching animation and auto-navigate to checkout
  useEffect(() => {
    if (step.id === "searching" && !hasNavigatedRef.current) {
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      const timer = setTimeout(() => {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigate("/checkout", { state: { answers } });
        }
      }, 3500);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [step.id, navigate, answers]);

  const handleNext = useCallback(() => {
    let valueToSave = inputValue;
    
    if (step.type === "select" && step.id === "dating_apps") {
      valueToSave = selectedApps.join(", ");
    }

    const canProceed = valueToSave.trim() || step.isOptional || step.id === "searching";
    
    if (canProceed) {
      const newAnswers = { ...answers, [step.id]: valueToSave };
      setAnswers(newAnswers);
      
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setInputValue("");
        setSelectedApps([]);
      }
    }
  }, [inputValue, step, selectedApps, answers, currentStep, totalSteps]);

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
    if (e.key === "Enter" && !isNextDisabled()) {
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

  const selectLocation = (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.description);
    setShowLocationSuggestions(false);
    
    // Get place details to get lat/lng
    if (placesService.current) {
      placesService.current.getDetails(
        { placeId: prediction.place_id, fields: ["geometry"] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            setMapCenter({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      );
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    placesService.current = new google.maps.places.PlacesService(map);
  };

  const isNextDisabled = () => {
    if (step.isOptional) return false;
    if (step.id === "searching") return true;
    if (step.type === "select" && step.id === "dating_apps") {
      return selectedApps.length === 0;
    }
    if (step.type === "select") {
      return !inputValue.trim();
    }
    return !inputValue.trim();
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
      {/* Card Container for Quiz - white card on cream background */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-center py-4 px-6 relative border-b border-gray-100">
          <button 
            onClick={handleBack}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center">
              <span className="text-lg">🍵</span>
            </div>
            <span className="font-bold text-gray-800">tea checker</span>
          </div>
        </header>

        {/* Progress Bar - segmented style matching original (11 segments) */}
        <div className="px-4 py-3">
          <div className="flex gap-1">
            {quizSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? "bg-[#c8e972]" 
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 flex flex-col px-6 py-4">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {step.question}
            </h1>

            {step.id === "searching" ? (
              // Searching Animation
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#c8e972]/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#c8e972]/40 flex items-center justify-center animate-pulse">
                      <span className="text-4xl">🔍</span>
                    </div>
                  </div>
                  {/* Rotating ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c8e972] animate-spin" />
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#c8e972] rounded-full transition-all duration-100"
                      style={{ width: `${searchProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {searchProgress}% complete
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-gray-600 font-medium">Scanning Tea database...</p>
                  <p className="text-sm text-gray-500">{step.subtitle}</p>
                </div>

                {/* Animated dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : (
              <>
                {step.type === "location" ? (
                  <div className="relative">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                        📍
                      </span>
                      <Input
                        type="text"
                        placeholder={step.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue.length > 1 && setShowLocationSuggestions(true)}
                        className="h-14 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-200 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                        autoFocus
                      />
                    </div>
                    
                    {/* Location Suggestions Dropdown - Google Style */}
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                        {locationSuggestions.map((prediction) => (
                          <button
                            key={prediction.place_id}
                            onClick={() => selectLocation(prediction)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {prediction.structured_formatting?.main_text}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                {prediction.structured_formatting?.secondary_text}
                              </span>
                            </div>
                          </button>
                        ))}
                        <div className="px-4 py-2 text-right border-t border-gray-100 bg-gray-50">
                          <span className="text-xs text-gray-400">powered by </span>
                          <span className="text-xs font-medium text-gray-600">Google</span>
                        </div>
                      </div>
                    )}

                    <p className="text-gray-500 text-sm mt-2">{step.subtitle}</p>

                    {/* Google Map */}
                    {isLoaded && inputValue.length > 3 && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={mapCenter}
                          zoom={12}
                          onLoad={handleMapLoad}
                          options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                          }}
                        >
                          <Marker position={mapCenter} />
                        </GoogleMap>
                      </div>
                    )}
                  </div>
                ) : step.type === "select" ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {step.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => step.id === "dating_apps" ? toggleApp(option) : setInputValue(option)}
                          className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                            step.id === "dating_apps"
                              ? selectedApps.includes(option)
                                ? "bg-[#c8e972] border-[#c8e972] text-gray-900"
                                : "bg-white border-gray-200 hover:border-[#c8e972]/50"
                              : inputValue === option
                                ? "bg-[#c8e972] border-[#c8e972] text-gray-900"
                                : "bg-white border-gray-200 hover:border-[#c8e972]/50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm">{step.subtitle}</p>
                  </>
                ) : (
                  <>
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
                        className="h-14 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-200 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                        autoFocus
                      />
                    </div>
                    <p className="text-gray-500 text-sm">{step.subtitle}</p>
                  </>
                )}

                {step.proTip && (
                  <div className="bg-[#d4e8b8] rounded-xl p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-bold">Pro Tip:</span> {step.proTip}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[60px]" />

          {/* Bottom Section */}
          {step.id !== "searching" && (
            <div className="space-y-4 pb-6">
              <Button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors ${
                  isNextDisabled()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>

              <p className="text-center text-sm text-gray-500">
                🍵 {step.bottomText || "Tea has 11M+ women sharing dating experiences"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;