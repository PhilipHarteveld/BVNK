import { useCallback, useMemo, useState } from "react";

type Format = "seconds" | "hh:mm:ss";

export function useCountdownTimer(format: Format = "seconds") {
  const getSecondsLeft = useCallback(
    (expiry: number) => Math.floor((expiry - Date.now()) / 1000),
    []
  );
  const [timeLeft, setTimeLeft] = useState<number>(1);

  const startTimer = useCallback(
    (
      expiryDate: number,
      duration: number,
      cb: () => void
    ): { clear: () => void } => {
      setTimeLeft(getSecondsLeft(expiryDate));

      const interval = setInterval(() => {
        const remaining = getSecondsLeft(expiryDate);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          cb();
          clearInterval(interval);
          return;
        }
      }, duration);

      return {
        clear: () => clearInterval(interval),
      };
    },
    [getSecondsLeft]
  );

  const formattedTime = useMemo(() => {
    const hrs = Math.floor(timeLeft / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((timeLeft % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }, [timeLeft]);

  return {
    timer: startTimer,
    value: format === "seconds" ? timeLeft : formattedTime,
  };
}