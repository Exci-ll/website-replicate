import { Search, Eye, Shield, Star } from "lucide-react";

const features = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "Find posts about you",
    description: "Search the Tea database by name, age, and location to find if anyone has posted about you",
    iconBg: "bg-[#c8e972]",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "See what's being said",
    description: "Read the full content of any posts mentioning you, including warnings, reviews, and experiences",
    iconBg: "bg-gray-900 text-white",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Protect your reputation",
    description: "Know what's out there so you can address any misunderstandings or false claims",
    iconBg: "bg-[#c8e972]",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 px-4 md:px-6 bg-[#c8e972] mx-4 md:mx-6 rounded-3xl">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10 uppercase tracking-tight text-gray-900">
          Use Tea Checker to
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 card-hover">
              <div className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-3`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Reviews Badge */}
        <div className="flex items-center justify-center gap-3 bg-white rounded-full py-2.5 px-5 w-fit mx-auto">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-sm text-gray-900">274,436+ reviews</span>
        </div>

        {/* Avoid Red Flags */}
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-3 text-gray-900">Avoid Red Flags</h3>
          <div className="flex -space-x-2">
            {[10, 11, 12, 13].map((img) => (
              <img 
                key={img}
                src={`https://i.pravatar.cc/50?img=${img}`} 
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;