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
    <div className="w-full bg-lime py-4 overflow-hidden my-8">
      <div className="flex scrolling-ticker">
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex items-center gap-6 px-6 whitespace-nowrap">
            <span className="text-lg font-semibold text-foreground/80">{logo}</span>
            <span className="text-xl opacity-60">🍵</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;
