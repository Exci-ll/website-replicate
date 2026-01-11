import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Check, CreditCard, Clock } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(251); // 4:11 in seconds
  const [selectedPayment, setSelectedPayment] = useState<"card" | "klarna" | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = () => {
    // Handle payment logic
    console.log("Processing payment...", { answers, selectedPayment });
  };

  // Generate colorful progress bar segments - exact match to original
  // Original pattern: green gradient → yellow → orange → pink/red → gray
  const progressSegments = Array.from({ length: 28 }).map((_, i) => {
    if (i < 3) return "bg-[#c8e972]"; // lime green
    if (i < 6) return "bg-[#b8d962]"; // lighter green
    if (i < 8) return "bg-[#a8c952]"; // green
    if (i < 10) return "bg-[#9cbd4a]"; // darker green
    if (i < 12) return "bg-[#8eb342]"; // even darker
    if (i < 14) return "bg-[#7fa33a]"; // blue-green
    if (i < 16) return "bg-[#d4e157]"; // yellow-green
    if (i < 18) return "bg-[#ffeb3b]"; // yellow
    if (i < 20) return "bg-[#ffc107]"; // orange-yellow
    if (i < 22) return "bg-[#ff9800]"; // orange
    if (i < 24) return "bg-[#ff7043]"; // orange-red
    if (i < 25) return "bg-[#ef5350]"; // red
    return "bg-gray-200"; // gray for remaining
  });

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8e972] rounded-lg flex items-center justify-center">
              <span className="text-lg">🍵</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">tea checker</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
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
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#c8e972] rounded flex items-center justify-center">
                  <span className="text-sm">🍵</span>
                </div>
                <span className="font-semibold text-sm text-gray-900">Tea Posts Found</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">6</span>
            </div>
            
            {/* Progress indicator - colorful gradient segments like original */}
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

          {/* Potential Posts - Horizontal Scroll */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900">Potential posts found</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {mockPosts.slice(0, 6).map((post) => (
                <div
                  key={post.id}
                  className="relative flex-shrink-0 w-40 bg-white rounded-xl p-3 border border-gray-200 overflow-hidden"
                >
                  <div className="blur-sm">
                    <div className="flex items-center gap-1 mb-2">
                      <span className={`text-[10px] ${post.tagColor} px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5`}>
                        {post.emoji} {post.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">{post.preview}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{post.timeAgo}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span className="text-xs font-medium">Locked</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock Section */}
          <div className="space-y-0">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4" />
              <h2 className="text-base font-semibold text-gray-900">Unlock your full Tea report</h2>
            </div>

            {/* Discount Timer - lime green background */}
            <div className="bg-[#c8e972] rounded-t-xl py-3 px-4 flex items-center justify-center gap-2">
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
                    <p className="text-xs text-gray-400 line-through">$1.20/day</p>
                  </div>
                </div>
              </div>

              {/* Amazon Pay Button - exact match to original */}
              <button 
                className="w-full h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-xl font-medium text-sm flex flex-col items-center justify-center"
                onClick={handlePayment}
              >
                <span className="flex items-center gap-1">
                  Pay with <span className="font-bold italic">amazon</span>
                </span>
                <span className="text-[10px] text-gray-600">Pay now or later</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-500">
                  Or pay with card
                </span>
              </div>

              {/* Payment Options - matching original exactly */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setSelectedPayment("card")}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                    selectedPayment === "card" 
                      ? "border-gray-900" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-sm text-gray-900">Card</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("klarna")}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                    selectedPayment === "klarna" 
                      ? "border-gray-900" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="w-5 h-5 bg-[#FFB3C7] text-gray-900 rounded text-[10px] font-bold flex items-center justify-center">K</span>
                  <span className="font-medium text-sm text-gray-900">Klarna</span>
                </button>
              </div>

              {/* Pay Button - black */}
              <Button 
                onClick={handlePayment}
                className="w-full h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-semibold text-sm flex items-center justify-center gap-2"
              >
                Pay & Get Report
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-[10px] text-gray-500 mt-3">
                Guaranteed safe & secure checkout by Stripe
              </p>
              <p className="text-center text-[10px] text-gray-500 mt-1">
                By continuing you agree to be charged $17.99/month until canceled
              </p>

              {/* Payment Icons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-blue-700">VISA</div>
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-blue-900">AMEX</div>
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-red-600">MC</div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h2 className="text-sm font-semibold text-center mb-4 text-gray-900">Trusted by 50,000+ guys</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">94%</p>
                <p className="text-[10px] text-gray-500">Accuracy Rate</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">50K+</p>
                <p className="text-[10px] text-gray-500">Searches</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#9cbd4a]">4.8★</p>
                <p className="text-[10px] text-gray-500">User Rating</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900">What guys are saying</h2>
            <div className="space-y-3">
              {[
                { name: "Mike T.", avatar: "12", text: "Found 3 posts about me. Now I understand why some dates felt off. At least I can address the misconceptions now.", title: "Finally know where I stand" },
                { name: "James R.", avatar: "33", text: "Nothing came up for me which was actually a huge relief. Worth every penny just to know I'm in the clear.", title: "Peace of mind is priceless" },
                { name: "David K.", avatar: "59", text: "Found a post from my ex I didn't even know existed. The details matched perfectly. Eye-opening experience.", title: "Incredibly accurate" },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-sm mb-1.5 text-gray-900">{testimonial.title}</h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://i.pravatar.cc/100?img=${testimonial.avatar}`}
                      alt={testimonial.name}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-xs font-medium text-gray-700">{testimonial.name}</span>
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
            <a href="mailto:support@teachecker.app" className="underline">
              support@teachecker.app
            </a>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Checkout;