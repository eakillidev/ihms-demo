import { Plug, PlusCircle, Settings, Zap, AlertTriangle, Gamepad2, Tv, RotateCcw, Power } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "devices", label: "Devices", icon: Plug },
    { id: "add-device", label: "Add Device", icon: PlusCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSpikeUsage = () => {
    window.dispatchEvent(new CustomEvent("spikeUsage"));
  };

  const handleOveruseAlert = () => {
    window.dispatchEvent(new CustomEvent("overuseAlert"));
  };

  const handleGamingAlert = () => {
    window.dispatchEvent(new CustomEvent("gamingAlert"));
  };

  const handleDeviceOn = () => {
    window.dispatchEvent(new CustomEvent("deviceOn"));
  };

  const handleResetSimulation = () => {
    window.dispatchEvent(new CustomEvent("resetSimulation"));
  };

  const handleKillswitch = () => {
    window.dispatchEvent(new CustomEvent("killswitch"));
  };

  return (
    <div className="w-72 h-screen bg-white border-r-2 border-gray-200 flex flex-col shadow-sm">
      <div className="p-8 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
            <Plug className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Intelligent Home<br />Monitoring System</h1>
            <p className="text-xs text-gray-500 mt-1">Energy Monitor</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-5 overflow-y-auto">
        <div className="space-y-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-base font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-6 border-t-2 border-gray-200">
          <div className="mb-4 px-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Debug Controls</h3>
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleSpikeUsage}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-orange-200 text-orange-700 hover:bg-orange-50 font-medium"
            >
              <Zap className="w-4 h-4 mr-2" />
              Spike Usage
            </Button>

            <Button
              onClick={handleOveruseAlert}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-red-200 text-red-700 hover:bg-red-50 font-medium"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Overuse Alert
            </Button>

            <Button
              onClick={handleGamingAlert}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-purple-200 text-purple-700 hover:bg-purple-50 font-medium"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Gaming Alert
            </Button>

            <Button
              onClick={handleDeviceOn}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
            >
              <Tv className="w-4 h-4 mr-2" />
              Device On
            </Button>

            <Button
              onClick={handleResetSimulation}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Simulation
            </Button>

            <div className="h-px bg-gray-200 my-3" />

            <Button
              onClick={handleKillswitch}
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm h-10 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 font-semibold"
            >
              <Power className="w-4 h-4 mr-2" />
              Killswitch
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}