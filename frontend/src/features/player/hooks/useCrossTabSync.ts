import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlayer, setIsPlaying } from "../slice/playerSlice";

const CHANNEL_NAME = "music_player_sync";

export const useCrossTabSync = () => {
  const dispatch = useDispatch();
  const { isPlaying } = useSelector(selectPlayer);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current.onmessage = (event) => {
      if (event.data.type === "PLAY_TRIGGERED") dispatch(setIsPlaying(false));
    };
    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPlaying && channelRef.current) {
      channelRef.current.postMessage({
        type: "PLAY_TRIGGERED",
        timestamp: Date.now(),
      });
    }
  }, [isPlaying]);
};
