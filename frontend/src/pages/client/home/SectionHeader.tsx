import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  description?: string;
  viewAllHref?: string;
}

export function SectionHeader({
  icon,
  label,
  title,
  description,
  viewAllHref,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
          {icon}
          {label}
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="text-muted-foreground text-base sm:text-lg">
            {description}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link to={viewAllHref}>
          <Button variant="ghost" className="group px-0 font-semibold">
            View all
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
          </Button>
        </Link>
      )}
    </div>
  );
}
