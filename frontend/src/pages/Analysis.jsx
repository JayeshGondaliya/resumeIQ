import React from "react";
import { Download, Share2 } from "lucide-react";

import AtsScoreCard from "../components/analysis/AtsScoreCard";
import RoleSuggestionCard from "../components/analysis/RoleSuggestionCard";
import ImprovementList from "../components/analysis/ImprovementList";
import RoadmapView from "../components/roadmap/Roadmapview";
import Loader from "../components/common/Loader";

import {
  mockATSScore,
  mockRoleRecommendations,
  mockSuggestions,
  mockRoadmap,
} from "../services/mockData";

import Button from "../components/ui/button";
import { useMockLoading } from "../hooks/useMockLoading";

const Analysis = () => {
  const loading = useMockLoading(1500);

  const isRoadmapUnlocked = mockATSScore.overall >= 60;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader size="lg" text="Analyzing your resume..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Analysis Results
            </h1>
            <p className="text-muted-foreground">
              Here's how your resume performs with ATS systems
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <AtsScoreCard score={mockATSScore} />

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">
              🎯 Role Recommendations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRoleRecommendations.map((role) => (
                <RoleSuggestionCard key={role.id} role={role} />
              ))}
            </div>
          </div>

          <ImprovementList suggestions={mockSuggestions} />

          <RoadmapView
            roadmap={mockRoadmap}
            isUnlocked={isRoadmapUnlocked}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
