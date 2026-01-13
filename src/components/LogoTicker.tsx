// Brand-specific fonts via Google Fonts
const fontStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Didact+Gothic&family=Oswald:wght@600&family=Montserrat:wght@800&family=Bebas+Neue&family=Roboto+Condensed:wght@700&display=swap');
`;

const logos = [
  { name: "The Verge", fontClass: "font-['Playfair_Display'] font-bold italic" },
  { name: "Vogue", fontClass: "font-['Didact_Gothic'] tracking-[0.3em] uppercase" },
  { name: "TechCrunch", fontClass: "font-['Roboto_Condensed'] font-bold" },
  { name: "GQ", fontClass: "font-['Didact_Gothic'] tracking-[0.2em] uppercase" },
  { name: "WIRED", fontClass: "font-['Oswald'] font-semibold uppercase" },
  { name: "Complex", fontClass: "font-['Montserrat'] font-extrabold uppercase" },
  { name: "Vanity Fair", fontClass: "font-['Playfair_Display'] font-bold italic" },
  { name: "CNET", fontClass: "font-['Bebas_Neue'] uppercase tracking-wide" },
];

const LogoTicker = () => {
  return (
    <>
      <style>{fontStyles}</style>
      <div className="w-full bg-gray-900 py-3.5 overflow-hidden my-6">
        <div className="flex scrolling-ticker">
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center gap-3 px-5 whitespace-nowrap">
              <span className="text-base">🍵</span>
              <span className={`text-sm text-white ${logo.fontClass}`}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LogoTicker;
