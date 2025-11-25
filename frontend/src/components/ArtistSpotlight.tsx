import { Users, Music, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const artists = [
  {
    id: 1,
    name: "Aurora Dreams",
    genre: "Electronic/Ambient",
    followers: "2.1M",
    albums: 8,
    image: "https://images.unsplash.com/photo-1629735951612-65b0f1724031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isVerified: true,
    bio: "Creating ethereal soundscapes that transport listeners to otherworldly dimensions."
  },
  {
    id: 2,
    name: "The Retro Collective",
    genre: "Indie Rock",
    followers: "856K",
    albums: 5,
    image: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjB2aW55bHxlbnwxfHx8fDE3NTg3NjgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isVerified: true,
    bio: "Bringing back the golden age of rock with modern production and timeless melodies."
  },
  {
    id: 3,
    name: "Maya Chen",
    genre: "Folk/Acoustic",
    followers: "342K",
    albums: 3,
    image: "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwbXVzaWMlMjBzdHVkaW98ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isVerified: false,
    bio: "Intimate storytelling through acoustic melodies and heartfelt lyrics."
  }
];

export function ArtistSpotlight() {
  return (
    <section className="py-16 px-4 md:px-6 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Artist Spotlight</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the talented artists who are shaping the sound of tomorrow. 
            Discover their stories, explore their music, and follow their journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <Card key={artist.id} className={`group hover:shadow-lg transition-all duration-300 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
              <CardContent className="p-0">
                <div className={`relative ${index === 0 ? 'h-80' : 'h-48'}`}>
                  <ImageWithFallback 
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-lg" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-bold ${index === 0 ? 'text-2xl' : 'text-xl'}`}>{artist.name}</h3>
                      {artist.isVerified && (
                        <Badge variant="secondary" className="bg-blue-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-3">{artist.genre}</p>
                    {index === 0 && (
                      <p className="text-sm opacity-80 mb-4 max-w-md">{artist.bio}</p>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {index !== 0 && (
                    <p className="text-sm text-muted-foreground mb-4">{artist.bio}</p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {artist.followers}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Music className="h-4 w-4" />
                        {artist.albums} albums
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">Follow</Button>
                    <Button variant="outline" className="flex-1">View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}