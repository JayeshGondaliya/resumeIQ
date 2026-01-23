import {
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

/**
 * Improvement List Component
 * Props:
 * suggestions = [
 *  {
 *    id,
 *    title,
 *    description,
 *    impact,
 *    category: "critical" | "important" | "optional"
 *  }
 * ]
 */
const ImprovementList = ({ suggestions }) => {
  const groupedSuggestions = {
    critical: suggestions.filter((s) => s.category === "critical"),
    important: suggestions.filter((s) => s.category === "important"),
    optional: suggestions.filter((s) => s.category === "optional"),
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        🛠 Resume Improvement Suggestions
      </h2>

      <div className="space-y-6">
        {/* Critical */}
        {groupedSuggestions.critical.length > 0 && (
          <Section
            title="Critical Issues"
            color="text-red-600"
            icon={AlertTriangle}
            data={groupedSuggestions.critical}
          />
        )}

        {/* Important */}
        {groupedSuggestions.important.length > 0 && (
          <Section
            title="Important"
            color="text-yellow-600"
            icon={AlertCircle}
            data={groupedSuggestions.important}
          />
        )}

        {/* Optional */}
        {groupedSuggestions.optional.length > 0 && (
          <Section
            title="Nice to Have"
            color="text-green-600"
            icon={Lightbulb}
            data={groupedSuggestions.optional}
          />
        )}
      </div>
    </div>
  );
};

/* ---------------- SECTION ---------------- */

const Section = ({ title, color, icon: Icon, data }) => (
  <div>
    <h3
      className={`text-sm font-semibold mb-3 uppercase tracking-wide flex items-center gap-2 ${color}`}
    >
      <Icon className="w-4 h-4" />
      {title} ({data.length})
    </h3>

    <div className="space-y-3">
      {data.map((item) => (
        <SuggestionCard key={item.id} suggestion={item} />
      ))}
    </div>
  </div>
);

/* ---------------- CARD ---------------- */

const SuggestionCard = ({ suggestion }) => {
  const styles = getStyles(suggestion.category);
  const Icon = styles.icon;

  return (
    <div
      className={`p-4 rounded-xl bg-gray-50 border border-gray-200 border-l-4 ${styles.border} hover:shadow-md transition`}
    >
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
          <Icon className={`w-4 h-4 ${styles.iconColor}`} />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold mb-1">{suggestion.title}</h4>
          <p className="text-sm text-gray-600 mb-2">
            {suggestion.description}
          </p>

          <div className="flex items-center gap-1 text-xs text-blue-600">
            <ArrowRight className="w-3 h-3" />
            <span>{suggestion.impact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const getStyles = (category) => {
  switch (category) {
    case "critical":
      return {
        icon: AlertTriangle,
        border: "border-red-500",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
      };
    case "important":
      return {
        icon: AlertCircle,
        border: "border-yellow-500",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      };
    default:
      return {
        icon: Lightbulb,
        border: "border-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      };
  }
};

export default ImprovementList;
