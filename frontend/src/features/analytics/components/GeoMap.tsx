import React, { useMemo, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// 👇 Import file mapping (VN -> VNM)
import { ISO_MAPPING } from "@/utils/isoMapping";
import { GeoLocation } from "@/features/analytics/types";

const GEO_URL = "/world-countries.json"; // Path tương đối từ public folder là đủ

interface GeoMapProps {
  data: GeoLocation[];
}

const GeoMap = ({ data }: GeoMapProps) => {
  // 1. Chuyển đổi Data
  const dataMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!data) return map;

    data.forEach((item) => {
      const iso3 = ISO_MAPPING[item.id] || item.id;
      map[iso3] = (map[iso3] || 0) + item.value;
    });
    return map;
  }, [data]);

  // 2. Tạo thang màu (Xanh đậm hơn để tăng tương phản)
  const colorScale = useMemo(() => {
    const maxVal = Math.max(...(data?.map((d) => d.value) || [0]), 0);
    return scaleLinear<string>()
      .domain([0, maxVal || 1])
      .range(["#D1D5DB", "#2563EB"]); // Gray-300 -> Blue-600
  }, [data]);

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 160 }}
        className="w-full h-full bg-muted/20" // Nền biển nhạt
      >
        <ZoomableGroup>
          <Sphere
            id="sphere"
            stroke="transparent"
            strokeWidth={0.5}
            fill="transparent"
          />
          <Graticule stroke="rgba(0,0,0,0.05)" strokeWidth={0.5} />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.id;
                const value = dataMap[countryCode] || 0;
                const countryName = geo.properties.name || "Unknown";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // Tooltip
                    data-tooltip-id="geo-tooltip"
                    data-tooltip-content={`${countryName}: ${value} users`}
                    data-tooltip-float={true}
                    // Style
                    fill={value > 0 ? colorScale(value) : "#E5E7EB"} // Gray-200 cho nước ko có data
                    stroke="#F3F4F6"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.3s ease" },
                      hover: {
                        fill: "#F59E0B", // Amber-500 nổi bật khi hover
                        outline: "none",
                        stroke: "#FFF",
                        strokeWidth: 1,
                        cursor: "pointer",
                      },
                      pressed: { outline: "none", fill: "#D97706" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <Tooltip
        id="geo-tooltip"
        style={{
          backgroundColor: "#1F2937",
          color: "#fff",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "12px",
          fontWeight: 600,
          zIndex: 50,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Legend - Chú thích rõ ràng hơn */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur p-3 rounded-xl border border-border shadow-md flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
          User Density
        </span>
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="flex flex-col items-center gap-1">
            <span className="w-3 h-3 bg-[#E5E7EB] rounded-sm border border-border"></span>
            <span className="text-[9px] text-muted-foreground">0</span>
          </div>
          <div className="h-px w-8 bg-border"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="w-3 h-3 bg-[#2563EB] rounded-sm shadow-sm"></span>
            <span className="text-[9px] text-muted-foreground">Max</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GeoMap);
