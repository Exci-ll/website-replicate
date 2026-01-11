import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

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
    subtitle: "Or the name/nickname you use on dating apps",
    tipLabel: "Pro Tip:",
    tipText: "We'll also search for common nicknames and variations of your name to ensure we don't miss any posts.",
    tipColor: "green",
    bottomText: "Tea has 11M+ women sharing dating experiences",
  },
  {
    id: "age",
    type: "number",
    question: "How old are you?",
    emoji: "🎂",
    placeholder: "Enter your age",
    subtitle: "We'll search posts mentioning ages within ±3 years",
    tipLabel: "Why we ask:",
    tipText: "Tea posts often include age. This helps us find relevant matches more accurately.",
    tipColor: "purple",
    bottomText: "We search across all age-related name variations",
  },
  {
    id: "location",
    type: "location",
    question: "Where do you date?",
    emoji: "📍",
    placeholder: "Start typing your city...",
    subtitle: "The city or area where you've been active on dating apps",
    bottomText: "Location matching helps find local posts",
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
    subtitle: "This helps us match posts that mention your social media",
    placeholder: "@yourusername",
    tipLabel: "Why this helps:",
    tipText: "Tea posts sometimes mention Instagram handles. Adding yours increases the chances of finding relevant posts.",
    tipColor: "purple",
    bottomText: "Instagram helps us verify your identity",
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
  { emoji: "😤", text: "She stopped replying mid-conversation for no reason" },
  { emoji: "👀", text: "Her friends gave you weird looks when you first met them" },
  { emoji: "📱", text: "The vibe shifted after she 'checked her phone'" },
  { emoji: "🤔", text: "Matches who seemed interested never responded" },
];

