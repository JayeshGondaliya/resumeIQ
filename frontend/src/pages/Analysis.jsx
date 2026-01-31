import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("resumeData");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResumeData(parsed);
      } catch (err) {
        console.error("Invalid JSON:", err);
      }
    }

    setTimeout(() => setLoading(false), 500); // small delay
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Analyzing your resume...</h2>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>No analysis data found</h2>
        <button onClick={() => navigate("/upload")}>Go Back</button>
      </div>
    );
  }

  const atsScore = resumeData.ats_score || {};
  const improvements = resumeData.improvements || {};
  const roadmap = resumeData.roadmap || {};
  const finalScore = atsScore.final_score || 0;
  const atsPassed = resumeData.ats_passed || false;

  // ================= RENDER =================
  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1>Analysis Results</h1>

      {/* ================= ATS SCORE ================= */}
      <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>ATS Score</h2>
        <p>
          <strong>Final Score:</strong> {finalScore}
        </p>
        <p>
          <strong>Status:</strong> {atsPassed ? "✅ Passed ATS" : "❌ Not Passed"}
        </p>

        {atsScore.breakdown && (
          <>
            <h4>Score Breakdown:</h4>
            <ul>
              {Object.entries(atsScore.breakdown).map(([key, value], index) => {
                // If the value is an object (like required_skills), display each property
                if (typeof value === "object") {
                  return (
                    <li key={index}>
                      <strong>{key}:</strong>
                      <ul>
                        {Object.entries(value).map(([subKey, subValue], subIndex) => {
                          // If array, join it
                          if (Array.isArray(subValue)) {
                            return (
                              <li key={subIndex}>
                                {subKey}: {subValue.join(", ")}
                              </li>
                            );
                          }
                          // If object with matched/missing
                          if (typeof subValue === "object") {
                            return (
                              <li key={subIndex}>
                                {subKey}: {JSON.stringify(subValue)}
                              </li>
                            );
                          }
                          return (
                            <li key={subIndex}>
                              {subKey}: {subValue}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={index}>
                    {key}: {value}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* ================= IMPROVEMENTS ================= */}
      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>📌 Improvements</h2>

        {improvements && Object.keys(improvements).length === 0 ? (
          <p>No improvements available</p>
        ) : (
          Object.entries(improvements).map(([type, items], idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              <h3>{type.replace(/_/g, " ")}</h3>
              {Array.isArray(items) ? (
                <ul>
                  {items.map((item, i) => (
                    <li key={i}>
                      {typeof item === "object"
                        ? Object.entries(item)
                          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                          .join(" | ")
                        : item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{JSON.stringify(items)}</p> // fallback if items is not an array
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= ROADMAP ================= */}
      <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ddd" }}>
        <h2>🗺 Roadmap</h2>
        {finalScore >= 60 ? (
          <>
            <p>
              <strong>Total Duration:</strong> {roadmap.total_duration}
            </p>
            <p>
              <strong>Overview:</strong> {roadmap.roadmap_overview}
            </p>
            {Array.isArray(roadmap.weekly_plan) &&
              roadmap.weekly_plan.map((week, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    marginTop: "15px",
                  }}
                >
                  <h4>Week {week.week}</h4>
                  <p>
                    <strong>Focus:</strong> {week.focus}
                  </p>
                  <p>
                    <strong>Learning:</strong> {week.learning}
                  </p>
                  <p>
                    <strong>Practice:</strong> {week.practice}
                  </p>
                  <p>
                    <strong>Deliverables:</strong> {week.deliverables}
                  </p>
                </div>
              ))}
          </>
        ) : (
          <p>Roadmap unlocks when score is 60 or above.</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;
