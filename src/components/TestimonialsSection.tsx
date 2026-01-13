const testimonials = [
  {
    name: "Mike T.",
    handle: "@miket_nyc",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    content: "I found my Ex's post about me from 6 months ago which might be why I have been why im getting less matches. Touche! 💪",
    time: "3:42 PM · Dec 10, 2025",
    views: "4,291",
  },
  {
    name: "James R.",
    handle: "@jamesryan22",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "This tool was super clutch ngl. I found posts about me from 2 years ago with my name and city. Love yall.",
    time: "11:15 AM · Dec 9, 2025",
    views: "2,847",
  },
  {
    name: "David K.",
    handle: "@davidk_la",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    content: "Good to know I haven't been posted about on Tea lol. It came up clean for me.",
    time: "7:33 PM · Dec 8, 2025",
    views: "9,156",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          What guys have said
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Join 35,000+ guys who have already found Tea
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border card-hover">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-foreground mb-4">{testimonial.content}</p>
              <div className="text-sm text-muted-foreground">
                {testimonial.time} · <span>{testimonial.views} Views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