// Testimonials for Success Stories step
const testimonials = [
  {
    name: "Mike T.",
    handle: "@miket_nyc",
    avatar: "12",
    text: "Found out my ex posted about me. Now I understand why dates have been weird lately. Knowledge is power!",
    date: "2:30 PM · Dec 8, 2025",
    views: "12.5K",
  },
  {
    name: "James R.",
    handle: "@jamesryan22",
    avatar: "33",
    text: "Nothing came up which was a huge relief. Worth every penny just for the peace of mind.",
    date: "9:45 AM · Dec 9, 2025",
    views: "8,942",
  },
  {
    name: "David K.",
    handle: "@davidk_la",
    avatar: "59",
    text: "The accuracy was insane. Found a post from 2 years ago using just my first name and city. Eye-opening.",
    date: "4:15 PM · Dec 10, 2025",
    views: "5,231",
  },
  {
    name: "Chris M.",
    handle: "@chrism_boston",
    avatar: "45",
    text: "Found exactly what I was looking for in less than 5 minutes. The report was super detailed.",
    date: "11:20 AM · Dec 11, 2025",
    views: "3,890",
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
      }, 78);

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
                <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">47 new posts</p>
                    <p className="text-sm text-gray-700">added this week in your area</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">12 searches this hour</p>
                    <p className="text-sm text-gray-700">women checking profiles nearby</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚨</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">3 hours ago</p>
                    <p className="text-sm text-gray-500">last post about a man your age</p>
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
              <p className="text-gray-500 text-sm">What women say on Tea can affect your dating life in ways you might not realize.</p>
              
              <div className="space-y-3 mt-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c8e972] rounded-lg flex items-center justify-center">
                    <span className="text-xl">👀</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">73% of women</p>
                    <p className="text-sm text-gray-500">check Tea before a first date</p>
                  </div>
                </div>
                
                <div className="bg-[#e8d4f8] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">2.3M posts monthly</p>
                    <p className="text-sm text-gray-700">shared about men on dating apps</p>
                  </div>
                </div>
                
                <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl">❤️</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">1 in 4 guys</p>
                    <p className="text-sm text-gray-700">have been posted about without knowing</p>
                  </div>
                </div>
              </div>
            </>
          );
        }

        if (step.id === "one_post_spreads") {
          return (
            <>
              <h1 className="text-2xl font-bold text-gray-900">One post. Hundreds of eyes.</h1>
              <p className="text-gray-500 text-sm">Here's how quickly a Tea post spreads...</p>
              
              {/* Visual diagram - simplified representation */}
              <div className="relative py-8">
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Center icon */}
                    <div className="w-16 h-16 bg-[#c8e972] rounded-xl flex items-center justify-center mx-auto border-2 border-[#c8e972] z-10 relative">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="bg-[#c8e972] text-xs font-medium px-2 py-1 rounded mt-1 text-center">Your Tea post</div>
                    
                    {/* Orbiting avatars - decorative circles */}
                    <div className="absolute -top-4 -left-8 w-6 h-6 rounded-full bg-gray-200"></div>
                    <div className="absolute -top-2 left-16 w-8 h-8 rounded-full bg-pink-200"></div>
                    <div className="absolute top-4 -right-10 w-6 h-6 rounded-full bg-gray-300"></div>
                    <div className="absolute top-12 -left-12 w-7 h-7 rounded-full bg-gray-200"></div>
                    <div className="absolute -bottom-2 left-20 w-5 h-5 rounded-full bg-pink-100"></div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📋</span>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <span className="text-xs bg-[#c8e972] px-2 py-0.5 rounded font-medium">MINUTE 1</span>
                    <p className="font-semibold text-sm mt-1">She posts about you</p>
                    <p className="text-xs text-gray-500">One frustrated message after a bad date</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-400 px-2 py-0.5 rounded font-medium">HOUR 1</span>
                      <span className="text-xs text-gray-500">+500 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Women in your area see it</p>
                    <p className="text-xs text-gray-500">Tea surfaces posts by location</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">💬</span>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded font-medium">DAY 1</span>
                      <span className="text-xs text-gray-500">+2,400 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Shared in group chats</p>
                    <p className="text-xs text-gray-500">"Girl, check this guy out before your date"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">📸</span>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-purple-200 px-2 py-0.5 rounded font-medium">FOREVER</span>
                      <span className="text-xs text-gray-500">∞ 👀</span>
                    </div>
                    <p className="font-semibold text-sm mt-1">Screenshots live on</p>
                    <p className="text-xs text-gray-500">Saved, shared, and searched... indefinitely</p>
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
              <p className="text-gray-500 text-sm">If we find posts about you, our team can help get them taken down.</p>
              
              <div className="bg-[#c8e972] rounded-xl p-4 flex items-center gap-3 mt-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Free Removal Service</p>
                  <p className="text-sm text-gray-700">We handle the legal takedown requests so you don't have to. Most posts are removed within 48-72 hours.</p>
                </div>
              </div>

              <p className="font-semibold text-sm mt-6 mb-3 text-gray-500">HOW IT WORKS</p>
              
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <span className="font-semibold text-sm">We find the posts</span>
                    <span className="text-sm text-gray-500"> — our search identifies all mentions of you</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <span className="font-semibold text-sm">You review & choose</span>
                    <span className="text-sm text-gray-500"> — select which posts you want removed</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#c8e972] rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <span className="font-semibold text-sm">We handle the rest</span>
                    <span className="text-sm text-gray-500"> — legal takedown requests filed on your behalf</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-gray-500">Success rate</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 text-center">
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
            <p className="text-gray-500 text-sm">Select any that resonate with you...</p>
            
            <div className="space-y-2 mt-4">
              {experienceOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => toggleExperience(index)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedExperiences.includes(index)
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm text-gray-700">{option.text}</span>
                </button>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <span className="font-semibold text-white">The connection?</span>
              </div>
              <p className="text-sm text-gray-300">
                She may have searched you on Tea <span className="text-[#c8e972] font-medium">before you even met</span>. What she found could have changed everything.
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📷</span>
              <Input
                type="text"
                placeholder={step.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 pl-12 pr-4 rounded-xl bg-[#f0e8f8] border-2 border-[#e8d4f8] text-base focus-visible:ring-2 focus-visible:ring-[#c8e972] focus-visible:border-[#c8e972]"
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
            <p className="text-gray-500 text-sm">See how other guys found out what's being said about them.</p>
            
            <div className="bg-[#c8e972] rounded-full py-2 px-4 flex items-center justify-center gap-2 mt-4">
              <span className="text-lg">👥</span>
              <span className="font-semibold text-sm">89 guys checked today</span>
            </div>

            <div className="space-y-3 mt-4">
              {testimonials.map((t, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/100?img=${t.avatar}`}
                        alt={t.name}
                        className="w-10 h-10 rounded-full"
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
            <p className="text-gray-500 text-sm">Our AI can match your face against photos shared in Tea posts. This is optional but increases accuracy.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mt-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-[#c8e972] rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-900" />
              </div>
              <p className="font-medium text-gray-900">Click to upload photos</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
            </div>
          </>
        );

      case "searching":
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#c8e972]/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#c8e972]/40 flex items-center justify-center animate-pulse">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c8e972] animate-spin" />
            </div>
            
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
              <p className="text-gray-600 font-medium">Searching the Tea database...</p>
              <p className="text-sm text-gray-500">Scanning 11M+ posts for mentions of you</p>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2.5 h-2.5 bg-[#c8e972] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
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
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-auto">
          <p className="text-sm">
            <span className="font-bold">💡 Did you know:</span> Women often search Tea before a first date to see if there's any "tea" on their match.
          </p>
        </div>
      );
    }
    if (step.id === "whats_at_stake") {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-auto">
          <p className="text-sm">
            <span className="font-bold">🤔 Think about it:</span> That awkward silence on a date? The sudden ghosting? She might have already read about you.
          </p>
        </div>
      );
    }
    if (step.id === "has_happened") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold">The truth:</span> You can't control what's been said. But you can find out what's out there.
          </p>
        </div>
      );
    }
    if (step.id === "one_post_spreads") {
      return (
        <div className="bg-[#c8e972] rounded-xl p-4 mt-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold">📊 The data:</span> The average Tea post is viewed by over <span className="font-bold">2,400 women</span> within the first week.
          </p>
        </div>
      );
    }
    if (step.id === "removal_service") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-4">
          <p className="text-sm text-gray-800">
            <span className="font-bold">✨ Good news:</span> Takedown service is included free with your report if posts are found. You're protected either way.
          </p>
        </div>
      );
    }
    if (step.id === "instagram") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-auto">
          <p className="text-sm text-gray-800">
            <span className="font-bold">Why this helps:</span> Tea posts sometimes mention Instagram handles. Adding yours increases the chances of finding relevant posts.
          </p>
        </div>
      );
    }
    if (step.id === "photo") {
      return (
        <div className="bg-[#e8d4f8] rounded-xl p-4 mt-auto">
          <p className="text-sm text-gray-800">
            <span className="font-bold">Privacy note:</span> Your photos are only used for matching and are never stored or shared. You can skip this step if you prefer.
          </p>
        </div>
      );
    }

    // Standard tip box for text/number steps
    if (step.tipText && step.tipLabel) {
      const bgColor = step.tipColor === "purple" ? "bg-[#e8d4f8]" : "bg-[#d4e8b8]";
      return (
        <div className={`${bgColor} rounded-xl p-4 mt-auto`}>
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
      case "area_activity": return "New posts are added every minute";
      case "whats_at_stake": return "Don't let your reputation be a mystery";
      case "has_happened": return "73% of women check Tea before a first date";
      case "one_post_spreads": return "The average Tea post is seen by 2,400+ women";
      case "removal_service": return "We've helped 5,000+ guys remove unwanted posts";
      case "success_stories": return "Join thousands who've found answers";
      case "photo": return "Photos increase search accuracy by 47%";
      default: return "Tea has 11M+ women sharing dating experiences";
    }
  };

  // Get button text for current step
  const getButtonText = () => {
    if (step.id === "photo") return "Search Tea 🍵";
    return "Next";
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
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
            <span className="font-bold text-gray-800">tea finder</span>
          </div>
        </header>

        {/* Progress Bar - 12 segments */}
        <div className="px-4 py-2">
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

        {/* Content */}
        <main className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
          <div className="space-y-4 flex-1 flex flex-col">
            {renderStepContent()}
            
            {/* Tip box */}
            {step.type !== "searching" && renderTipBox()}
          </div>

          {/* Spacer */}
          <div className="min-h-[20px]" />

          {/* Bottom Section */}
          {step.type !== "searching" && (
            <div className="space-y-4 pb-6 mt-auto">
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
