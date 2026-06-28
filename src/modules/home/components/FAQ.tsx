"use client";

import * as React from "react";
import { HelpCircle, ChevronDown, ChevronUp, Zap, Terminal } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is OpenDev Hub free? Are there any hidden pricing tiers?",
      answer:
        "OpenDev Hub is 100% free and open-source. There are no pricing matrices, premium subscription tiers, or locked tools. We sustain the platform's nominal hosting through small, developer-oriented residency sponsorship slots displayed in the footer.",
    },
    {
      question: "Where does my data go when I use the developer toolbox?",
      answer:
        "Nowhere. Your payloads, configuration inputs, secret values, and JWT signatures never leave your terminal. Every utility inside the toolbox is executed strictly inside your browser thread using raw client-side JavaScript. We set no tracking cookies and run zero data telemetry pipelines.",
    },
    {
      question:
        "How does the Repository Explorer query GitHub without a database?",
      answer:
        "We connect your client browser directly to GitHub's REST API. Queries, search filters, and repository retrievals are executed live. By avoiding middleman API servers, we ensure zero server latency and leverage your browser's caching layers directly.",
    },
    {
      question: "How can I contribute a new tool or submit learning resources?",
      answer:
        "OpenDev Hub is an open project itself. Anyone can clone the repository, suggest modifications to our static JSON datasets under the data folder, or add specialized formatting tools. Simply create a pull request on our GitHub repository to introduce new resources.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="w-full min-h-[100vh] border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-black flex flex-col justify-center relative overflow-hidden">
        
        <div className="absolute top-1/4 left-[3%] hidden xl:block select-none pointer-events-none">
          <div className="w-64 border-4 border-foreground bg-white p-3 rotate-[-6deg] shadow-[6px_6px_0px_0px_var(--primary)] flex flex-col items-center">
            <div className="w-full aspect-square border-2 border-foreground bg-accent overflow-hidden relative flex items-center justify-center">
              <img 
                src="/faq_dev_computer.png" 
                alt="Caffeine Computer" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-3 text-center font-mono text-[10px] font-black text-black uppercase tracking-tight">
              ⚡ SERVER_ENGINE: COFFEE_POWERED
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-[3%] hidden xl:block select-none pointer-events-none">
          <div className="w-60 border-4 border-foreground bg-white p-3 rotate-[6deg] shadow-[6px_6px_0px_0px_var(--accent)] flex flex-col items-center">
            <div className="w-full aspect-square border-2 border-foreground bg-primary overflow-hidden relative flex items-center justify-center">
              <img 
                src="/faq_joy_coffee.png" 
                alt="Joyful Coffee" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-3 text-center font-mono text-[10px] font-black text-black uppercase tracking-tight">
              🚀 USER_BRAIN: HIGH_ENERGY_OK
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full relative z-10">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>KNOWLEDGE INDEX / FAQ</span>
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-foreground">
              Frequently Asked Queries
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Quick technical context about OpenDevHub&apos;s data layers and local execution models.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[6px_6px_0px_0px_var(--accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full text-left p-4 font-mono text-xs sm:text-sm font-black uppercase tracking-tight text-foreground flex items-center justify-between hover:bg-zinc-900 transition-all select-none cursor-pointer"
                  >
                    <span className="pr-4">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 border-t-2 border-foreground bg-black font-mono text-xs text-muted-foreground leading-relaxed">
                      <div className="text-[9px] text-accent mb-2 uppercase font-black tracking-widest animate-pulse flex items-center gap-1 select-none">
                        <span>⚡</span> RUNNING LOCAL DECODE... OK
                      </div>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
