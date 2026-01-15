import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Upload, X, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import testimonialChris from "@/assets/testimonial-chris.png";
import reviewMatt from "@/assets/review-matt.jpeg";
import reviewJustin from "@/assets/review-justin.jpeg";
import reviewDaniel from "@/assets/review-daniel.jpeg";

// Step types for the quiz flow
type StepType = "text" | "number" | "location" | "info" | "multiselect" | "instagram" | "testimonials" | "photo" | "searching";

interface QuizStep {
  id: string;
  type: StepType;
  // For text/number/location/instagram steps
  question?: string;
  emoji?: string;
  placeholder?: string;
  subtitle?: string;
  tipLabel?: string;
  tipText?: string;
  tipColor?: "green" | "purple";
  bottomText?: string;
  isOptional?: boolean;
}

// Exact quiz steps from teachecker.app screenshots - 11 steps total
const quizSteps: QuizStep[] = [
  {
    id: "name",
    type: "text",
    question: "What's your first name?",
    emoji: "👋",
    placeholder: "Enter your first name",
    subtitle: "Or the name you use on dating apps",
    tipLabel: "Pro Tip:",
    tipText: "We also scan for nicknames and name variations so nothing slips through.",
    tipColor: "green",
    bottomText: "Tea has 12M+ women sharing dating experiences",
  },
  {
    id: "age",
    type: "number",
    question: "How old are you?",
    emoji: "🎂",
    placeholder: "Enter your age",
    subtitle: "We'll search posts mentioning ages within ±6 years",
    tipLabel: "Why we ask:",
    tipText: "Tea posts often mention age. This helps us find more accurate matches.",
    tipColor: "purple",
    bottomText: "We scan all age-related name variations",
  },
  {
    id: "location",
    type: "location",
    question: "Where do you date?",
    emoji: "📍",
    placeholder: "Start typing your city...",
    subtitle: "The city or area where you use dating apps",
    bottomText: "Location matching locates nearby posts",
  },
  {
    id: "area_activity",
    type: "info",
  },
  {
    id: "whats_at_stake",
    type: "info",
  },
  {
    id: "has_happened",
    type: "multiselect",
  },
  {
    id: "one_post_spreads",
    type: "info",
  },
  {
    id: "removal_service",
    type: "info",
  },
  {
    id: "instagram",
    type: "instagram",
    question: "What's your Instagram? (optional)",
    subtitle: "Helps us match posts that mention your social",
    placeholder: "@yourusername",
    tipLabel: "Why this helps:",
    tipText: "Tea posts sometimes tag Instagram handles. Adding yours improves your chances of finding relevant posts.",
    tipColor: "purple",
    bottomText: "Instagram helps verify your identity",
    isOptional: true,
  },
  {
    id: "success_stories",
    type: "testimonials",
  },
  {
    id: "photo",
    type: "photo",
  },
  {
    id: "searching",
    type: "searching",
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

// Experience options for "Has this happened" step - reordered last 3
const experienceOptions = [
  { emoji: "😐", text: "The date was going great... then she suddenly went cold" },
  { emoji: "😤", text: "She stopped replying mid-conversation for no clear reason" },
  { emoji: "🤔", text: "Matches who seemed interested never replied" },
  { emoji: "📱", text: "The vibe shifted after she checked her phone" },
  { emoji: "👀", text: "Her friends gave you weird looks when you first met" },
];

// Search status texts that cycle during the search
const searchStatusTexts = [
  "Scanning for name matches...",
  "Cross-referencing age details...",
  "Scanning location mentions...",
  "Analyzing name variations...",
  "Reviewing dating app tags...",
  "Processing profile matches...",
  "Finalizing results...",
];

// Testimonials for Success Stories step - using homepage Chris + 3 crafted reviews
const testimonials = [
  {
    name: "Chris T.",
    handle: "@christ_bnb",
    image: testimonialChris,
    text: "I found my Ex's post about me from 6 months ago which might be why I have been why im getting less matches. Touche! 💪",
    date: "5:37 PM · Dec 17, 2025",
    views: "3,348",
  },
  {
    name: "Matt T.",
    handle: "@mattt_chi",
    image: reviewMatt,
    text: "Discovered 2 posts about me from last year. Cleared up everything - now I know why a few conversations went cold.",
    date: "3:22 PM · Dec 19, 2025",
    views: "4,127",
  },
  {
    name: "Justin R.",
    handle: "@justinr_atl",
    image: reviewJustin,
    text: "My search came back completely clean. Such a relief knowing there's nothing out there. Money well spent.",
    date: "11:45 AM · Dec 20, 2025",
    views: "2,891",
  },
  {
    name: "Daniel K.",
    handle: "@danielk_mia",
    image: reviewDaniel,
    text: "Found an old post about me with just my first name and neighborhood. Spot on results - couldn't believe the accuracy.",
    date: "8:18 PM · Dec 21, 2025",
    views: "5,632",
  },
];

const Search = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchProgress, setSearchProgress] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(0);
  const [searchStatusIndex, setSearchStatusIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailValue, setEmailValue] = useState("");
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

  // Searching animation - 15 seconds total with random pauses, posts appear in first 9 seconds
  useEffect(() => {
    if (step.id === "searching" && !hasNavigatedRef.current) {
      // Reset states when entering searching step
      setSearchProgress(0);
      setVisiblePosts(0);
      setSearchComplete(false);
      setShowEmailModal(false);
      setSearchStatusIndex(0);

      // Build a sequence of progress values with pauses and skips baked in
      // 15 seconds = 150 ticks at 100ms each
      // 15 pauses (repeat same value) + ~5 skips (+2 instead of +1)
      const totalTicks = 150;
      const pauseCount = 15;
      const skipCount = 5;
      
      // Generate random pause positions (avoid first 10 and last 10 ticks)
      const pausePositions = new Set<number>();
      while (pausePositions.size < pauseCount) {
        pausePositions.add(Math.floor(Math.random() * 130) + 10);
      }
      
      // Generate random skip positions (where we jump +2 instead of normal)
      const skipPositions = new Set<number>();
      while (skipPositions.size < skipCount) {
        const pos = Math.floor(Math.random() * 140) + 5;
        if (!pausePositions.has(pos)) {
          skipPositions.add(pos);
        }
      }
      
      // Calculate base increment: 100% over (150 - 15 pauses) = 135 active ticks, minus skip bonuses
      const activeTicks = totalTicks - pauseCount;
      const skipBonus = skipCount * 1; // Each skip adds 1 extra
      const baseIncrement = 100 / (activeTicks + skipBonus);
      
      let tickCount = 0;
      let currentProgress = 0;
      
      const progressInterval = setInterval(() => {
        tickCount++;
        
        // If this is a pause tick, don't increment progress
        if (pausePositions.has(tickCount)) {
          // Just update state with same value (causes visual "pause")
          setSearchProgress(currentProgress);
          return;
        }
        
        // Calculate increment - skip positions get double
        const increment = skipPositions.has(tickCount) 
          ? baseIncrement * 2 
          : baseIncrement;
        
        currentProgress = Math.min(100, currentProgress + increment);
        setSearchProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);

      // Cycle through search status texts - last 2 texts appear 1 second later each
      // Texts 0-4 appear every 2 seconds, text 5 at 12s, text 6 at 13s
      const statusTimings = [0, 2000, 4000, 6000, 8000, 12000, 13000];
      const statusTimers: NodeJS.Timeout[] = [];
      statusTimings.forEach((timing, index) => {
        if (index > 0) {
          const timer = setTimeout(() => {
            setSearchStatusIndex(index);
          }, timing);
          statusTimers.push(timer);
        }
      });

      // Posts appear one by one with random-feeling but static timing
      // First 4 arrive normally, last 2 arrive 1 second later each
      const postTimings = [
        300,   // Post 1 - 0.3s (fast)
        600,   // Post 2 - 0.6s (0.3s after first)
        3200,  // Post 3 - 3.2s
        5000,  // Post 4 - 5.0s
        7500,  // Post 5 - 7.5s (1s later than before)
        10000, // Post 6 - 10s (2s later than before)
      ];
      
      const postTimers: NodeJS.Timeout[] = [];
      postTimings.forEach((timing, index) => {
        const timer = setTimeout(() => {
          setVisiblePosts(index + 1);
        }, timing);
        postTimers.push(timer);
      });

      // Search complete after 15 seconds, then show email modal after brief delay
      const completeTimer = setTimeout(() => {
        setSearchProgress(100); // Ensure it shows 100%
        setSearchComplete(true);
        // Show email modal 500ms after search complete popup appears
        setTimeout(() => {
          setShowEmailModal(true);
        }, 500);
      }, 15000);

      return () => {
        clearInterval(progressInterval);
        statusTimers.forEach(t => clearTimeout(t));
        postTimers.forEach(t => clearTimeout(t));
        clearTimeout(completeTimer);
      };
    }
  }, [step.id]);

  // State for email validation error
  const [emailError, setEmailError] = useState(false);

  // Handle email submission to proceed to checkout
  const handleEmailSubmit = () => {
    const email = emailValue.trim();
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      hasNavigatedRef.current = true;
      navigate("/checkout", { state: { answers: { ...answers, email: emailValue } } });
    } else {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 3000);
    }
  };

  const handleNext = useCallback(() => {
    // For info/testimonials/photo steps, just proceed
    if (["info", "testimonials", "multiselect"].includes(step.type)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    let valueToSave = inputValue;

    const canProceed = valueToSave.trim() || step.isOptional || step.type === "photo" || step.id === "searching";
    
    if (canProceed) {
      const newAnswers = { ...answers, [step.id]: valueToSave };
      setAnswers(newAnswers);
      
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setInputValue("");
      }
    }
  }, [inputValue, step, answers, currentStep, totalSteps]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStep = quizSteps[currentStep - 1];
      if (prevStep.type === "text" || prevStep.type === "number" || prevStep.type === "location" || prevStep.type === "instagram") {
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

  const toggleExperience = (index: number) => {
    setSelectedExperiences(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectLocation = (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.description);
    setShowLocationSuggestions(false);
    
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
    if (["info", "testimonials", "multiselect", "photo"].includes(step.type)) return false;
    if (step.id === "searching") return true;
    return !inputValue.trim();
  };

  // Get location name for display (e.g., "32" from "32, New York" or city name)
  const getLocationDisplay = () => {
    const loc = answers.location || "";
    // Extract just the city/area name or first part
    const parts = loc.split(",");
    return parts[0] || "your area";
  };

  // Render different step types
  const renderStepContent = () => {
    switch (step.type) {
      case "text":
      case "number":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{step.question}</h1>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">{step.emoji}</span>
              <Input
                type={step.type === "number" ? "number" : "text"}
                placeholder={step.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 pl-12 pr-4 rounded-lg bg-[#f5f0e8] border border-gray-900 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                autoFocus
              />
            </div>
            <p className="text-gray-500 text-sm">{step.subtitle}</p>
          </>
        );

      case "location":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{step.question}</h1>
            <div className="relative">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
                <Input
                  type="text"
                  placeholder={step.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => inputValue.length > 1 && setShowLocationSuggestions(true)}
                  className="h-14 pl-12 pr-4 rounded-lg bg-[#f5f0e8] border border-gray-900 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                  autoFocus
                />
              </div>
              
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-900 shadow-lg z-50 overflow-hidden">
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
            </div>
            <p className="text-gray-500 text-sm">{step.subtitle}</p>

            {isLoaded && inputValue.length > 3 && (
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-900">
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
          </>
        );

      case "info":
        if (step.id === "area_activity") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Tea is active in your area</h1>
              <p className="text-gray-500 text-sm">Here's what's happening near {getLocationDisplay()}</p>
              
              <div className="space-y-3 mt-4">
                <div className="bg-[#c8e972] rounded-lg p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">37 new posts</p>
                    <p className="text-sm text-gray-700">added this week nearby</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-lg p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">13 searches this hour</p>
                    <p className="text-sm text-gray-700">women checking nearby profiles</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-900 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">🚨</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">7 hours ago</p>
                    <p className="text-sm text-gray-500">since last post about a man your age</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-600">Activity updates in real-time</span>
              </div>
            </>
          );
        }

        if (step.id === "whats_at_stake") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Here's what's at stake...</h1>
              <p className="text-gray-500 text-sm">What women post on Tea can impact your dating life in ways you might not expect.</p>
              
              <div className="space-y-3 mt-4">
                <div className="bg-white border border-gray-900 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c8e972] rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">👀</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">74% of women</p>
                    <p className="text-sm text-gray-500">check Tea before a first date</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-lg p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">2.1M posts monthly</p>
                    <p className="text-sm text-gray-700">shared about men on dating apps</p>
                  </div>
                </div>
                
                <div className="bg-[#c8e972] rounded-lg p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">❤️</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">1 in 4 guys</p>
                    <p className="text-sm text-gray-700">have been posted about without knowing it</p>
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (step.id === "one_post_spreads") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">One post. Thousands of eyes.</h1>
              <p className="text-gray-500 text-sm">See how fast a Tea post spreads...</p>
              
              {/* Visual diagram - simplified representation */}
              <div className="relative py-8">
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Center icon */}
                    <div className="w-16 h-16 bg-[#c8e972] rounded-lg flex items-center justify-center mx-auto border border-gray-900 z-10 relative">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="bg-[#c8e972] text-xs font-medium px-2 py-1 rounded-sm mt-1 text-center border border-gray-900">Your Tea post</div>
                    
                    {/* Orbiting avatars - decorative circles */}
                    <div className="absolute -top-4 -left-8 w-6 h-6 rounded-full bg-gray-200 border border-gray-900"></div>
                    <div className="absolute -top-2 left-16 w-8 h-8 rounded-full bg-pink-200 border border-gray-900"></div>
                    <div className="absolute top-4 -right-10 w-6 h-6 rounded-full bg-gray-300 border border-gray-900"></div>
                    <div className="absolute top-12 -left-12 w-7 h-7 rounded-full bg-gray-200 border border-gray-900"></div>
                    <div className="absolute -bottom-2 left-20 w-5 h-5 rounded-full bg-pink-100 border border-gray-900"></div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">📋</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-lg p-3">
                    <span className="text-xs bg-[#c8e972] px-2 py-0.5 rounded-sm font-medium border border-gray-900">MINUTE 1</span>
                    <p className="font-semibold text-sm mt-1">She posts about you</p>
                    <p className="text-xs text-gray-500">One frustrated message after a date gone wrong</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-400 px-2 py-0.5 rounded-sm font-medium border border-gray-900">HOUR 1</span>
                      <span className="text-xs text-gray-500">+600 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Local women see it</p>
                    <p className="text-xs text-gray-500">Tea surfaces posts by location</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">💬</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-sm font-medium border border-gray-900">DAY 1</span>
                      <span className="text-xs text-gray-500">+3,500 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Shared in group chats</p>
                    <p className="text-xs text-gray-500">"Girl, look this guy up before your date"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">📸</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-200 px-2 py-0.5 rounded-sm font-medium border border-gray-900">FOREVER</span>
                      <span className="text-xs text-gray-500">∞ 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Screenshots live on</p>
                    <p className="text-xs text-gray-500">Saved, shared, and searchable... forever</p>
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (step.id === "removal_service") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Found something negative? We can help remove it.</h1>
              <p className="text-gray-500 text-sm">If we find posts about you, our team can help take them down.</p>
              
              <div className="bg-[#c8e972] rounded-lg p-4 flex items-center gap-3 mt-4 border border-gray-900">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-900">
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Free Removal Service</p>
                  <p className="text-sm text-gray-700">We file legal takedown requests so you don't have to. Most posts are removed within 48–72 hours.</p>
                </div>
              </div>

              <p className="font-semibold text-sm mt-6 mb-3 text-gray-500">HOW IT WORKS</p>
              
              <div className="space-y-2">
                <div className="border border-gray-900 rounded-lg p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">1</span>
                  <div>
                    <span className="font-semibold text-sm">We find the posts</span>
                    <span className="text-sm text-gray-500"> — our search finds all mentions of you</span>
                  </div>
                </div>
                
                <div className="border border-gray-900 rounded-lg p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">2</span>
                  <div>
                    <span className="font-semibold text-sm">You review & choose</span>
                    <span className="text-sm text-gray-500"> — pick which posts you want removed</span>
                  </div>
                </div>
                
                <div className="border border-gray-900 rounded-lg p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">3</span>
                  <div>
                    <span className="font-semibold text-sm">We handle the rest</span>
                    <span className="text-sm text-gray-500"> — takedown requests filed on your behalf</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border border-gray-900 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">96%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
                <div className="border border-gray-900 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">48-72h</p>
                  <p className="text-xs text-gray-500">Average removal time</p>
                </div>
              </div>
            </>
          );
        }
        return null;

      case "multiselect":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Has this ever happened to you?</h1>
            <p className="text-gray-500 text-sm">Select any that sound familiar...</p>
            
            <div className="space-y-2 mt-4">
              {experienceOptions.map((option, index) => {
                const isSelected = selectedExperiences.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => toggleExperience(index)}
                    className={`w-full flex items-center justify-between gap-3 p-4 rounded-lg border transition-all text-left ${
                      isSelected
                        ? "border-[#a855f7] bg-[#f3e8ff]"
                        : "border-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-lg ${
                        isSelected ? "bg-[#e9d5ff] border-[#a855f7]" : "bg-gray-100 border-gray-900"
                      }`}>{option.emoji}</span>
                      <span className={`text-sm ${isSelected ? "text-[#7c3aed] font-medium" : "text-gray-700"}`}>{option.text}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#a855f7] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mt-4 border border-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <span className="font-semibold text-white">The connection?</span>
              </div>
              <p className="text-sm text-gray-300">
                She may have searched you on Tea <span className="text-[#c8e972] font-medium">before you even met</span>. What she found might have changed everything.
              </p>
            </div>
          </>
        );

      case "instagram":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{step.question}</h1>
            <p className="text-gray-500 text-sm">{step.subtitle}</p>
            
            <div className="relative mt-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-lg border border-gray-900 flex items-center justify-center text-lg">📷</span>
              <Input
                type="text"
                placeholder={step.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 pl-14 pr-4 rounded-lg bg-[#f5f0e8] border border-gray-900 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                autoFocus
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">You can skip this step if you prefer</p>
          </>
        );

      case "testimonials":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
            <p className="text-gray-500 text-sm">See how other guys discovered what's being said about them.</p>
            
            <div className="bg-[#c8e972] rounded-lg py-2 px-4 flex items-center justify-center gap-2 mt-4 border border-gray-900">
              <span className="text-lg">👥</span>
              <span className="font-semibold text-sm">78 guys checked today</span>
            </div>

            <div className="space-y-3 mt-4">
              {testimonials.map((t, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 text-white border border-gray-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">{t.name}</span>
                          <svg viewBox="0 0 22 22" className="w-4 h-4 fill-[#1d9bf0] ml-0.5" aria-hidden="true">
                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-400">{t.handle}</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-100 mb-2">{t.text}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{t.date}</span>
                    <span>·</span>
                    <span className="font-medium">{t.views}</span>
                    <span>Views</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "photo":
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Add a photo (optional)</h1>
            <p className="text-gray-500 text-sm">Our AI can match your face against photos shared in Tea posts. Optional, but improves accuracy.</p>
            
            <div className="border border-gray-900 border-dashed rounded-lg p-8 mt-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-[#c8e972] rounded-full flex items-center justify-center mb-3 border border-gray-900">
                <Upload className="w-6 h-6 text-gray-900" />
              </div>
              <p className="font-medium text-gray-900">Click to upload photos</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
            </div>
          </>
        );

      case "searching":
        return (
          <div className="flex flex-col space-y-4">
            {/* Header info box */}
            <div className="bg-[#c8e972] rounded-lg p-4 border border-gray-900">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-gray-900">Searching for {answers.name || "..."}</h2>
                  <p className="text-sm text-gray-700">Age {answers.age || "..."} • Near {answers.location || "..."}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-900">Searching</span>
                </div>
              </div>
            </div>

            {/* Progress section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm text-gray-600">{searchStatusTexts[searchStatusIndex]}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{Math.round(searchProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c8e972] rounded-full transition-all duration-100"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
            </div>

            {/* Search complete box */}
            {searchComplete && (
              <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center">
                  <span className="text-xl">🍵</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Search Complete!</p>
                  <p className="text-sm text-gray-700">Found 6 potential posts about "{answers.name}"</p>
                </div>
              </div>
            )}

            {/* Finding posts section */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                {searchComplete ? "POSTS FOUND" : "FINDING POSTS..."}
              </p>
              
              {/* Locked post cards */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index}
                  className={`bg-white border border-gray-900 rounded-xl p-4 transition-all duration-500 ${
                    index < visiblePosts 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4 pointer-events-none h-0 p-0 border-0 overflow-hidden"
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    display: index < visiblePosts ? 'block' : 'none'
                  }}
                >
                  {/* Blurred content simulation */}
                  <div className="relative">
                    <div className="space-y-2">
                      <div className="h-3 bg-red-200 rounded w-24 blur-[2px]" />
                      <div className="h-2 bg-gray-200 rounded w-full blur-[2px]" />
                      <div className="h-2 bg-gray-200 rounded w-3/4 blur-[2px]" />
                      <div className="flex gap-4 mt-2">
                        <div className="h-2 bg-gray-200 rounded w-12 blur-[2px]" />
                        <div className="h-2 bg-gray-200 rounded w-16 blur-[2px]" />
                      </div>
                    </div>
                    {/* Unlock button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Unlock to view
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Email Modal - Non-dismissible with blur background */}
            {showEmailModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Blur backdrop */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                
                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 fade-in duration-300 border border-gray-900">
                  {/* Tea icon */}
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="w-16 h-16 bg-[#c8e972] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🍵</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center">We found 6 potential posts!</h3>
                  <p className="text-gray-500 text-center text-sm mt-1">Get access to see what's being said about you</p>
                  
                  {/* Results box */}
                  <div className="bg-purple-100 rounded-lg p-3 mt-4 border border-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">🚩</span>
                      <span className="font-semibold text-gray-900">6 potential posts found</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Posts mentioning "{answers.name}" near {answers.location || "your area"}</p>
                  </div>
                  
                  {/* Email input */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Where should we send your report?</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">📧</span>
                      <Input
                        type="email"
                        placeholder="enter your email"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        className="h-12 pl-10 pr-4 rounded-lg bg-[#f5f0e8] border border-gray-900 focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                        onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                        autoFocus
                      />
                    </div>
                    {/* Email validation error popup */}
                    {emailError && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                        Please enter a valid email
                      </div>
                    )}
                  </div>
                  
                  {/* Submit button - Always dark, validation happens on click */}
                  <Button
                    onClick={handleEmailSubmit}
                    className="w-full h-12 rounded-lg font-semibold text-base mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Unlock Full Report
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  {/* Privacy note */}
                  <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                    Your search and report are 100% confidential. We never share your information.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get tip box for current step
  const renderTipBox = () => {
    // Info step tips
    if (step.id === "area_activity") {
      return (
        <div className="bg-white border border-gray-900 rounded-xl p-4 mt-auto">
          <p className="text-sm">
            <span className="font-bold">💡 Did you know:</span> Women often search Tea before a first date to check if there's any "tea" on their match.
          </p>
        </div>
      );
    }
    if (step.id === "whats_at_stake") {
      return (
        <div className="bg-white border border-gray-900 rounded-xl p-4 mt-auto">
          <p className="text-sm">
            <span className="font-bold">🤔 Think about it:</span> That awkward silence on a date? The sudden ghosting? She might've already read about you.
          </p>
        </div>
      );
    }
    if (step.id === "has_happened") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-4 border border-gray-900">
          <p className="text-sm text-gray-800">
            <span className="font-bold">The truth:</span> You can't control what's been said. But you can find out what's out there.
          </p>
        </div>
      );
    }
    if (step.id === "one_post_spreads") {
      return (
        <div className="bg-[#c8e972] rounded-xl p-4 mt-4 border border-gray-900">
          <p className="text-sm text-gray-800">
            <span className="font-bold">📊 The data:</span> The average Tea post gets seen by over <span className="font-bold">3,500 women</span> within the first week.
          </p>
        </div>
      );
    }
    if (step.id === "removal_service") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-4 border border-gray-900">
          <p className="text-sm text-gray-800">
            <span className="font-bold">✨ Good news:</span> Free takedown service is included with your report if posts are found. You're covered either way.
          </p>
        </div>
      );
    }
    if (step.id === "instagram") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-auto border border-gray-900">
          <p className="text-sm text-gray-800">
            <span className="font-bold">Why this helps:</span> Tea posts sometimes tag Instagram handles. Adding yours improves your chances of finding relevant posts.
          </p>
        </div>
      );
    }
    if (step.id === "photo") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-auto border border-gray-900">
          <p className="text-sm text-gray-800">
            <span className="font-bold">Privacy note:</span> Your photos are only used for matching — never stored or shared. Skip if you prefer.
          </p>
        </div>
      );
    }

    // Standard tip box for text/number steps
    if (step.tipText && step.tipLabel) {
      const bgColor = step.tipColor === "purple" ? "bg-[#e8d4f8]" : "bg-[#d4e8b8]";
      return (
        <div className={`${bgColor} rounded-xl p-4 mt-auto border border-gray-900`}>
          <p className="text-sm text-gray-800">
            <span className="font-bold">{step.tipLabel}</span> {step.tipText}
          </p>
        </div>
      );
    }

    return null;
  };

  // Get bottom text for current step
  const getBottomText = () => {
    if (step.bottomText) return step.bottomText;
    
    switch (step.id) {
      case "area_activity": return "New posts added every minute";
      case "whats_at_stake": return "Don't leave your reputation a mystery";
      case "has_happened": return "73% of women check Tea before a first date";
      case "one_post_spreads": return "The average Tea post reaches 3,500+ women";
      case "removal_service": return "We've helped 6,000+ guys remove posts";
      case "success_stories": return "Join thousands who found answers";
      case "photo": return "Photos boost search accuracy by 47%";
      default: return "Tea has 12M+ women sharing dating experiences";
    }
  };

  // Get button text for current step
  const getButtonText = () => {
    if (step.id === "photo") return "Search Tea 🍵";
    return "Next";
  };

  return (
    <div className="h-screen bg-[#f5f0e8] flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-xl border-l border-r border-gray-900">
        {/* Header - Fixed */}
        <header className="flex-shrink-0 flex items-center justify-center py-4 px-6 relative border-b border-gray-900">
          <button 
            onClick={handleBack}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center border border-gray-900">
              <span className="text-lg">🍵</span>
            </div>
            <span className="font-bold text-gray-800">tea finder</span>
          </div>
        </header>

        {/* Progress Bar - Fixed with borders */}
        <div className="flex-shrink-0 px-4 py-2 border-b border-gray-900">
          <div className="flex gap-[3px]">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`h-[5px] flex-1 rounded-sm transition-all duration-300 ${
                  index <= currentStep 
                    ? "bg-[#c8e972]" 
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 flex flex-col min-h-0 relative">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {renderStepContent()}
              
              {/* Tip box */}
              {step.type !== "searching" && renderTipBox()}
            </div>
            
            {/* Bottom padding to ensure content doesn't get hidden behind fixed button */}
            {step.type !== "searching" && <div className="h-4" />}
          </div>

          {/* Fixed Bottom Section with gradient shadow */}
          {step.type !== "searching" && (
            <div className="flex-shrink-0 relative">
              {/* Gradient shadow overlay */}
              <div className="absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              
              {/* Button and text container */}
              <div className="bg-white px-6 pb-6 pt-2 space-y-4">
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`w-full h-14 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors ${
                    isNextDisabled()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {getButtonText()}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-center text-sm text-gray-500">
                  🍵 {getBottomText()}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
