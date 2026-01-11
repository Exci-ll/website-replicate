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
  { id: 6, type: "Experience", emoji: "📝", preview: "Has anyone else matched with ? He's around...", timeAgo: "1 month ago", tagColor: "bg-green-100 text-green-600" },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};
  const [timeLeft, setTimeLeft] = useState(251); // 4:11 in seconds
  const [selectedPayment, setSelectedPayment] = useState<"card" | "klarna">("card");

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
            className="rounded-full border-gray-300 text-xs"
            onClick={() => navigate("/")}
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
            
            {/* Progress indicator - colorful segments like original */}
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm ${
                    i < 6 ? "bg-[#c8e972]" :
                    i < 10 ? "bg-[#b8d962]" :
                    i < 14 ? "bg-yellow-400" :
                    i < 17 ? "bg-orange-400" :
                    i < 19 ? "bg-red-400" :
                    "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                6 posts mentioning you
              </span>
            </div>
          </div>

          {/* Potential Posts */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900">Potential posts found</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mockPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="relative flex-shrink-0 w-36 bg-white rounded-xl p-3 border border-gray-200 overflow-hidden"
                >
                  <div className="blur-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-xs ${post.tagColor} px-1.5 py-0.5 rounded text-[10px] font-medium`}>
                        {post.emoji} {post.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-3 leading-tight">{post.preview}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{post.timeAgo}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
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

            {/* Discount Timer - lime background */}
            <div className="bg-[#c8e972] rounded-t-xl py-2.5 px-4 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">50% discount expires in {formatTime(timeLeft)}</span>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Full Tea Report</h3>
                  <ul className="space-y-1.5 mt-2">
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
                <div className="text-right bg-[#c8e972]/30 rounded-xl px-3 py-2">
                  <div className="flex items-start justify-end">
                    <span className="text-sm mt-1">$</span>
                    <span className="text-3xl font-bold">0</span>
                    <div className="flex flex-col ml-0.5">
                      <span className="text-lg font-bold">59</span>
                      <span className="text-[10px] text-gray-500">per day</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-through">$1.20/day</p>
                </div>
              </div>

              {/* Amazon Pay - exact yellow */}
              <Button 
                className="w-full h-11 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-lg mb-1 font-medium text-sm"
                onClick={handlePayment}
              >
                <span className="flex items-center gap-1">
                  Pay with <span className="font-bold italic">amazon</span>
                </span>
              </Button>
              <p className="text-center text-xs text-gray-500 mb-4">Pay now or later</p>

              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-500">
                  Or pay with card
                </span>
              </div>

              {/* Payment Options */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setSelectedPayment("card")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedPayment === "card" 
                      ? "border-gray-900" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium text-sm">Card</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("klarna")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedPayment === "klarna" 
                      ? "border-gray-900" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="w-5 h-5 bg-[#FFB3C7] text-gray-900 rounded text-xs font-bold flex items-center justify-center">K</span>
                  <span className="font-medium text-sm">Klarna</span>
                </button>
              </div>

              {/* Pay Button - black */}
              <Button 
                onClick={handlePayment}
                className="w-full h-12 rounded-lg bg-gray-900 text-white hover:bg-gray-800 font-semibold text-sm flex items-center justify-center gap-2"
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
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-blue-600">VISA</div>
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-blue-800">AMEX</div>
                <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-orange-600">MC</div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h2 className="text-sm font-semibold text-center mb-3 text-gray-900">Trusted by 50,000+ guys</h2>
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
                { name: "Mike T.", avatar: "12", text: "Found 3 posts about me. Now I understand why some dates felt off.", title: "Finally know where I stand" },
                { name: "James R.", avatar: "33", text: "Nothing came up which was a huge relief. Worth every penny.", title: "Peace of mind is priceless" },
                { name: "David K.", avatar: "59", text: "Found a post from my ex. The details matched perfectly.", title: "Incredibly accurate" },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-3 border border-gray-200">
                  <h3 className="font-semibold text-sm mb-1 text-gray-900">{testimonial.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{testimonial.text}</p>
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://i.pravatar.cc/100?img=${testimonial.avatar}`}
                      alt={testimonial.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs font-medium">{testimonial.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-gray-100 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">100% Anonymous & Private</span>
            </div>
            <p className="text-[10px] text-gray-500">
              Your search is completely confidential. We never share your information.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-gray-500 pb-6">
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