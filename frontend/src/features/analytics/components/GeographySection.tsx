import React from "react";
import GeoMap from "./GeoMap";
import { Globe, MapPin } from "lucide-react";
import { GeoLocation } from "../types";
import { cn } from "@/lib/utils";

const GeographySection = ({ data }: { data: GeoLocation[] }) => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxVal = sortedData[0]?.value || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full lg:p-4 p-2">
      {/* Map Area */}
      <div className="lg:col-span-2 flex flex-col">
        <GeoMap data={data} />
      </div>

      {/* Top Locations List */}
      <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col h-[450px]">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base">
              Top Locations
            </h3>
            <p className="text-xs text-muted-foreground">Most active regions</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-5">
            {sortedData.map((item, index) => (
              <div key={item.id} className="group">
                <div className="flex justify-between items-end mb-1.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-black text-sm w-5 text-center",
                        index < 3 ? "text-blue-500" : "text-muted-foreground/50"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {item.value.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden ml-8">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(item.value / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {data.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2 opacity-50">
                <Globe size={40} strokeWidth={1} />
                <p className="text-sm font-medium">No traffic data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographySection;
