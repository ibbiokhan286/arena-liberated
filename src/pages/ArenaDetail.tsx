import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, MapPin, Star, Clock, Users, Shield, 
  Wifi, Car, Coffee, CheckCircle2, ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";

const arenaData: Record<string, any> = {
  "1": { name: "Elite Sports Complex", location: "Downtown", sport: "Basketball", rating: 4.9, price: 45, image: "from-blue-500 to-blue-600", capacity: 10 },
  "2": { name: "Champions Arena", location: "Westside", sport: "Soccer", rating: 4.8, price: 60, image: "from-green-500 to-green-600", capacity: 22 },
  "3": { name: "Pro Court Center", location: "Eastside", sport: "Tennis", rating: 4.7, price: 35, image: "from-orange-500 to-orange-600", capacity: 4 },
  "4": { name: "Ultimate Fitness Arena", location: "North District", sport: "Volleyball", rating: 4.9, price: 40, image: "from-purple-500 to-purple-600", capacity: 12 },
  "5": { name: "Premier Sports Hub", location: "South End", sport: "Badminton", rating: 4.6, price: 30, image: "from-red-500 to-red-600", capacity: 4 },
  "6": { name: "Victory Field", location: "Downtown", sport: "Cricket", rating: 4.8, price: 70, image: "from-indigo-500 to-indigo-600", capacity: 22 },
};

const ArenaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const arena = arenaData[id || "1"];
  
  if (!arena) {
    return <div>Arena not found</div>;
  }

  const timeSlots = [
    "06:00 AM", "08:00 AM", "10:00 AM", "12:00 PM", 
    "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }
    toast.success(`Booking confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}!`);
  };

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
          <Button onClick={() => navigate('/arenas')} variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Arenas
          </Button>
        </div>
      </header>

      {/* Hero Image */}
      <section className={`h-96 bg-gradient-to-br ${arena.image} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-accent text-accent-foreground">{arena.sport}</Badge>
            <h1 className="text-5xl font-bold text-white mb-3">{arena.name}</h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{arena.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{arena.rating}</span>
                <span className="text-white/70">(256 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Venue</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {arena.name} is a premier sports facility offering world-class equipment and 
                      amenities. Perfect for both casual games and competitive matches, our venue 
                      provides everything you need for an exceptional {arena.sport.toLowerCase()} experience.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">Capacity</div>
                          <div className="text-sm text-muted-foreground">Up to {arena.capacity} players</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">Operating Hours</div>
                          <div className="text-sm text-muted-foreground">6:00 AM - 11:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Facilities & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Wifi, label: "Free WiFi" },
                        { icon: Car, label: "Free Parking" },
                        { icon: Coffee, label: "Cafe & Lounge" },
                        { icon: Shield, label: "Security" },
                        { icon: CheckCircle2, label: "Equipment Rental" },
                        { icon: Users, label: "Changing Rooms" },
                      ].map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border">
                          <amenity.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((idx) => (
                      <div key={idx} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="font-semibold">John Doe</span>
                          <span className="text-sm text-muted-foreground">• 2 days ago</span>
                        </div>
                        <p className="text-muted-foreground">
                          Excellent facility with top-notch equipment and friendly staff. 
                          The booking process was smooth and the venue exceeded expectations!
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-[var(--shadow-card)]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Book Your Slot</CardTitle>
                  <div>
                    <span className="text-3xl font-bold text-primary">${arena.price}</span>
                    <span className="text-muted-foreground">/hr</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-lg shadow-[var(--shadow-glow)]"
                  onClick={handleBooking}
                >
                  Confirm Booking
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Free cancellation up to 24 hours before your booking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArenaDetail;
