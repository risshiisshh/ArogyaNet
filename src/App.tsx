import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import DashboardPage from "@/pages/Dashboard";
import PHCNetworkPage from "@/pages/PHCNetwork";
import PHCDetailPage from "@/pages/PHCDetail";
import AlertsPage from "@/pages/Alerts";
import RedistributionPage from "@/pages/Redistributions";
import SimulatorPage from "@/pages/Simulator";
import BRICSPage from "@/pages/BRICS";
import AssistantPage from "@/pages/Assistant";
import NotFoundPage from "@/pages/NotFound";
import { DatasetModal } from "@/components/DatasetModal/DatasetModal";
import { ExecutiveBriefModal } from "@/components/ExecutiveBriefModal/ExecutiveBriefModal";
import { JudgeDemoTour } from "@/components/JudgeDemoTour/JudgeDemoTour";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/phc" element={<PHCNetworkPage />} />
          <Route path="/phc/:id" element={<PHCDetailPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/redistributions" element={<RedistributionPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/brics" element={<BRICSPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <DatasetModal />
      <ExecutiveBriefModal />
      <JudgeDemoTour />
    </>
  );
}
