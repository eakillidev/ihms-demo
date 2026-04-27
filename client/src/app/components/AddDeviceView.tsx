import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Bluetooth,
  Tv,
  Gamepad2,
  Flame,
  WashingMachine,
  Refrigerator,
  Microwave,
  Lightbulb,
  Monitor,
  Plug2,
  Wifi,
  Fan
} from "lucide-react";
import { useState } from "react";
import { createDevice, addDevice, saveDevices, getDevices } from "../mockDatabase";
import type { DeviceType } from "../mockDatabase";
import { showLargeNotification } from "./LargeNotification";
import { createDeviceOnApi } from "../deviceApi";

interface AddDeviceViewProps {
  onDeviceAdded: () => void;
}

export function AddDeviceView({ onDeviceAdded }: AddDeviceViewProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPairing(true);

    setTimeout(async () => {
      const name = deviceName.trim();
      const type = deviceType as DeviceType;
      let newDevice = createDevice(name, type);

      try {
        newDevice = await createDeviceOnApi(newDevice);
        saveDevices([...getDevices().filter((device) => device.id !== newDevice.id), newDevice]);
      } catch (error) {
        console.warn("API unavailable, saving device locally:", error);
        newDevice = addDevice(name, type);
      }

      setIsPairing(false);
      showLargeNotification("success", "Device Added", `${newDevice.name} is ready to monitor`);
      onDeviceAdded();
    }, 2000);
  };

  const deviceTypes = [
    { value: "tv", label: "TV", icon: Tv },
    { value: "gaming", label: "Gaming Console", icon: Gamepad2 },
    { value: "washer", label: "Washer", icon: WashingMachine },
    { value: "dryer", label: "Dryer", icon: WashingMachine },
    { value: "refrigerator", label: "Refrigerator", icon: Refrigerator },
    { value: "microwave", label: "Microwave", icon: Microwave },
    { value: "stove", label: "Oven/Stove", icon: Flame },
    { value: "lamp", label: "Lamp", icon: Lightbulb },
    { value: "computer", label: "Computer", icon: Monitor },
    { value: "charger", label: "Phone Charger", icon: Plug2 },
    { value: "router", label: "Router", icon: Wifi },
    { value: "fan", label: "Fan", icon: Fan },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add New Device</h1>
        <p className="text-gray-500">Connect a smart outlet via Bluetooth</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Bluetooth className={`w-12 h-12 ${isPairing ? "text-blue-600 animate-pulse" : "text-blue-500"}`} />
          </div>
          <p className="text-base text-gray-600">
            {isPairing ? "Pairing device..." : "Make sure your device is in pairing mode"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deviceName" className="text-base font-medium">Device Name</Label>
            <Input
              id="deviceName"
              type="text"
              placeholder="e.g., Living Room TV"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="h-14 rounded-xl text-base"
              required
              disabled={isPairing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceType" className="text-base font-medium">Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType} disabled={isPairing} required>
              <SelectTrigger className="h-14 rounded-xl text-base">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px] bg-white">
                {deviceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-base py-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-base font-medium"
            disabled={isPairing}
          >
            {isPairing ? "Pairing..." : "Pair Device"}
          </Button>
        </form>
      </div>
    </div>
  );
}
