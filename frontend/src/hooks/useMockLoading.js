import { useState, useEffect } from "react";

export const useMockLoading = (duration = 1500) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
};
