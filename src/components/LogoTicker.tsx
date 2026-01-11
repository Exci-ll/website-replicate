const logos = [
  "Mashable",
  "GQ",
  "Cosmopolitan",
  "VICE",
  "Vanity Fair",
  "TechCrunch",
  "WIRED",
  "Vogue",
];

const LogoTicker = () => {
  return (
    <div className="w-full bg-lime py-3.5 overflow-hidden my-6">
      <div className="flex scrolling-ticker">
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex items-center gap-3 px-5 whitespace-nowrap">
            <span className="text-base">🍵</span>
            <span className="text-sm font-semibold text-foreground">{logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;
