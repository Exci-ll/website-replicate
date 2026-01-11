const tools = [
  "name matching",
  "location search",
  "photo match",
  "tea post search",
  "full report",
];

const SearchToolsSection = () => {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
          <span className="text-muted-foreground">our</span>
          <span className="text-foreground">search</span>
          <span className="text-muted-foreground">tools</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool, index) => (
            <span 
              key={index} 
              className="px-6 py-3 bg-[#c8e972] rounded-full text-gray-900 font-medium text-lg"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchToolsSection;
