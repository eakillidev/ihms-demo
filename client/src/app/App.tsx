import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { AddDeviceView } from "./components/AddDeviceView";
import { SettingsView } from "./components/SettingsView";
import { LargeNotificationContainer } from "./components/LargeNotification";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [activeView, setActiveView] = useState("devices");

  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <LoginScreen
          onLogin={() => setIsAuthenticated(true)}
          onSwitchToSignup={() => setAuthView("signup")}
        />
      );
    }

    return (
      <SignupScreen
        onSignup={() => setIsAuthenticated(true)}
        onSwitchToLogin={() => setAuthView("login")}
      />
    );
  }

  return (
    <>
      <LargeNotificationContainer />
      <div className="flex h-screen bg-[#f5f5f7]">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto p-10">
            {activeView === "devices" && <DashboardView onNavigate={setActiveView} />}
            {activeView === "add-device" && (
              <AddDeviceView onDeviceAdded={() => setActiveView("devices")} />
            )}
            {activeView === "settings" && (
              <SettingsView onLogout={() => setIsAuthenticated(false)} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}