import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Trophy, Dumbbell, ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ArenaLink
            </span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/arenas')} variant="ghost">
              Browse Arenas
            </Button>
            <Button onClick={() => navigate('/arenas')} className="shadow-lg">
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container relative mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">🏆 Join 10,000+ active players</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Book Sports Arenas &{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Find Your Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Connect with players, book premium venues, and organize matches all in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                onClick={() => navigate('/arenas')} 
                size="lg" 
                className="text-lg h-14 px-8 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow)]"
              >
                Explore Arenas
              </Button>
              <Button 
                onClick={() => navigate('/arenas')} 
                size="lg" 
                variant="outline"
                className="text-lg h-14 px-8"
              >
                List Your Venue
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Arenas", value: "500+" },
              { label: "Bookings/Month", value: "15K+" },
              { label: "Players", value: "10K+" },
              { label: "Cities", value: "25+" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">One platform, endless possibilities</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-glow)] group">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Instant Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse real-time availability and book your favorite sports arenas in seconds with our intuitive calendar.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary transition-all duration-300 hover:shadow-[var(--shadow-glow)] group">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Player Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create or join game threads to find players at your skill level and organize the perfect match.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent transition-all duration-300 hover:shadow-[var(--shadow-glow)] group">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Venue Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Powerful tools for arena owners to manage bookings, pricing, and availability effortlessly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Arenas Preview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Venues</h2>
            <p className="text-xl text-muted-foreground">Top-rated arenas near you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Elite Sports Complex", location: "Downtown", rating: 4.9, sport: "Basketball", price: "$45/hr" },
              { name: "Champions Arena", location: "Westside", rating: 4.8, sport: "Soccer", price: "$60/hr" },
              { name: "Pro Court Center", location: "Eastside", rating: 4.7, sport: "Tennis", price: "$35/hr" }
            ].map((arena, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xl font-bold">{arena.name}</div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <MapPin className="h-4 w-4" />
                      {arena.location}
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">{arena.sport}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{arena.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">{arena.price}</span>
                    <Button size="sm" variant="outline" onClick={() => navigate('/arenas')}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={() => navigate('/arenas')} variant="outline">
              View All Arenas
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { step: "1", title: "Browse Venues", desc: "Search for arenas by location, sport, and availability" },
            { step: "2", title: "Book Instantly", desc: "Select your time slot and confirm your booking in seconds" },
            { step: "3", title: "Play & Connect", desc: "Show up and play, or find teammates through our community" }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary" />
          <CardContent className="relative py-16 md:py-20 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Get Started?</h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Join thousands of players and venue managers already using ArenaLink.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/arenas')}
                size="lg"
                variant="secondary"
                className="text-lg h-14 px-8 shadow-xl"
              >
                Start Booking Now
              </Button>
              <Button
                onClick={() => navigate('/arenas')}
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                List Your Arena
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 ArenaLink. Built for the sports community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
