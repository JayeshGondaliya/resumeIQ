import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF allowed");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Max file size 5MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_title", "Flutter Developer");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const resumeData = response.data;

      // 🔥 Save to localStorage (IMPORTANT)
      localStorage.setItem("resumeData", JSON.stringify(resumeData));

      navigate("/analysis");

    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", textAlign: "center" }}>
      <h1>Upload Resume</h1>

      <input type="file" accept="application/pdf" onChange={handleChange} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Analyze Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
