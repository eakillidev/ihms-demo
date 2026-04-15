import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { User, Bell, Shield, LogOut } from "lucide-react";

interface SettingsViewProps {
  onLogout: () => void;
}

export function SettingsView({ onLogout }: SettingsViewProps) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Email</Label>
              <p className="mt-1 text-gray-900">user@example.com</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Name</Label>
              <p className="mt-1 text-gray-900">John Doe</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Energy Alerts</Label>
                <p className="text-sm text-gray-500">Get notified about high energy usage</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Device Offline</Label>
                <p className="text-sm text-gray-500">Alert when devices go offline</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}