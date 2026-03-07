import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import IndividualRegister from "./pages/IndividualRegister";
import NotFound from "./pages/NotFound";
import { AppShell } from "./components/layout/AppShell";
import { PortalShell } from "./components/portal/PortalShell";
import MapPage from "./pages/MapPage";
import { EventsPage } from "./pages/EventsPage";
import { IntelligencePage } from "./pages/IntelligencePage";
import { DronesPage } from "./pages/DronesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PortalSubmitPage } from "./pages/portal/PortalSubmitPage";
import { PortalReportsPage } from "./pages/portal/PortalReportsPage";
import { PortalRoutesPage } from "./pages/portal/PortalRoutesPage";
import { PortalAlertsPage } from "./pages/portal/PortalAlertsPage";
import SubmitPage from "./pages/SubmitPage";
import SafeRoutesPage from "./pages/SafeRoutesPage";
import AlertsPage from "./pages/AlertsPage";
import { UserManagementPage, SystemConfigPage, AuditLogPage } from "./pages/AdminPages";
import { AnalyticsPage } from "./pages/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/register/individual" element={<IndividualRegister />} />
          {/* Authenticated shell */}
          <Route path="/app" element={<AppShell />}>
            <Route path="map" element={<MapPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="drones" element={<DronesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Civilian pages */}
            <Route path="submit" element={<SubmitPage />} />
            <Route path="routes" element={<SafeRoutesPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            {/* Admin pages */}
            <Route path="users" element={<UserManagementPage />} />
            <Route path="config" element={<SystemConfigPage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>
          {/* Individual portal */}
          <Route path="/portal" element={<PortalShell />}>
            <Route path="submit" element={<PortalSubmitPage />} />
            <Route path="reports" element={<PortalReportsPage />} />
            <Route path="routes" element={<PortalRoutesPage />} />
            <Route path="alerts" element={<PortalAlertsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
