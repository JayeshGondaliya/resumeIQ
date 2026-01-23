import axios from "axios";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import Button from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Validate PDF file
  const validateFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  // Drag handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setMessage("");
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Upload file
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setMessage("File uploaded successfully!");
      setUploading(false);

      // Navigate to analysis page after short delay
      setTimeout(() => {
        navigate("/analysis");
      }, 1000);

      console.log("Response:", response.data);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${dragActive
          ? "border-accent bg-accent/5 scale-[1.02]"
          : file
            ? "border-success bg-success/5"
            : "border-border hover:border-accent/50 hover:bg-muted/50"
          }`}
      >
        {!file ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Upload
                className={`w-10 h-10 transition-colors ${dragActive ? "text-accent" : "text-muted-foreground"
                  }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {dragActive ? "Drop your resume here" : "Upload your resume"}
            </h3>
            <p className="text-muted-foreground mb-6">
              Drag and drop your PDF file here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
            <p className="mt-6 text-sm text-muted-foreground">
              PDF only • Max 5MB
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-success" />
              </div>
              <div className="text-left">
                <p className="font-medium truncate max-w-[200px] md:max-w-[300px]">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={removeFile}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="mb-6 space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 100
                    ? "Uploading your resume..."
                    : "Complete!"}
                </p>
              </div>
            )}

            {!uploading && message && (
              <div className="flex items-center justify-center gap-2 text-success mb-6">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {file && !uploading && (
        <Button
          onClick={handleUpload}
          className="w-full mt-6 h-12 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Analyze Resume
        </Button>
      )}
    </div>
  );
};

export default ResumeUpload;
