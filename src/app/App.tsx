import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { SignupPage } from "./pages/signup";
import { OnboardingPage } from "./pages/onboarding";
import { DashboardLayout } from "./pages/dashboard/layout";
import { AnalyticsView } from "./pages/dashboard/analytics";
import { ContentCalendarView } from "./pages/dashboard/content-calendar";
import { GeneratedContentView } from "./pages/dashboard/generated-content";
import { MessagesView } from "./pages/dashboard/messages";
import { ProfileView } from "./pages/dashboard/profile";
import { SettingsView } from "./pages/dashboard/settings";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AnalyticsView />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="calendar" element={<ContentCalendarView />} />
          <Route path="content" element={<GeneratedContentView />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}