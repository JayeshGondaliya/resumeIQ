import React from "react";
import ResumeUpload from "../components/upload/ResumeUpload";
import { FileText, Shield, Zap } from "lucide-react";

const Upload = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get your ATS score in seconds",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is never stored",
    },
    {
      icon: FileText,
      title: "Detailed Insights",
      description: "Actionable improvement tips",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Get instant feedback on how your resume performs with Applicant
            Tracking Systems
          </p>
        </div>

        {/* Upload Component */}
        <div className="mb-16">
          <ResumeUpload />
        </div>

        {/* Benefits Section */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-muted/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-xl font-semibold text-center mb-8">
            How it works
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {["Upload PDF", "AI Analysis", "Get Insights"].map(
              (step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{step}</span>
                  </div>

                  {index < 2 && (
                    <div className="hidden md:block w-16 h-px bg-border" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Upload;
