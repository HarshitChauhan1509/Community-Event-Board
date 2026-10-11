import { EventExplorer } from '@/components/events/EventExplorer';
import Link from 'next/link';
import { ArrowDownRight, Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      {/* Editorial Hero Section */}
      <section className="w-full pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border bg-surface">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Compass className="w-3.5 h-3.5 text-accent" />
                Community Events Platform
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-semibold tracking-tight text-foreground leading-[1.08]">
                Where cities gather <br className="hidden sm:inline" />
                and <span className="text-accent italic font-normal">moments begin.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                A thoughtfully curated discovery board for local culture, live music, creative
                workshops, and community happenings across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4 shrink-0">
              <a
                href="#events"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Browse Upcoming
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-border hover:bg-muted text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Personalize Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Event Explorer */}
      <EventExplorer />
    </div>
  );
}
