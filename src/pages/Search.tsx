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

// Experience options for "Has this happened" step
const experienceOptions = [
  { emoji: "😐", text: "The date was going great... then she suddenly went cold" },
  { emoji: "😤", text: "She stopped replying mid-conversation for no clear reason" },
  { emoji: "👀", text: "Her friends gave you weird looks when you first met" },
  { emoji: "📱", text: "The vibe shifted after she checked her phone" },
  { emoji: "🤔", text: "Matches who seemed interested never replied" },
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

  // Searching animation - 11 seconds total, posts appear in first 5 seconds
  useEffect(() => {
    if (step.id === "searching" && !hasNavigatedRef.current) {
      // Reset states when entering searching step
      setSearchProgress(0);
      setVisiblePosts(0);
      setSearchComplete(false);
      setShowEmailModal(false);

      // Progress bar: 0 to 100 over 11 seconds (110 intervals of 100ms)
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / 110); // ~0.91% per 100ms = 100% in 11 seconds
        });
      }, 100);

      // Posts appear one by one with random-feeling but static timing
      // First two come fast, rest at varied times, all 6 visible by 7 seconds
      const postTimings = [
        600,   // Post 1 - 0.6s (fast)
        1400,  // Post 2 - 1.4s (fast)
        2800,  // Post 3 - 2.8s
        4200,  // Post 4 - 4.2s
        5500,  // Post 5 - 5.5s
        6800,  // Post 6 - 6.8s (by 7th second)
      ];
      
      const postTimers: NodeJS.Timeout[] = [];
      postTimings.forEach((timing, index) => {
        const timer = setTimeout(() => {
          setVisiblePosts(index + 1);
        }, timing);
        postTimers.push(timer);
      });

      // Search complete after 11 seconds, then show email modal after brief delay
      const completeTimer = setTimeout(() => {
        setSearchComplete(true);
        // Show email modal 500ms after search complete popup appears
        setTimeout(() => {
          setShowEmailModal(true);
        }, 500);
      }, 11000);

      return () => {
        clearInterval(progressInterval);
        postTimers.forEach(t => clearTimeout(t));
        clearTimeout(completeTimer);
      };
    }
  }, [step.id]);

  // Handle email submission to proceed to checkout
  const handleEmailSubmit = () => {
    if (emailValue.trim() && emailValue.includes("@")) {
      hasNavigatedRef.current = true;
      navigate("/checkout", { state: { answers: { ...answers, email: emailValue } } });
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
                className="h-14 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-200 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
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
                  className="h-14 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-200 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                  autoFocus
                />
              </div>
              
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
            </div>
            <p className="text-gray-500 text-sm">{step.subtitle}</p>

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
          </>
        );

      case "info":
        if (step.id === "area_activity") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Tea is active in your area</h1>
              <p className="text-gray-500 text-sm">Here's what's happening near {getLocationDisplay()}</p>
              
              <div className="space-y-3 mt-4">
                <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">37 new posts</p>
                    <p className="text-sm text-gray-700">added this week nearby</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-xl p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">13 searches this hour</p>
                    <p className="text-sm text-gray-700">women checking nearby profiles</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-900 rounded-xl p-4 flex items-center gap-3">
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
                <div className="bg-white border border-gray-900 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c8e972] rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">👀</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">74% of women</p>
                    <p className="text-sm text-gray-500">check Tea before a first date</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-xl p-4 flex items-center gap-3 border border-gray-900">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center border border-gray-900">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">2.1M posts monthly</p>
                    <p className="text-sm text-gray-700">shared about men on dating apps</p>
                  </div>
                </div>
                
                <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3 border border-gray-900">
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
                    <div className="w-16 h-16 bg-[#c8e972] rounded-xl flex items-center justify-center mx-auto border border-gray-900 z-10 relative">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="bg-[#c8e972] text-xs font-medium px-2 py-1 rounded mt-1 text-center border border-gray-900">Your Tea post</div>
                    
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
                  <div className="flex-1 border border-gray-900 rounded-xl p-3">
                    <span className="text-xs bg-[#c8e972] px-2 py-0.5 rounded font-medium border border-gray-900">MINUTE 1</span>
                    <p className="font-semibold text-sm mt-1">She posts about you</p>
                    <p className="text-xs text-gray-500">One frustrated message after a date gone wrong</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-400 px-2 py-0.5 rounded font-medium border border-gray-900">HOUR 1</span>
                      <span className="text-xs text-gray-500">+500 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Local women see it</p>
                    <p className="text-xs text-gray-500">Tea surfaces posts by location</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">💬</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded font-medium border border-gray-900">DAY 1</span>
                      <span className="text-xs text-gray-500">+2,400 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Shared in group chats</p>
                    <p className="text-xs text-gray-500">"Girl, look this guy up before your date"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-900">
                    <span className="text-sm">📸</span>
                  </div>
                  <div className="flex-1 border border-gray-900 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-200 px-2 py-0.5 rounded font-medium border border-gray-900">FOREVER</span>
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
              
              <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3 mt-4 border border-gray-900">
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
                <div className="border border-gray-900 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">1</span>
                  <div>
                    <span className="font-semibold text-sm">We find the posts</span>
                    <span className="text-sm text-gray-500"> — our search finds all mentions of you</span>
                  </div>
                </div>
                
                <div className="border border-gray-900 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">2</span>
                  <div>
                    <span className="font-semibold text-sm">You review & choose</span>
                    <span className="text-sm text-gray-500"> — pick which posts you want removed</span>
                  </div>
                </div>
                
                <div className="border border-gray-900 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold border border-gray-900">3</span>
                  <div>
                    <span className="font-semibold text-sm">We handle the rest</span>
                    <span className="text-sm text-gray-500"> — takedown requests filed on your behalf</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border border-gray-900 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
                <div className="border border-gray-900 rounded-xl p-4 text-center">
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
              {experienceOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => toggleExperience(index)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedExperiences.includes(index)
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-900 text-lg">{option.emoji}</span>
                  <span className="text-sm text-gray-700">{option.text}</span>
                </button>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl p-4 mt-4 border border-gray-900">
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
                className="h-14 pl-14 pr-4 rounded-xl bg-white border border-gray-900 text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
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
            
            <div className="bg-[#c8e972] rounded-full py-2 px-4 flex items-center justify-center gap-2 mt-4 border border-gray-900">
              <span className="text-lg">👥</span>
              <span className="font-semibold text-sm">89 guys checked today</span>
            </div>

            <div className="space-y-3 mt-4">
              {testimonials.map((t, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-4 text-white border border-gray-900">
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
                          <span className="text-blue-400">✓</span>
                        </div>
                        <span className="text-xs text-gray-400">{t.handle}</span>
                      </div>
                    </div>
                    <X className="w-4 h-4 text-gray-500" />
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
            
            <div className="border border-gray-900 border-dashed rounded-xl p-8 mt-4 flex flex-col items-center justify-center">
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
            <div className="bg-[#c8e972] rounded-xl p-4 border border-gray-900">
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
                  <span className="text-sm text-gray-600">Scanning for name matches...</span>
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
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 fade-in duration-300">
                  {/* Tea icon */}
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="w-16 h-16 bg-[#c8e972] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🍵</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center">We found 6 potential posts!</h3>
                  <p className="text-gray-500 text-center text-sm mt-1">Get access to see what's being said about you</p>
                  
                  {/* Results box */}
                  <div className="bg-purple-100 rounded-xl p-3 mt-4">
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
                        className="h-12 pl-10 pr-4 rounded-xl bg-amber-50 border-2 border-amber-200 focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
                        onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {/* Submit button */}
                  <Button
                    onClick={handleEmailSubmit}
                    disabled={!emailValue.trim() || !emailValue.includes("@")}
                    className={`w-full h-12 rounded-xl font-semibold text-base mt-4 flex items-center justify-center gap-2 transition-colors ${
                      !emailValue.trim() || !emailValue.includes("@")
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    Unlock Full Report
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  
                  {/* Privacy note */}
                  <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
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
            <span className="font-bold">📊 The data:</span> The average Tea post gets seen by over <span className="font-bold">2,400 women</span> within the first week.
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
      case "one_post_spreads": return "The average Tea post reaches 2,400+ women";
      case "removal_service": return "We've helped 5,000+ guys remove posts";
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
            <span className="font-bold text-gray-800">tea checker</span>
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
