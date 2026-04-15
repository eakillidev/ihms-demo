import { DeviceCard } from "./DeviceCard";
import { DeviceModal } from "./DeviceModal";
import { AppleTimerPicker } from "./AppleTimerPicker";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { showLargeNotification } from "./LargeNotification";
import { useState, useEffect } from "react";
import { Zap, Plus } from "lucide-react";

type DeviceType = "tv" | "gaming" | "stove" | "washer" | "dryer" | "refrigerator" | "microwave" | "lamp" | "computer" | "charger" | "router" | "fan";

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: "on" | "off";
  power: number;
  hasWifi: boolean;
  hasAlert?: boolean;
  isHighUsage?: boolean;
  gamingTimer?: number;
  customTimer?: number;
  runtime?: number;
}

const initialDevices: Device[] = [
  {
    id: "1",
    name: "Living Room TV",
    type: "tv",
    status: "on",
    power: 120,
    hasWifi: true,
    isHighUsage: false,
    runtime: 3240,
  },
  {
    id: "2",
    name: "Gaming Console",
    type: "gaming",
    status: "on",
    power: 165,
    hasWifi: true,
    isHighUsage: false,
    gamingTimer: 900,
    runtime: 7845,
  },
  {
    id: "3",
    name: "Kitchen Stove",
    type: "stove",
    status: "off",
    power: 0,
    hasWifi: true,
    isHighUsage: false,
    runtime: 0,
  },
  {
    id: "4",
    name: "Washer",
    type: "washer",
    status: "on",
    power: 450,
    hasWifi: true,
    isHighUsage: false,
    runtime: 1620,
  },
  {
    id: "5",
    name: "Bedroom TV",
    type: "tv",
    status: "off",
    power: 0,
    hasWifi: true,
    isHighUsage: false,
    runtime: 0,
  },
  {
    id: "6",
    name: "Office Monitor",
    type: "tv",
    status: "off",
    power: 0,
    hasWifi: true,
    isHighUsage: false,
    runtime: 0,
  },
];

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps = {}) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false);
  const [deviceForTimer, setDeviceForTimer] = useState<Device | null>(null);

  const handleDeleteDevice = (device: Device) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deviceToDelete) {
      setDevices((prev) => prev.filter((d) => d.id !== deviceToDelete.id));
      showLargeNotification("info", "Device Removed", `${deviceToDelete.name} has been deleted`);
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
    }
  };

  const handleSetTimer = (device: Device) => {
    setDeviceForTimer(device);
    setTimerDialogOpen(true);
  };

  const confirmSetTimer = (totalSeconds: number) => {
    if (deviceForTimer) {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceForTimer.id ? { ...d, customTimer: totalSeconds } : d
        )
      );

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      let timeString = "";
      if (hours > 0) timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
      if (minutes > 0) timeString += `${minutes} min${minutes > 1 ? 's' : ''} `;
      if (seconds > 0) timeString += `${seconds} sec${seconds > 1 ? 's' : ''}`;

      showLargeNotification(
        "info",
        "Timer Set",
        `${deviceForTimer.name} timer set for ${timeString.trim()}`
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          let updatedDevice = { ...device };

          if (device.customTimer !== undefined && device.customTimer > 0 && device.status === "on") {
            const newTimer = device.customTimer - 1;
            if (newTimer === 0) {
              showLargeNotification(
                "timer",
                "⏰ Time's up! Device session has ended",
                `${device.name} timer has completed`
              );
            }
            updatedDevice.customTimer = newTimer;
          }

          if (device.status === "on") {
            updatedDevice.runtime = (device.runtime || 0) + 1;
          }

          return updatedDevice;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleSpikeUsage = () => {
      const activeDevices = devices.filter((d) => d.status === "on" && d.power > 0);
      if (activeDevices.length > 0) {
        const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];
        setDevices((prev) =>
          prev.map((d) =>
            d.id === randomDevice.id
              ? { ...d, power: d.power * 10, isHighUsage: true }
              : d
          )
        );
        showLargeNotification(
          "error",
          "⚡ High Energy Usage Detected!",
          `${randomDevice.name} is consuming excessive power`
        );
      }
    };

    const handleOveruseAlert = () => {
      const activeDevices = devices.filter((d) => d.status === "on");
      if (activeDevices.length > 0) {
        const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];
        setDevices((prev) =>
          prev.map((d) =>
            d.id === randomDevice.id ? { ...d, hasAlert: true } : d
          )
        );
        showLargeNotification(
          "warning",
          "⚠️ Device Running Too Long",
          `${randomDevice.name} has been on for extended time`
        );
      }
    };

    const handleGamingAlert = () => {
      const gamingDevices = devices.filter((d) => d.type === "gaming");
      if (gamingDevices.length > 0) {
        const gamingDevice = gamingDevices[0];
        showLargeNotification(
          "gaming",
          "🎮 Gaming Session Exceeded Recommended Time",
          `${gamingDevice.name} - Time for a break!`
        );
      }
    };

    const handleDeviceOn = () => {
      const offDevices = devices.filter((d) => d.status === "off");
      if (offDevices.length > 0) {
        const randomDevice = offDevices[Math.floor(Math.random() * offDevices.length)];
        const basePower = randomDevice.type === "washer" ? 450 : randomDevice.type === "gaming" ? 165 : 120;
        setDevices((prev) =>
          prev.map((d) =>
            d.id === randomDevice.id
              ? { ...d, status: "on", power: basePower, runtime: 0 }
              : d
          )
        );
        showLargeNotification(
          "success",
          "📺 Device Has Just Turned On",
          `${randomDevice.name} is now active`
        );
      }
    };

    const handleResetSimulation = () => {
      setDevices(initialDevices);
      showLargeNotification("info", "🔄 Simulation Reset", "All devices returned to default state");
    };

    const handleKillswitch = () => {
      setDevices((prev) =>
        prev.map((d) => ({
          ...d,
          status: "off",
          power: 0,
          isHighUsage: false,
          hasAlert: false,
          customTimer: 0,
          runtime: 0,
        }))
      );
      showLargeNotification(
        "error",
        "🚨 Emergency Shutoff Activated",
        "All devices have been powered off"
      );
    };

    window.addEventListener("spikeUsage", handleSpikeUsage);
    window.addEventListener("overuseAlert", handleOveruseAlert);
    window.addEventListener("gamingAlert", handleGamingAlert);
    window.addEventListener("deviceOn", handleDeviceOn);
    window.addEventListener("resetSimulation", handleResetSimulation);
    window.addEventListener("killswitch", handleKillswitch);

    return () => {
      window.removeEventListener("spikeUsage", handleSpikeUsage);
      window.removeEventListener("overuseAlert", handleOveruseAlert);
      window.removeEventListener("gamingAlert", handleGamingAlert);
      window.removeEventListener("deviceOn", handleDeviceOn);
      window.removeEventListener("resetSimulation", handleResetSimulation);
      window.removeEventListener("killswitch", handleKillswitch);
    };
  }, [devices]);


  const totalPower = devices.reduce((sum, device) => sum + device.power, 0);
  const activeDevices = devices.filter((d) => d.status === "on").length;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-emerald-500" />
              <span className="text-base text-gray-600 font-medium">Total Power</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">{Math.round(totalPower)}W</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200">
            <div className="text-base text-gray-600 mb-3 font-medium">Active Devices</div>
            <div className="text-4xl font-bold text-gray-900">{activeDevices}</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200">
            <div className="text-base text-gray-600 mb-3 font-medium">Total Devices</div>
            <div className="text-4xl font-bold text-gray-900">{devices.length}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Devices</h2>
          <button
            onClick={() => onNavigate?.("add-device")}
            className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 transition-colors group"
            title="Add Device"
          >
            <Plus className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => setSelectedDevice(device)}
              onDelete={() => handleDeleteDevice(device)}
              onSetTimer={() => handleSetTimer(device)}
            />
          ))}
        </div>
      </div>

      {selectedDevice && (
        <DeviceModal
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          device={selectedDevice}
        />
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        deviceName={deviceToDelete?.name || ""}
        onConfirm={confirmDelete}
      />

      <AppleTimerPicker
        isOpen={timerDialogOpen}
        onClose={() => setTimerDialogOpen(false)}
        deviceName={deviceForTimer?.name || ""}
        onSetTimer={confirmSetTimer}
      />
    </div>
  );
}