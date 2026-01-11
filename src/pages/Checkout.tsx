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
}

const mockPosts: TeaPost[] = [
  { id: 1, type: "Red Flag", emoji: "🚩", preview: "Ladies near your area, watch out for this one...", timeAgo: "2 months ago" },
  { id: 2, type: "Warning", emoji: "⚠️", preview: "Met this guy on hinge and he seemed nice at first but...", timeAgo: "5 months ago" },
  { id: 3, type: "Tea", emoji: "👀", preview: "Does anyone know a guy named ? I think he's...", timeAgo: "This month" },
  { id: 4, type: "Heartbreak", emoji: "💔", preview: "Update on my previous post about the guy from your area...", timeAgo: "8 months ago" },
  { id: 5, type: "Review", emoji: "🗣️", preview: "Just found out he was talking to multiple girls at the same time...", timeAgo: "3 months ago" },
  { id: 6, type: "Experience", emoji: "📝", preview: "Has anyone else matched with ? He's around...", timeAgo: "1 month ago" },
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-6 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍵</span>
          <span className="font-bold text-foreground">tea checker</span>
        </div>
        <Button 
          variant="outline" 
          className="rounded-full border-foreground/20"
          onClick={() => navigate("/")}
        >
          Get the report
        </Button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Results Header */}
        <div>
          <h1 className="text-2xl font-bold">Results for {answers.name || "You"}</h1>
          <p className="text-muted-foreground text-sm">
            Near {answers.city || "your area"} • Age {answers.age || ""}
          </p>
        </div>

        {/* Tea Posts Found Card */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍵</span>
              <span className="font-semibold">Tea Posts Found</span>
            </div>
            <span className="text-2xl font-bold text-red-500">6</span>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < 14 ? "bg-lime" : i === 14 ? "bg-red-400" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-right">6 posts mentioning you</p>
        </div>

        {/* Potential Posts */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Potential posts found</h2>
          <div className="grid grid-cols-3 gap-3">
            {mockPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="relative bg-card rounded-xl p-3 border border-border overflow-hidden"
              >
                <div className="blur-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">{post.emoji}</span>
                    <span className="text-xs font-medium text-red-500">{post.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.preview}</p>
                  <p className="text-xs text-muted-foreground mt-1">{post.timeAgo}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs font-medium">Locked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Unlock your full Tea report</h2>
          </div>

          {/* Discount Timer */}
          <div className="bg-lime rounded-t-xl py-2 px-4 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">50% discount expires in {formatTime(timeLeft)}</span>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-b-xl border border-t-0 border-border p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Full Tea Report</h3>
                <ul className="space-y-1 mt-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-lime-dark" />
                    Full post content & context
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-lime-dark" />
                    Comments & engagement
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-lime-dark" />
                    Alerts for new posts
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <div className="flex items-start">
                  <span className="text-sm">$</span>
                  <span className="text-4xl font-bold">0</span>
                  <div className="flex flex-col ml-1">
                    <span className="text-xl font-bold">59</span>
                    <span className="text-xs text-muted-foreground">per day</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-through">$1.20/day</p>
              </div>
            </div>

            {/* Amazon Pay */}
            <Button 
              className="w-full h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-foreground rounded-xl mb-3 font-medium"
              onClick={handlePayment}
            >
              <span className="flex items-center gap-2">
                Pay with <span className="font-bold">amazon</span>
              </span>
            </Button>
            <p className="text-center text-xs text-muted-foreground mb-4">Pay now or later</p>

            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-2 text-sm text-muted-foreground">
                Or pay with card
              </span>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => setSelectedPayment("card")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  selectedPayment === "card" 
                    ? "border-foreground bg-muted" 
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Card</span>
              </button>
              
              <button
                onClick={() => setSelectedPayment("klarna")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  selectedPayment === "klarna" 
                    ? "border-foreground bg-muted" 
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <span className="w-5 h-5 bg-pink-400 text-white rounded text-xs font-bold flex items-center justify-center">K</span>
                <span className="font-medium">Klarna</span>
              </button>
            </div>

            {/* Pay Button */}
            <Button 
              onClick={handlePayment}
              className="w-full h-14 rounded-xl bg-foreground text-card hover:opacity-90 font-semibold text-lg flex items-center justify-center gap-2"
            >
              Pay & Get Report
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              Guaranteed safe & secure checkout by Stripe
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
              By continuing you agree to be charged $17.99/month until canceled
            </p>

            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-blue-600">VISA</div>
              <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-blue-800">AMEX</div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-center mb-4">Trusted by 50,000+ guys</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-lime-dark">94%</p>
              <p className="text-xs text-muted-foreground">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lime-dark">50K+</p>
              <p className="text-xs text-muted-foreground">Searches</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lime-dark">4.8★</p>
              <p className="text-xs text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-lg font-semibold mb-4">What guys are saying</h2>
          <div className="space-y-4">
            {[
              { name: "Mike T.", avatar: "12", text: "Found 3 posts about me. Now I understand why some dates felt off. At least I can address the misconceptions now.", title: "Finally know where I stand" },
              { name: "James R.", avatar: "33", text: "Nothing came up for me which was actually a huge relief. Worth every penny just to know I'm in the clear.", title: "Peace of mind is priceless" },
              { name: "David K.", avatar: "59", text: "Found a post from my ex I didn't even know existed. The details matched perfectly. Eye-opening experience.", title: "Incredibly accurate" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-4 border border-border">
                <h3 className="font-semibold mb-2">{testimonial.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{testimonial.text}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://i.pravatar.cc/100?img=${testimonial.avatar}`}
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-muted rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            <span className="font-semibold text-sm">100% Anonymous & Private</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your search is completely confidential. We never share your information or notify anyone that you checked.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-8">
          Questions? Contact us at{" "}
          <a href="mailto:support@teachecker.app" className="underline">
            support@teachecker.app
          </a>
        </p>
      </main>
    </div>
  );
};

export default Checkout;
