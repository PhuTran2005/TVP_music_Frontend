import React from "react";

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:hidden -mx-4 px-4">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
        {children}
      </div>
    </div>
  );
}
