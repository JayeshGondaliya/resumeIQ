import { Briefcase, TrendingUp } from "lucide-react";

/**
 * Role Suggestion Card
 * Props:
 * role = {
 *  title,
 *  description,
 *  matchPercentage,
 *  confidence: "High" | "Medium" | "Low",
 *  keySkills: []
 * }
 */
const RoleSuggestionCard = ({ role }) => {
  const getConfidenceStyle = (confidence) => {
    switch (confidence) {
      case "High":
        return "bg-green-100 text-green-700 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-red-100 text-red-700 border-red-300";
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-gray-500";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg">{role.title}</h3>
        </div>

        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getConfidenceStyle(
            role.confidence
          )}`}
        >
          {role.confidence}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{role.description}</p>

      {/* Match Percentage */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className={`w-4 h-4 ${getMatchColor(role.matchPercentage)}`} />
        <span
          className={`text-2xl font-bold ${getMatchColor(
            role.matchPercentage
          )}`}
        >
          {role.matchPercentage}%
        </span>
        <span className="text-sm text-gray-500">match</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(
            role.matchPercentage
          )}`}
          style={{ width: `${role.matchPercentage}%` }}
        />
      </div>

      {/* Key Skills */}
      <div className="flex flex-wrap gap-2">
        {role.keySkills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoleSuggestionCard;
