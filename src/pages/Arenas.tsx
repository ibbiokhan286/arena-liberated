import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Search, MapPin, Star, Clock, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const arenas = [
  { id: 1, name: "Elite Sports Complex", location: "Downtown", sport: "Basketball", rating: 4.9, price: 45, image: "from-blue-500 to-blue-600", capacity: 10, available: true },
  { id: 2, name: "Champions Arena", location: "Westside", sport: "Soccer", rating: 4.8, price: 60, image: "from-green-500 to-green-600", capacity: 22, available: true },
  { id: 3, name: "Pro Court Center", location: "Eastside", sport: "Tennis", rating: 4.7, price: 35, image: "from-orange-500 to-orange-600", capacity: 4, available: true },
  { id: 4, name: "Ultimate Fitness Arena", location: "North District", sport: "Volleyball", rating: 4.9, price: 40, image: "from-purple-500 to-purple-600", capacity: 12, available: false },
  { id: 5, name: "Premier Sports Hub", location: "South End", sport: "Badminton", rating: 4.6, price: 30, image: "from-red-500 to-red-600", capacity: 4, available: true },
  { id: 6, name: "Victory Field", location: "Downtown", sport: "Cricket", rating: 4.8, price: 70, image: "from-indigo-500 to-indigo-600", capacity: 22, available: true },
];

const Arenas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredArenas = arenas.filter(arena => {
    const matchesSearch = arena.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === "all" || arena.sport === selectedSport;
    const matchesLocation = selectedLocation === "all" || arena.location === selectedLocation;
    return matchesSearch && matchesSport && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ArenaLink
            </span>
          </div>
          <Button onClick={() => navigate('/')} variant="ghost">
            Back to Home
          </Button>
        </div>
      </header>

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Arena</h1>
          <p className="text-xl text-muted-foreground">Browse and book from hundreds of premium sports venues</p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-card/30 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search arenas..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Soccer">Soccer</SelectItem>
                <SelectItem value="Tennis">Tennis</SelectItem>
                <SelectItem value="Volleyball">Volleyball</SelectItem>
                <SelectItem value="Badminton">Badminton</SelectItem>
                <SelectItem value="Cricket">Cricket</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="Westside">Westside</SelectItem>
                <SelectItem value="Eastside">Eastside</SelectItem>
                <SelectItem value="North District">North District</SelectItem>
                <SelectItem value="South End">South End</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Arena Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredArenas.length} {filteredArenas.length === 1 ? 'arena' : 'arenas'} found
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArenas.map((arena) => (
            <Card 
              key={arena.id} 
              className="overflow-hidden hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/arenas/${arena.id}`)}
            >
              <div className={`h-56 bg-gradient-to-br ${arena.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 right-4">
                  {arena.available ? (
                    <Badge className="bg-accent text-accent-foreground">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Booked</Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">
                    {arena.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {arena.location}
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      {arena.sport}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{arena.rating}</span>
                      <span className="text-muted-foreground text-sm">(128)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Up to {arena.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>6 AM - 11 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <span className="text-2xl font-bold text-primary">${arena.price}</span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/arenas/${arena.id}`);
                      }}
                      disabled={!arena.available}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {arena.available ? 'Book Now' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArenas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No arenas found matching your criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("all");
                setSelectedLocation("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Arenas;
