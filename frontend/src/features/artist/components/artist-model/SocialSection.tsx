import React from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  Facebook,
  Globe,
  Instagram,
  Music2,
  Twitter,
  Youtube,
  Link2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";

interface SocialSectionProps {
  form: UseFormReturn<ArtistFormValues>;
}

const SocialSection: React.FC<SocialSectionProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  const socialFields = [
    {
      name: "facebook",
      icon: <Facebook className="size-4 text-[#1877F2]" />,
      placeholder: "facebook.com/...",
    },
    {
      name: "instagram",
      icon: <Instagram className="size-4 text-[#E4405F]" />,
      placeholder: "instagram.com/...",
    },
    {
      name: "twitter",
      icon: <Twitter className="size-4 text-[#1DA1F2]" />,
      placeholder: "twitter.com/...",
    },
    {
      name: "spotify",
      icon: <Music2 className="size-4 text-[#1DB954]" />,
      placeholder: "open.spotify.com/artist/...",
    },
    {
      name: "youtube",
      icon: <Youtube className="size-4 text-[#FF0000]" />,
      placeholder: "youtube.com/c/...",
    },
    {
      name: "website",
      icon: <Globe className="size-4 text-muted-foreground" />,
      placeholder: "https://artist-website.com",
    },
  ];

  return (
    <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-border/50">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Link2 className="size-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">
          Liên kết Mạng xã hội
        </h4>
      </div>

      <div className="grid gap-3">
        {socialFields.map((field) => (
          <div key={field.name} className="space-y-1">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-transform group-focus-within:scale-110">
                {field.icon}
              </div>
              <Input
                {...register(`socialLinks.${field.name}` as any)}
                placeholder={field.placeholder}
                className="pl-10 h-9 text-xs bg-background/50 focus:bg-background transition-all"
              />
            </div>
            {errors.socialLinks?.[
              field.name as keyof typeof errors.socialLinks
            ] && (
              <p className="text-[10px] text-destructive ml-1">
                {
                  errors.socialLinks[
                    field.name as keyof typeof errors.socialLinks
                  ]?.message
                }
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialSection;
