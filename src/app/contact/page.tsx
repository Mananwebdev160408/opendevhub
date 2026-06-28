import { Metadata } from "next"
import ContactFormClient from "./ContactFormClient"
import { Mail, MessageSquare } from "lucide-react"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const metadata: Metadata = {
  title: "Contact Operator - OpenDev Hub",
  description: "Get in touch with the OpenDev Hub maintainer or report bug incidents via the retro-terminal submission form.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          COMMUNICATION PANEL
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span>CONTACT THE OPERATOR</span>
        </h1>
        <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
          COMMS PORT // OPEN CONNECTION
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ContactFormClient />
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-4">
            <span className="text-[10px] text-accent font-black uppercase block border-b border-border pb-1.5">
              DIRECT CHANNELS
            </span>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">OPERATOR EMAIL:</span>
                <a href="mailto:support@opendevhub.com" className="text-foreground hover:text-primary hover:underline flex items-center gap-1.5 font-bold">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span>support@opendevhub.com</span>
                </a>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">PROJECT REPOSITORY:</span>
                <a href="https://github.com/Mananwebdev160408/opendevhub" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent hover:underline flex items-center gap-1.5 font-bold">
                  <GithubIcon className="h-4 w-4 shrink-0 text-accent" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-2 border-foreground bg-zinc-950 p-5 space-y-3 text-xs text-muted-foreground leading-relaxed">
            <span className="text-[10px] text-zinc-500 font-black uppercase block border-b border-zinc-900 pb-1.5">
              NOTICE PROTOCOL
            </span>
            <p>
              Please allow up to 48 hours for node operator transmission processing. For critical bug incidents or license corrections, please submit a direct Issue ticket on our GitHub repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
