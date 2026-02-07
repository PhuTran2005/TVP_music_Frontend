import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectPlayer } from "@/features/player/slice/playerSlice";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/useSocket";

export const useTrackAnalytics = () => {
  const { socket, isConnected } = useSocket();

  const { currentTrack, isPlaying } = useSelector(selectPlayer);
  const { user } = useSelector((state: RootState) => state.auth);

  // Refs
  const userRef = useRef(user);
  const trackRef = useRef(currentTrack);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    userRef.current = user;
    trackRef.current = currentTrack;
    isPlayingRef.current = isPlaying;
  }, [user, currentTrack, isPlaying]);

  // --- HEARTBEAT ---
  useEffect(() => {
    if (!socket || !isConnected) return;

    const interval = setInterval(() => {
      const u = userRef.current;
      const t = trackRef.current;
      const p = isPlayingRef.current;

      // 🔥 FIX QUAN TRỌNG:
      // Log của bạn cho thấy user có thuộc tính 'id', không phải '_id'.
      // Ta sẽ lấy ưu tiên 'id', nếu không có mới tìm '_id'.
      const realUserId = u?.id || u?._id;

      // Nếu không có user thật thì dùng ID khách
      const finalUserId = realUserId || `guest_${socket.id}`;

      console.log("💓 ...", {
        u: u,
        t: t,
        p: p,
        userId: finalUserId,
        track: t?._id, // Track thì thường vẫn là _id, nếu lỗi thì check lại log track
      });

      socket.emit("client_heartbeat", {
        userId: finalUserId,
        trackId: p && t ? t._id : "",
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [socket, isConnected]);
};
