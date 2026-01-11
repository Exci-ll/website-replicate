import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the Tea app?",
    answer: "Tea is a popular dating safety app where women can anonymously post reviews and warnings about people they've dated. It has over 11 million users sharing experiences.",
  },
  {
    question: "How does Tea Checker work?",
    answer: "We search the Tea app's database using your name, location, and other details to find if anyone has posted about you. Our AI matches profiles even with nicknames or variations.",
  },
  {
    question: "Is my search confidential?",
    answer: "100% confidential. We don't store your personal information, and your search is completely private. No one will know you checked.",
  },
  {
    question: "What information do I need to search?",
    answer: "Just your first name (or nickname), age, and the city/area where you've dated. Photos are optional but increase accuracy.",
  },
  {
    question: "How accurate are the results?",
    answer: "Our AI-powered matching achieves 94% accuracy. We use advanced algorithms to match names, locations, and physical descriptions.",
  },
  {
    question: "Can I see what was said about me?",
    answer: "Yes! If we find posts about you, you'll see the full content, when it was posted, and what category it falls under (warning, review, etc).",
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
              className="bg-card rounded-2xl px-6 border border-border"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
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
