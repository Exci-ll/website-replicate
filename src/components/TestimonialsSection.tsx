import testimonialHector from "@/assets/testimonial-hector.jpg";
import testimonialChris from "@/assets/testimonial-chris.png";
import testimonialDale from "@/assets/testimonial-dale.jpeg";

const testimonials = [
  {
    name: "Chris T.",
    handle: "@christ_bnb",
    image: testimonialChris,
    content: "I found my Ex's post about me from 6 months ago which might be why I have been why im getting less matches. Touche! 💪",
    time: "5:37 PM · Dec 17, 2025",
    views: "3,348",
  },
  {
    name: "Hector K.",
    handle: "@kmood0_",
    image: testimonialHector,
    content: "This tool was super clutch ngl. I found posts about me from 2 years ago with my name and city. Love yall.",
    time: "10:28 AM · Dec 15, 2025",
    views: "2,643",
  },
  {
    name: "Dale R.",
    handle: "@dale_nnyc",
    image: testimonialDale,
    content: "Good to know I haven't been posted about on Tea lol. It came up clean for me.",
    time: "8:27 PM · Dec 14, 2025",
    views: "7,258",
  },
];

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="w-4 h-4 fill-[#1d9bf0] ml-1" aria-hidden="true">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

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
            <div key={index} className="bg-[#16181c] rounded-2xl p-5 shadow-lg card-hover relative">
              {/* X Logo in top right */}
              <div className="absolute top-5 right-5">
                <XLogo />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center">
                    <span className="font-bold text-white">{testimonial.name}</span>
                    <VerifiedBadge />
                  </div>
                  <div className="text-gray-500 text-sm">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-white mb-4">{testimonial.content}</p>
              <div className="text-sm text-gray-500">
                {testimonial.time} · <span className="text-white font-medium">{testimonial.views}</span> Views
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
