import { useState } from "react";

export function useScrub() {
  const [isScrubbing, setIsScrubbing] = useState(false);

  return {
    isScrubbing,
    onScrubStart: () => setIsScrubbing(true),
    onScrubEnd: () => setIsScrubbing(false),
  };
}
