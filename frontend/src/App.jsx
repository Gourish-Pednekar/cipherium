import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";
import DashboardPage from "./pages/DashboardPage";
import "./styles/globals.css";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing");
  const [analysisResults, setAnalysisResults] = useState(null);

  const navigate = (p, data = null) => {
    if (data) setAnalysisResults(data);
    setPage(p);
  };

  return (
    <div className="app">
      {page === "landing" && <LandingPage onStart={() => navigate("analyze")} />}
      {page === "analyze" && (
        <AnalyzePage
          onBack={() => navigate("landing")}
          onResults={(data) => navigate("dashboard", data)}
        />
      )}
      {page === "dashboard" && (
        <DashboardPage
          results={analysisResults}
          onBack={() => navigate("analyze")}
          onNew={() => navigate("landing")}
        />
      )}
    </div>
  );
}
