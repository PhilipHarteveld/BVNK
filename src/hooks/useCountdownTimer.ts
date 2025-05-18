import { useEffect, useState } from "react";

type Format = "seconds" | "hh:mm:ss";

export function useCountdownTimer(
  expiryDate: number | undefined,
  format: Format = "seconds"
) {
  const [timeLeft, setTimeLeft] = useState<number | string>(
    format === "seconds" ? 0 : "00:00:00"
  );

  useEffect(() => {
    if (!expiryDate) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsLeft = Math.floor((expiryDate - now) / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft(format === "seconds" ? 0 : "00:00:00");
        clearInterval(interval);
        return;
      }

      if (format === "seconds") {
        setTimeLeft(secondsLeft);
      } else {
        const hrs = Math.floor(secondsLeft / 3600).toString().padStart(2, "0");
        const mins = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, "0");
        const secs = (secondsLeft % 60).toString().padStart(2, "0");
        setTimeLeft(`${hrs}:${mins}:${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate, format]);

  return timeLeft;
}
