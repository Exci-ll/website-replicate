const tools = [
  "name search",
  "location matching",
  "photo matching",
  "tea post lookup",
  "full posts report",
];

const SearchToolsSection = () => {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
          <span className="text-muted-foreground">how</span>
          <span className="text-foreground"> we </span>
          <span className="text-muted-foreground">search</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool, index) => (
            <span 
              key={index} 
              className="px-6 py-3 bg-[#c8e972] rounded-full text-gray-900 font-medium text-lg border border-gray-900"
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
