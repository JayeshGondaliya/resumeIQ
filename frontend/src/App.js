import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Builder from "./pages/Builder";
import NotFound from "./pages/NotFound";

import "./index.css";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global Toasters */}
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            {/* Navbar is always visible */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/builder" element={<Builder />} />
                {/* Catch-all route for unknown pages */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer is always visible */}
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
