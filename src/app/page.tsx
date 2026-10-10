// import { Calendar, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-surface">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex flex-col items-start gap-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display leading-tight">
              Discover what's happening <br className="hidden md:block" />
              <span className="text-accent italic">in your city.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Curated local experiences, workshops, and gatherings. 
              Find your next favorite memory.
            </p>
            <div className="mt-4 flex gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                Explore Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Shell Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display">Upcoming Events</h2>
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-4 hidden md:flex">
              <span>Filter by:</span>
              <button className="border border-border rounded-full px-4 py-1.5 hover:border-primary transition-colors">Category</button>
              <button className="border border-border rounded-full px-4 py-1.5 hover:border-primary transition-colors">City</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dummy Event Card 1 */}
            <div className="group cursor-pointer flex flex-col gap-4">
              <div className="aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium z-10 shadow-sm">
                  Music
                </div>
                {/* Placeholder for Image */}
                <div className="w-full h-full bg-zinc-200 group-hover:scale-105 transition-transform duration-500 ease-out" />
              </div>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-display group-hover:text-accent transition-colors">
                    Symphony under the Stars
                  </h3>
                  <span className="text-lg font-medium whitespace-nowrap">₹1,499</span>
                </div>
                <div className="flex flex-col gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Sat, 18 Oct, 6:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Mumbai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dummy Event Card 2 */}
            <div className="group cursor-pointer flex flex-col gap-4">
              <div className="aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium z-10 shadow-sm">
                  Workshop
                </div>
                {/* Placeholder for Image */}
                <div className="w-full h-full bg-zinc-200 group-hover:scale-105 transition-transform duration-500 ease-out" />
              </div>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-display group-hover:text-accent transition-colors">
                    Pottery Basics
                  </h3>
                  <span className="text-lg font-medium whitespace-nowrap">₹999</span>
                </div>
                <div className="flex flex-col gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Sun, 19 Oct, 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Bangalore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dummy Event Card 3 */}
            <div className="group cursor-pointer flex flex-col gap-4">
              <div className="aspect-[4/3] w-full bg-muted rounded-lg overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium z-10 shadow-sm">
                  Food
                </div>
                {/* Placeholder for Image */}
                <div className="w-full h-full bg-zinc-200 group-hover:scale-105 transition-transform duration-500 ease-out" />
              </div>
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-display group-hover:text-accent transition-colors">
                    Artisan Coffee Tasting
                  </h3>
                  <span className="text-lg font-medium whitespace-nowrap">₹499</span>
                </div>
                <div className="flex flex-col gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Sat, 25 Oct, 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>??</span>
                    <span>Delhi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
