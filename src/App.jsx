import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import { ThemeProvider } from "@/context/theme-context";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen((open) => !open)}
          // notifications can be passed via context or props if needed
        />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <MainLayout>
                <MessagesPage />
              </MainLayout>
            }
          />
          <Route
            path="/calendar"
            element={
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
