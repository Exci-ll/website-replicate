import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Check, CreditCard, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import reviewMatt from "@/assets/review-matt.jpeg";
import reviewJustin from "@/assets/review-justin.jpeg";
import reviewDaniel from "@/assets/review-daniel.jpeg";
interface TeaPost {
  id: number;
  type: string;
  emoji: string;
  preview: string;
  timeAgo: string;
  tagColor: string;
}

const mockPosts: TeaPost[] = [
  { id: 1, type: "Red Flag", emoji: "🚩", preview: "Ladies near your area, watch out for this one...", timeAgo: "2 months ago", tagColor: "bg-red-100 text-red-600" },
  { id: 2, type: "Warning", emoji: "⚠️", preview: "Met this guy on hinge and he seemed nice at first but...", timeAgo: "5 months ago", tagColor: "bg-yellow-100 text-yellow-700" },
  { id: 3, type: "Tea", emoji: "👀", preview: "Does anyone know a guy named ? I think he's...", timeAgo: "This month", tagColor: "bg-purple-100 text-purple-600" },
  { id: 4, type: "Heartbreak", emoji: "💔", preview: "Update on my previous post about the guy from your area...", timeAgo: "8 months ago", tagColor: "bg-pink-100 text-pink-600" },
  { id: 5, type: "Review", emoji: "🗣️", preview: "Just found out he was talking to multiple girls at the same time...", timeAgo: "3 months ago", tagColor: "bg-blue-100 text-blue-600" },
  { id: 6, type: "Experience", emoji: "📝", preview: "Has anyone else matched with ? He's around ...", timeAgo: "1 month ago", tagColor: "bg-green-100 text-green-600" },
  { id: 7, type: "Alert", emoji: "🔔", preview: "Anyone know this guy? He ghosted me after 3 dates...", timeAgo: "2 weeks ago", tagColor: "bg-orange-100 text-orange-600" },
  { id: 8, type: "Question", emoji: "❓", preview: "Is anyone else dating someone from this area? Need advice...", timeAgo: "4 months ago", tagColor: "bg-indigo-100 text-indigo-600" },
  { id: 9, type: "Story", emoji: "📖", preview: "Let me tell you about my experience with this guy...", timeAgo: "6 months ago", tagColor: "bg-teal-100 text-teal-600" },
  { id: 10, type: "Vent", emoji: "😤", preview: "I can't believe what happened last weekend...", timeAgo: "3 weeks ago", tagColor: "bg-rose-100 text-rose-600" },
  { id: 11, type: "Red Flag", emoji: "🚩", preview: "Another one to avoid in your neighborhood...", timeAgo: "1 week ago", tagColor: "bg-red-100 text-red-600" },
  { id: 12, type: "Warning", emoji: "⚠️", preview: "Be careful with guys who do this on first dates...", timeAgo: "7 months ago", tagColor: "bg-yellow-100 text-yellow-700" },
  { id: 13, type: "Tea", emoji: "👀", preview: "The tea is hot today ladies, listen up...", timeAgo: "2 months ago", tagColor: "bg-purple-100 text-purple-600" },
  { id: 14, type: "Heartbreak", emoji: "💔", preview: "I thought he was the one but then I found out...", timeAgo: "4 weeks ago", tagColor: "bg-pink-100 text-pink-600" },
  { id: 15, type: "Review", emoji: "🗣️", preview: "Dating app review: this guy is NOT what he seems...", timeAgo: "5 weeks ago", tagColor: "bg-blue-100 text-blue-600" },
  { id: 16, type: "Experience", emoji: "📝", preview: "My honest experience dating in this city...", timeAgo: "9 months ago", tagColor: "bg-green-100 text-green-600" },
  { id: 17, type: "Alert", emoji: "🔔", preview: "PSA about someone on Bumble in your area...", timeAgo: "10 days ago", tagColor: "bg-orange-100 text-orange-600" },
  { id: 18, type: "Question", emoji: "❓", preview: "Has anyone else noticed this pattern with guys...", timeAgo: "3 months ago", tagColor: "bg-indigo-100 text-indigo-600" },
  { id: 19, type: "Story", emoji: "📖", preview: "Storytime: what really happened on our second date...", timeAgo: "11 months ago", tagColor: "bg-teal-100 text-teal-600" },
  { id: 20, type: "Vent", emoji: "😤", preview: "I'm so done with dating apps after this experience...", timeAgo: "6 weeks ago", tagColor: "bg-rose-100 text-rose-600" },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};
  const [timeLeft, setTimeLeft] = useState(251);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);
    
    // Google Pay available on desktop and Android, not iOS
    if (!ios) {
      setIsGooglePayAvailable(true);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = () => {
    console.log("Processing payment...", { answers });
  };

  const scrollToPayment = () => {
    paymentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const progressSegments = Array.from({ length: 28 }).map((_, i) => {
    if (i < 3) return "bg-[#c8e972]";
    if (i < 6) return "bg-[#b8d962]";
    if (i < 8) return "bg-[#a8c952]";
    if (i < 10) return "bg-[#9cbd4a]";
    if (i < 12) return "bg-[#8eb342]";
    if (i < 14) return "bg-[#7fa33a]";
    if (i < 16) return "bg-[#d4e157]";
    if (i < 18) return "bg-[#ffeb3b]";
    if (i < 20) return "bg-[#ffc107]";
    if (i < 22) return "bg-[#ff9800]";
    if (i < 24) return "bg-[#ff7043]";
    if (i < 25) return "bg-[#ef5350]";
    return "bg-gray-200";
  });

  return (
    <div className="min-h-screen bg-[#eeecda] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl border-l border-r border-gray-900">
        {/* Header */}
        <header className="flex items-center justify-between py-3 px-4 bg-white border-b-2 border-gray-900 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center border border-gray-900">
              <span className="text-lg">🍵</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">tea finder</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={scrollToPayment}
            className="rounded-full border-gray-300 text-xs bg-gray-900 text-white hover:bg-gray-800"
          >
            Get the report
          </Button>
        </header>

        <main className="px-4 py-5 space-y-5">
          {/* Results Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">Results for {answers.name || "You"}</h1>
            <p className="text-gray-500 text-sm">
              Near {answers.location || "your area"} • Age {answers.age || ""}
            </p>
          </div>

          {/* Tea Posts Found Card - 10% smaller on desktop */}
          <div className="bg-[#c8e972] rounded-lg p-4 border border-gray-900 lg:scale-[0.90] lg:origin-top">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#b8d962] rounded flex items-center justify-center">
                  <span className="text-sm">🍵</span>
                </div>
                <span className="font-semibold text-sm text-gray-900">Tea Posts Found</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">6</span>
            </div>
            
            {/* Progress dots in white cylinder */}
            <div className="bg-white rounded-full px-3 py-2 mb-2">
              <div className="flex gap-0.5">
                {progressSegments.map((color, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${color}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end relative">
              {/* Triangle pointer pointing to last red dot */}
              <div className="absolute -top-4 right-[60px]">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-900"></div>
              </div>
              <span className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full">
                6 posts mentioning you
              </span>
            </div>
          </div>

          {/* Potential Posts - Auto-scrolling carousel */}
          <div>
            <h2 className="text-base font-bold mb-3 text-gray-900">Potential posts found</h2>
            <div className="overflow-hidden -mx-4">
              <div className="flex gap-3 px-4 animate-scroll-right">
                {/* Quadruple for 24s seamless loop at same speed */}
                {[...mockPosts, ...mockPosts, ...mockPosts, ...mockPosts].map((post, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="relative flex-shrink-0 w-40 bg-white rounded-lg p-3 border border-gray-900 overflow-hidden"
                  >
                    <div className="blur-sm opacity-50">
                      <div className="flex items-center gap-1 mb-2">
                        <span className={`text-[10px] ${post.tagColor} px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5`}>
                          {post.emoji} {post.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">{post.preview}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{post.timeAgo}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-medium">Locked</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unlock Section */}
          <div className="space-y-0">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4" />
              <h2 className="text-base font-semibold text-gray-900">Unlock your full Tea report</h2>
            </div>

            {/* Discount Timer + Pricing Card - 10% smaller on desktop */}
            <div className="border border-gray-900 rounded-lg overflow-hidden lg:scale-[0.90] lg:origin-top">
              {/* Discount Timer - black background */}
              <div className="bg-gray-900 text-white py-3 px-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-sm">50% discount expires in {formatTime(timeLeft)}</span>
              </div>

              {/* Pricing Card Content */}
              <div className="bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Full Tea Report</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#9cbd4a]" />
                        <span>Full post content</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#9cbd4a]" />
                        <span>Comments</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#9cbd4a]" />
                        <span>Alerts for new posts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-right relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8e972] rounded-full" />
                    <div className="pl-4">
                      <div className="flex items-start justify-end">
                        <span className="text-sm mt-1">$</span>
                        <span className="text-3xl font-bold">0</span>
                        <div className="flex flex-col ml-0.5">
                          <span className="text-lg font-bold">.59</span>
                          <span className="text-[10px] text-gray-500">per day</span>
                        </div>
                      </div>
                      <p className="text-[7.6px] text-gray-400 mt-1 opacity-60">$17.99/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Buttons - Floating outside rectangle */}
          <div className="space-y-2.5">
            {/* Desktop/Android with Google Pay: Show Google Pay + Link stacked */}
            {isGooglePayAvailable && !isIOS && (
              <>
                {/* Google Pay Button - Official Style */}
                <button 
                  className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-900 rounded-lg font-medium text-sm flex items-center justify-center gap-3 shadow-sm"
                  onClick={handlePayment}
                >
                  <svg width="41" height="17" viewBox="0 0 41 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.862.605-1.437 0-.575-.202-1.035-.605-1.437-.392-.403-.888-.604-1.488-.604h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.997-2.582.997h-2.486z" fill="#5F6368"/>
                    <path d="M27.194 10.442c0 .392.166.718.499.98.332.26.718.391 1.155.391.62 0 1.178-.23 1.675-.688.498-.459.747-1.001.747-1.626-.644-.236-1.323-.354-2.037-.354-.728 0-1.307.166-1.736.498-.419.333-.629.733-.629 1.199l.326-.4zm-.392-3.17c.498-.592 1.195-.888 2.093-.888.898 0 1.618.273 2.16.818.545.545.817 1.29.817 2.235v4.492h-1.407v-.997h-.058c-.52.795-1.207 1.193-2.06 1.193-.74 0-1.36-.222-1.86-.665-.498-.443-.747-1.01-.747-1.7 0-.722.271-1.296.812-1.723.542-.427 1.261-.64 2.16-.64.767 0 1.398.141 1.892.424v-.298c0-.474-.182-.874-.547-1.2-.365-.326-.8-.49-1.307-.49-.74 0-1.324.325-1.753.975l-1.297-.82.102.284z" fill="#5F6368"/>
                    <path d="M38.844 6.677l-4.93 11.334h-1.56l1.833-3.98-3.242-7.354h1.635l2.35 5.603h.034l2.28-5.603h1.6z" fill="#5F6368"/>
                    <path d="M13.309 7.505c0-.473-.04-.93-.116-1.37H6.796v2.59h3.654c-.156.856-.636 1.583-1.358 2.072v1.72h2.198c1.286-1.183 2.019-2.927 2.019-4.983v-.029z" fill="#4285F4"/>
                    <path d="M6.796 14.186c1.837 0 3.378-.608 4.503-1.649l-2.198-1.72c-.608.408-1.388.65-2.305.65-1.773 0-3.273-1.197-3.808-2.806H.71v1.776c1.117 2.216 3.412 3.749 6.086 3.749z" fill="#34A853"/>
                    <path d="M2.988 8.661c-.136-.408-.214-.843-.214-1.292s.078-.884.214-1.292V4.3H.71C.255 5.204 0 6.216 0 7.369s.255 2.165.71 3.069l2.278-1.777z" fill="#FBBC04"/>
                    <path d="M6.796 3.27c.999 0 1.896.344 2.602 1.019l1.951-1.951C10.16 1.186 8.622.552 6.796.552c-2.674 0-4.969 1.533-6.086 3.749l2.278 1.777c.535-1.61 2.035-2.806 3.808-2.806z" fill="#EA4335"/>
                  </svg>
                </button>

                {/* Link Button - Official Style */}
                <button 
                  className="w-full h-12 bg-[#00D66F] hover:bg-[#00C060] border border-gray-900 rounded-lg font-medium text-sm flex items-center justify-center shadow-sm"
                  onClick={handlePayment}
                >
                  <svg width="33" height="14" viewBox="0 0 33 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.22 13.04V0.96h2.56v10.32h5.08v1.76H1.22zm9.64 0V3.68h2.44v9.36h-2.44zm1.22-10.68c-.42 0-.77-.13-1.05-.39-.28-.26-.42-.58-.42-.96s.14-.7.42-.96c.28-.26.63-.39 1.05-.39.42 0 .77.13 1.05.39.28.26.42.58.42.96s-.14.7-.42.96c-.28.26-.63.39-1.05.39zm4.86 10.68V3.68h2.32v1.44h.08c.2-.52.52-.92.96-1.2.44-.28.97-.42 1.59-.42.9 0 1.61.29 2.13.87.52.58.78 1.39.78 2.43v6.24h-2.44V7.32c0-.62-.14-1.08-.42-1.38-.28-.3-.68-.45-1.2-.45-.54 0-.97.17-1.29.51-.32.34-.48.82-.48 1.44v5.6h-2.03zm9.84 0V0.96h2.44v5.16h.08l3.48-2.44h3.04l-4.12 2.88 4.4 6.48h-2.96l-3.08-4.68-.84.6v4.08h-2.44z" fill="white"/>
                  </svg>
                </button>
              </>
            )}

            {/* iOS: Show Link + Amazon Pay side by side */}
            {isIOS && (
              <div className="flex gap-2">
                {/* Link Button - Green */}
                <button 
                  className="flex-1 h-12 bg-[#00D924] hover:bg-[#00C020] text-white rounded-lg border border-gray-900 font-medium text-sm flex items-center justify-center gap-2"
                  onClick={handlePayment}
                >
                  <span className="text-white font-bold">▸</span>
                  <div className="w-7 h-4 bg-[#1A1F71] rounded-sm flex items-center justify-center">
                    <span className="text-white text-[7px] font-bold">VISA</span>
                  </div>
                  <span className="text-white">0375</span>
                </button>

                {/* Amazon Pay Button - Yellow */}
                <button 
                  className="flex-1 h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-lg border border-gray-900 font-medium text-sm flex items-center justify-center"
                  onClick={handlePayment}
                >
                  <span className="font-bold italic tracking-tight">amazon</span>
                  <span className="font-medium ml-1">pay</span>
                </button>
              </div>
            )}

            {/* See more toggle - only for desktop/Android */}
            {isGooglePayAvailable && !isIOS && (
              <button 
                onClick={() => setShowSeeMore(!showSeeMore)}
                className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                See more {showSeeMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}

            {/* Amazon Pay - shown when "See more" is clicked on desktop/Android */}
            {showSeeMore && isGooglePayAvailable && !isIOS && (
              <button 
                className="w-full h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-lg border border-gray-900 font-medium text-sm flex items-center justify-center"
                onClick={handlePayment}
              >
                <span className="font-bold italic tracking-tight">amazon</span>
                <span className="font-medium ml-1">pay</span>
              </button>
            )}
          </div>

          {/* Or pay with card divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-[#eeecda] px-3 text-xs text-gray-500">
              Or pay with card
            </span>
          </div>

          {/* Link Card Selection - Floating */}
          <div className="border border-gray-900 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <span className="text-[#00D924] font-bold text-lg">▸</span>
                <span className="font-bold text-gray-900">link</span>
              </div>
              <span className="text-gray-400 text-lg">•••</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-[#EB001B] rounded flex items-center justify-center overflow-hidden">
                  <div className="flex">
                    <div className="w-3 h-3 bg-[#EB001B] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#F79E1B] rounded-full -ml-1.5"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mastercard Debit</p>
                  <p className="text-xs text-gray-500">•••• 7567</p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
            </div>
            <button className="w-full mt-3 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg border border-gray-900 text-sm font-medium text-gray-900">
              Use this card
            </button>
          </div>

          {/* Pay Button */}
          <div ref={paymentSectionRef}>
            <Button 
              onClick={handlePayment}
              className="w-full h-14 rounded-full bg-gray-900 text-white hover:bg-gray-800 font-semibold text-base flex items-center justify-center gap-2"
            >
              Pay & Get Report
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <p className="text-[10px] text-gray-500">
              Guaranteed <span className="text-[#00D924]">safe & secure</span> checkout by Stripe
            </p>
          </div>
          <p className="text-center text-[10px] text-gray-400">
            By continuing you agree to be charged $17.99/month until canceled
          </p>

          {/* Payment Icons - Realistic Card Logos */}
          <div className="flex items-center justify-center gap-3">
            {/* Mastercard */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="10" r="8" fill="#EB001B"/>
                <circle cx="21" cy="10" r="8" fill="#F79E1B"/>
                <path d="M16 3.5C17.8 5 19 7.4 19 10C19 12.6 17.8 15 16 16.5C14.2 15 13 12.6 13 10C13 7.4 14.2 5 16 3.5Z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* Visa */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg width="40" height="13" viewBox="0 0 40 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 1L14 12H11L13.5 1H16.5ZM27.5 1L24.5 8.5L24 6L23 2C23 2 22.8 1 21.5 1H16L15.9 1.3C15.9 1.3 17.3 1.6 19 2.5L22 12H25.5L31 1H27.5ZM10 1L6.5 8.5L6 6L5 2C5 2 4.8 1 3.5 1H0L0 1.3C0 1.3 2 1.8 4 3.2L6.5 12H10L15 1H10Z" fill="#1A1F71"/>
              </svg>
            </div>
            {/* Amex */}
            <div className="w-12 h-8 bg-[#006FCF] rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-bold tracking-wide">AMEX</span>
            </div>
            {/* Discover */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
              <span className="text-[#FF6000] text-[8px] font-bold">DISCOVER</span>
            </div>
          </div>

          {/* Divider line before trusted section */}
          <div className="mx-6">
            <div className="border-t-2 border-gray-400" />
          </div>

          {/* Trust Section - no container, just text */}
          <div className="text-center py-2">
            <h2 className="text-base font-bold text-gray-900 mb-4">Trusted by 35,000+ guys</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">96%</p>
                <p className="text-[10px] text-gray-500">Accuracy Rate</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">35K+</p>
                <p className="text-[10px] text-gray-500">Guys Searched</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">4.7★</p>
                <p className="text-[10px] text-gray-500">User Rating</p>
              </div>
            </div>
          </div>

          {/* Divider line after trusted section */}
          <div className="mx-6">
            <div className="border-t-2 border-gray-400" />
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900 text-center">What guys are saying</h2>
            <div className="space-y-3">
              {[
                { name: "Matt T.", handle: "@matttt_22", image: reviewMatt, text: "Discovered 2 posts about me from last year. Cleared up everything, now I know why a few conversations went cold.", title: "Cleared up everything" },
                { name: "Justin R.", handle: "@justinratl", image: reviewJustin, text: "My search came back completely clean. Such a relief knowing there's nothing out there. Money well spent.", title: "Such a relief" },
                { name: "Daniel K.", handle: "@DannyT23542", image: reviewDaniel, text: "Found an old post about me with just my first name and neighborhood. Spot on results, couldn't believe the accuracy.", title: "Spot on results" },
              ].map((testimonial, index) => (
                <div key={index} className="bg-[#eeecda] rounded-lg p-4 border border-gray-900">
                  <h3 className="font-semibold text-sm mb-1.5 text-gray-900">{testimonial.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-gray-700">{testimonial.name}</span>
                    </div>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider line before anonymous section */}
          <div className="mx-6">
            <div className="border-t-2 border-gray-400" />
          </div>

          {/* Privacy Note - Light purple button style */}
          <div className="bg-[#e8d4f8] rounded-full py-3 px-6 text-center border border-gray-900">
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span className="font-semibold text-sm">100% Anonymous & Private</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center -mt-3">
            Your search is completely confidential. We never share your information or notify anyone that you checked.
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 pb-6">
            Questions? Contact us at{" "}
            <a href="mailto:support@teafinder.app" className="underline">
              support@teafinder.app
            </a>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Checkout;