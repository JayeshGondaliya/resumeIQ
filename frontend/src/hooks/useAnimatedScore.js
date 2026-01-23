import { useState, useEffect } from "react";

export const useAnimatedScore = (score, duration = 1500, steps = 60) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, duration, steps]);

  return animatedScore;
};
