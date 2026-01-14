import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Check, CreditCard, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center">
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

          {/* Tea Posts Found Card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-[#c8e972] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#c8e972] rounded flex items-center justify-center">
                  <span className="text-sm">🍵</span>
                </div>
                <span className="font-semibold text-sm text-gray-900">Tea Posts Found</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">6</span>
            </div>
            
            <div className="flex gap-0.5 mb-2">
              {progressSegments.map((color, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm ${color}`}
                />
              ))}
            </div>
            <div className="flex justify-end">
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
                {/* Duplicate posts for seamless loop */}
                {[...mockPosts.slice(0, 6), ...mockPosts.slice(0, 6)].map((post, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="relative flex-shrink-0 w-40 bg-gray-100 rounded-xl p-3 border-2 border-gray-900 overflow-hidden"
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

            {/* Discount Timer - black background */}
            <div className="bg-gray-900 text-white rounded-t-xl py-3 px-4 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">50% discount expires in {formatTime(timeLeft)}</span>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-4">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Full Tea Report</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#9cbd4a]" />
                      <span>Full post content & context</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#9cbd4a]" />
                      <span>Comments & engagement</span>
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

              {/* Payment Buttons */}
              <div className="space-y-2.5">
                {/* Desktop/Android with Google Pay: Show Google Pay + Link stacked */}
                {isGooglePayAvailable && !isIOS && (
                  <>
                    {/* Google Pay Button - Official Style */}
                    <button 
                      className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-md font-medium text-sm flex items-center justify-center gap-3 shadow-sm"
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
                      className="w-full h-12 bg-[#00D66F] hover:bg-[#00C060] rounded-md font-medium text-sm flex items-center justify-center shadow-sm"
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
                      className="flex-1 h-12 bg-[#00D924] hover:bg-[#00C020] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
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
                      className="flex-1 h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-lg font-medium text-sm flex items-center justify-center"
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
                    className="w-full h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-lg font-medium text-sm flex items-center justify-center"
                    onClick={handlePayment}
                  >
                    <span className="font-bold italic tracking-tight">amazon</span>
                    <span className="font-medium ml-1">pay</span>
                  </button>
                )}
              </div>

              {/* Or pay with card divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-500">
                  Or pay with card
                </span>
              </div>

              {/* Link Card Selection */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[#00D924] font-bold text-lg">▸</span>
                    <span className="font-bold text-gray-900">link</span>
                  </div>
                  <span className="text-gray-400 text-lg">•••</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
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
                <button className="w-full mt-3 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-900">
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

              <div className="flex items-center justify-center gap-1 mt-3">
                <Lock className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-500">
                  Guaranteed <span className="text-[#00D924]">safe & secure</span> checkout by Stripe
                </p>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-1">
                By continuing you agree to be charged $17.99/month until canceled
              </p>

              {/* Payment Icons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-10 h-6 bg-[#EB001B] rounded flex items-center justify-center overflow-hidden">
                  <div className="flex">
                    <div className="w-2.5 h-2.5 bg-[#EB001B] rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-[#F79E1B] rounded-full -ml-1"></div>
                  </div>
                </div>
                <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold tracking-tight">VISA</span>
                </div>
                <div className="w-10 h-6 bg-[#006FCF] rounded flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">AMEX</span>
                </div>
                <div className="w-10 h-6 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">■</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h2 className="text-sm font-semibold text-center mb-4 text-gray-900">Trusted by 35,000+ guys</h2>
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

          {/* Testimonials */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900">What guys are saying</h2>
            <div className="space-y-3">
              {[
                { name: "Marcus T.", avatar: "12", text: "Found 3 posts about me. Now I understand why some dates felt off. At least I can address the misconceptions now.", title: "Finally know where I stand" },
                { name: "Jason R.", avatar: "33", text: "Nothing came up for me which was actually a huge relief. Worth every penny just to know I'm in the clear.", title: "Peace of mind is priceless" },
                { name: "Derek K.", avatar: "59", text: "Found a post from my ex I didn't even know existed. The details matched perfectly. Eye-opening experience.", title: "Incredibly accurate" },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-sm mb-1.5 text-gray-900">{testimonial.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/100?img=${testimonial.avatar}`}
                        alt={testimonial.name}
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="text-xs font-medium text-gray-700">{testimonial.name}</span>
                    </div>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Lock className="w-4 h-4" />
              <span className="font-semibold text-sm">100% Anonymous & Private</span>
            </div>
            <p className="text-xs text-gray-500">
              Your search is completely confidential. We never share your information or notify anyone that you checked.
            </p>
          </div>

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