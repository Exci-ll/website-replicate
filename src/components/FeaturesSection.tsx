import { Search, Eye, Shield, Star } from "lucide-react";

const features = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Find posts about you",
    description: "Search the Tea database by name, age, and location to find if anyone has posted about you",
    color: "bg-lime",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "See what's being said",
    description: "Read the full content of any posts mentioning you, including warnings, reviews, and experiences",
    color: "bg-foreground text-card",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Protect your reputation",
    description: "Know what's out there so you can address any misunderstandings or false claims",
    color: "bg-lime",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 md:px-6 bg-lime mx-4 md:mx-6 rounded-3xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 uppercase tracking-tight">
          Use Tea Checker to
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 card-hover">
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Reviews Badge */}
        <div className="flex items-center justify-center gap-4 bg-card rounded-full py-3 px-6 w-fit mx-auto">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="font-semibold">274,436+ reviews</span>
        </div>

        {/* Avoid Red Flags */}
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Avoid Red Flags</h3>
          <div className="flex -space-x-2">
            {[10, 11, 12, 13].map((img) => (
              <img 
                key={img}
                src={`https://i.pravatar.cc/50?img=${img}`} 
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-card"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
