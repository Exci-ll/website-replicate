const logos = [
  "Vanity Fair",
  "TechCrunch",
  "WIRED",
  "Vogue",
  "Mashable",
  "GQ",
  "Cosmopolitan",
  "VICE",
];

const LogoTicker = () => {
  return (
    <div className="w-full bg-lime py-3 overflow-hidden my-6">
      <div className="flex scrolling-ticker">
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex items-center gap-4 px-4 whitespace-nowrap">
            <div className="w-5 h-5 bg-lime-dark/30 rounded flex items-center justify-center">
              <span className="text-sm">🍵</span>
            </div>
            <span className="text-sm font-semibold text-foreground/90">{logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;
