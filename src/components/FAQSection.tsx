import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's the Tea app?",
    answer: "Tea is a popular dating review app where women can post reviews and red flags about people they have dated. It has over 12 million women posting experiences.",
  },
  {
    question: "How does Tea Finder work?",
    answer: "We search the Tea app database using your name, general location, and other info to check if anyone has made a post about you. Our AI based search tool shows all potential matches.",
  },
  {
    question: "Is my search anonymous?",
    answer: "Yes, 100% confidential. We will never store any personal information, and no one will know you searched.",
  },
  {
    question: "What information is needed to search?",
    answer: "First name (or nickname), location details (approximate), and age are enough, with optional AI photo matching for more options.",
  },
  {
    question: "Are the results accurate?",
    answer: "Our AI based search tool achieves 96% accuracy. Our algorithms match names, locations, and display all potential posts about you.",
  },
  {
    question: "Can I find posts made about me?",
    answer: "If we find posts about you, you will be able to view the full post, including the post details (date/time/comments) and content.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Frequently Asked
        </h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 border border-gray-900"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
