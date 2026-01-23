import { useEffect, useState } from "react";

/**
 * ATS Score Card Component
 * Props:
 * score = {
 *   overall: number,
 *   skillMatch: number,
 *   experience: number,
 *   education: number,
 *   keywordOptimization: number
 * }
 */
const AtsScoreCard = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  // const animatedScore = useAnimatedScore(score.overall);

  // Animate score
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score.overall / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score.overall) {
        setAnimatedScore(score.overall);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score.overall]);

  // SVG calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  // Color logic
  const getScoreColor = (value) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-blue-500";
    if (value >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const categories = [
    { label: "Skill Match", value: score.skillMatch, icon: "🎯" },
    { label: "Experience", value: score.experience, icon: "💼" },
    { label: "Education", value: score.education, icon: "🎓" },
    { label: "Keywords", value: score.keywordOptimization, icon: "🔑" },
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        📊 ATS Compatibility Score
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular Score */}
        <div className="relative">
          <svg width="200" height="200" className="-rotate-90">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={getScoreColor(animatedScore)}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${getScoreColor(animatedScore)}`}>
              {animatedScore}
            </span>
            <span className="text-sm text-gray-500">out of 100</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="w-full flex-1">
          <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">
            Score Breakdown
          </h3>

          <div className="space-y-4">
            {categories.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span className="flex gap-2">
                    {item.icon} {item.label}
                  </span>
                  <span className={getScoreColor(item.value)}>
                    {item.value}%
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${getBarColor(
                      item.value
                    )}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div
        className={`mt-6 p-4 rounded-xl ${score.overall >= 60
          ? "bg-green-50 border border-green-200"
          : "bg-yellow-50 border border-yellow-200"
          }`}
      >
        <p
          className={`text-sm font-medium ${score.overall >= 60 ? "text-green-600" : "text-yellow-600"
            }`}
        >
          {score.overall >= 80
            ? "🎉 Excellent! Your resume is highly optimized for ATS."
            : score.overall >= 60
              ? "👍 Good job! Your resume has a fair chance of passing ATS filters."
              : "⚠️ Needs improvement. Follow the suggestions to boost your score."}
        </p>
      </div>
    </div>
  );
};

export default AtsScoreCard;
