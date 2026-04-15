import { Button } from "./ui/button";
import { Zap, AlertTriangle, Gamepad2, Tv } from "lucide-react";

interface DebugModePanelProps {
  onSpikeUsage: () => void;
  onTriggerOveruse: () => void;
  onTriggerGamingAlert: () => void;
  onTriggerDeviceOn: () => void;
}

export function DebugModePanel({
  onSpikeUsage,
  onTriggerOveruse,
  onTriggerGamingAlert,
  onTriggerDeviceOn,
}: DebugModePanelProps) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Debug Mode</h1>
        <p className="text-gray-500">Test and simulate device behaviors</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
        <div className="space-y-3">
          <Button
            onClick={onSpikeUsage}
            className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white justify-start"
          >
            <Zap className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Spike Random Device Usage</div>
              <div className="text-xs opacity-90">Increase wattage dramatically</div>
            </div>
          </Button>

          <Button
            onClick={onTriggerOveruse}
            className="w-full h-14 rounded-xl bg-red-500 hover:bg-red-600 text-white justify-start"
          >
            <AlertTriangle className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Trigger Overuse Alert</div>
              <div className="text-xs opacity-90">Device running too long warning</div>
            </div>
          </Button>

          <Button
            onClick={onTriggerGamingAlert}
            className="w-full h-14 rounded-xl bg-purple-500 hover:bg-purple-600 text-white justify-start"
          >
            <Gamepad2 className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Gaming Time Limit Alert</div>
              <div className="text-xs opacity-90">Session exceeded notification</div>
            </div>
          </Button>

          <Button
            onClick={onTriggerDeviceOn}
            className="w-full h-14 rounded-xl bg-blue-500 hover:bg-blue-600 text-white justify-start"
          >
            <Tv className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Device Turned On Notification</div>
              <div className="text-xs opacity-90">Simulate device power on</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}