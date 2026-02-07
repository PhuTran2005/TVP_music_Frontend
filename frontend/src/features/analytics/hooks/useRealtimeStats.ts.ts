// src/features/analytics/hooks/useRealtimeStats.ts
import { useEffect, useState } from "react";
import { RealtimeStats } from "../types";
import { useSocket } from "@/hooks/useSocket";
import analyticsApi from "@/features/analytics/api/analyticApi";

export const useRealtimeStats = () => {
  // 🔥 FIX 1: Lấy thêm biến isConnected
  const { socket, isConnected } = useSocket();

  const [data, setData] = useState<RealtimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Initial Data (API REST)
    const fetchInitialData = async () => {
      try {
        console.log("📡 Fetching initial analytics data via API...");
        const res = await analyticsApi.getRealtimeStats();
        if (isMounted && res.data) {
          console.log("✅ API Data Loaded:", res.data);
          setData(res.data);
        }
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
        if (isMounted) setError("Failed to fetch initial data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []); // Chỉ chạy 1 lần khi mount để lấy data nền

  // 2. Listen to Socket (Tách riêng Effect này ra)
  useEffect(() => {
    // 🔥 FIX 2: Chỉ chạy khi Socket đã SẴN SÀNG
    if (!socket || !isConnected) {
      console.log("⏳ Socket not ready yet...");
      return;
    }

    console.log("🔌 Socket connected! Joining Admin Dashboard...");

    // Báo danh với server
    socket.emit("join_admin_dashboard");

    // Lắng nghe sự kiện
    const handleUpdate = (newData: RealtimeStats) => {
      console.log("🔥 Socket Live Update:", newData); // LOG NÀY QUAN TRỌNG NHẤT
      setData((prev) => ({ ...prev, ...newData })); // Merge data mới vào
    };

    socket.on("admin_analytics_update", handleUpdate);

    // Cleanup
    return () => {
      console.log("🔌 Cleaning up socket listener...");
      socket.off("admin_analytics_update", handleUpdate);
    };
  }, [socket, isConnected]); // 🔥 FIX 3: Re-run khi kết nối thay đổi

  return { data, loading, error };
};
