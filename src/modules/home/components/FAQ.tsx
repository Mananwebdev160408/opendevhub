"use client";

import * as React from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

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

  return (
    <section className="w-full min-h-[100vh] border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-black flex flex-col justify-center">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>KNOWLEDGE INDEX / FAQ</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-foreground">
            Frequently Asked Queries
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Quick technical context about OpenDevHub&apos;s data layers and
            local execution models.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--border)] transition-all overflow-hidden"
              >
                {/* Trigger Button */}
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

                {/* Content Panel */}
                {isOpen && (
                  <div className="p-4 border-t-2 border-foreground bg-black font-mono text-xs text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
