import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import trackApi from "@/features/track/api/trackApi";
import { ChartTrack } from "@/features/track/types";

export const useRealtimeChart = () => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const [isUpdating, setIsUpdating] = useState(false);
  const prevRankMapRef = useRef<Record<string, number>>({});

  // 1. Initial Fetch
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["live-chart"],
    queryFn: trackApi.getRealtimeChart,
    staleTime: Infinity, // Giữ data không bao giờ cũ để ưu tiên Socket update
  });

  // 🔥 FIX 1: Chuẩn hóa dữ liệu đầu ra (Normalization)
  // Dù API trả về gì, ta cũng convert về 1 format duy nhất để dùng trong Component
  const { tracks, chartData } = useMemo(() => {
    const rawData = apiResponse?.data;

    if (!rawData) return { tracks: [], chartData: [] };

    // Case 1: Backend cũ (Array) -> Chart rỗng
    if (Array.isArray(rawData)) {
      return { tracks: rawData as ChartTrack[], chartData: [] };
    }

    // Case 2: Backend mới (Object) -> Lấy đủ
    return {
      tracks: (rawData as any).items || [],
      chartData: (rawData as any).chart || [],
    };
  }, [apiResponse]);

  // 2. Init PrevRank Map (Giữ nguyên)
  useEffect(() => {
    if (tracks.length > 0 && Object.keys(prevRankMapRef.current).length === 0) {
      const map: Record<string, number> = {};
      tracks.forEach((t, i) => {
        map[t._id] = i + 1;
      });
      prevRankMapRef.current = map;
    }
  }, [tracks]);

  // 3. Socket Realtime
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("join_chart_page");

    const handleUpdate = (payload: any) => {
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 800);

      // 🔥 FIX 2: Logic Merge thông minh (QUAN TRỌNG NHẤT)
      // Không bao giờ được phép làm mất 'chart' nếu payload không có nó
      queryClient.setQueryData(["live-chart"], (old: any) => {
        if (!old) return old;

        // Lấy dữ liệu cũ an toàn
        const oldData = old.data;
        const oldItems = Array.isArray(oldData)
          ? oldData
          : oldData?.items || [];
        const oldChart = Array.isArray(oldData) ? [] : oldData?.chart || [];

        // Payload mới từ Socket
        let newItems = [];
        let newChart = [];

        if (Array.isArray(payload)) {
          // Case A: Socket chỉ bắn về List Tracks (Backend cũ)
          // -> Cập nhật Tracks, GIỮ NGUYÊN Chart cũ
          newItems = payload;
          newChart = oldChart;
        } else {
          // Case B: Socket bắn về Object {items, chart} (Backend mới)
          // -> Nếu chart mới rỗng (backend lỗi?), vẫn dùng chart cũ cho đỡ giật
          newItems = payload.items || oldItems;
          newChart =
            payload.chart && payload.chart.length > 0
              ? payload.chart
              : oldChart;
        }

        // Tính toán Rank cũ (Logic cũ của bạn)
        const newPrevMap: Record<string, number> = {};
        // Lưu rank của list CŨ trước khi update để làm animation
        oldItems.forEach((t: ChartTrack, i: number) => {
          newPrevMap[t._id] = i + 1;
        });
        prevRankMapRef.current = newPrevMap;

        // Return cấu trúc dữ liệu chuẩn Object cho React Query Cache
        return {
          ...old,
          data: {
            items: newItems,
            chart: newChart, // Luôn đảm bảo có chart
          },
        };
      });
    };

    socket.on("chart_update", handleUpdate);

    return () => {
      socket.emit("leave_chart_page");
      socket.off("chart_update", handleUpdate);
    };
  }, [socket, isConnected, queryClient]);

  return {
    tracks,
    chartData,
    prevRankMap: prevRankMapRef.current,
    isLoading,
    isUpdating,
    isConnected,
  };
};
