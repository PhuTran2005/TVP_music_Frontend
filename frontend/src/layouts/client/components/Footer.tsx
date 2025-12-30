import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Link } from "react-router-dom";
import Avatar, { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../../../public/LOGO.png";

export function Footer() {
  return (
    // Sử dụng border-border và bg-background/50 (hoặc bg-card) để footer tách biệt nhẹ nhàng
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-sm pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* 1. BRAND COLUMN (Chiếm 4 cột trên Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <Avatar className="size-15 sm:size-10 border border-border/50 shadow-sm cursor-pointer">
                <AvatarImage
                  src={logo}
                  alt={"User Avatar"}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                  TVP
                </AvatarFallback>
              </Avatar>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Discover, stream, and share the music you love. Join millions of
              music enthusiasts on the ultimate music platform built for the
              community.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                >
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* 2. LINKS COLUMNS (Chiếm 2 + 2 cột) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-foreground">Discover</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "New Releases",
                "Top Charts",
                "Genres",
                "Radio",
                "Podcasts",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors block w-fit"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-foreground">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
                "Community Guidelines",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors block w-fit"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. NEWSLETTER COLUMN (Chiếm 4 cột) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Get the latest music news, exclusive releases, and special offers
              delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  // Style input chuẩn index.css: bg-muted/50 border-transparent focus:border-primary
                  className="flex-1 bg-muted/50 border-border focus:bg-background h-10 transition-all rounded-lg"
                />
                <Button
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-lg shadow-md shadow-primary/20"
                >
                  <Mail className="size-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/60">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 MusicHub Inc. All rights reserved.</p>

          <div className="flex items-center gap-6 sm:gap-8">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
