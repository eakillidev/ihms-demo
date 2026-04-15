import {
    Tv,
    Gamepad2,
    Flame,
    WashingMachine,
    AlertCircle,
    Zap,
    Clock,
    Trash2,
    Timer,
    Refrigerator,
    Microwave,
    Lightbulb,
    Monitor,
    Plug2,
    Wifi,
    Fan
  } from "lucide-react";
  import { useEffect, useState } from "react";
  
  type DeviceType = "tv" | "gaming" | "stove" | "washer" | "dryer" | "refrigerator" | "microwave" | "lamp" | "computer" | "charger" | "router" | "fan";
  
  interface DeviceCardProps {
    device: {
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
    };
    onClick: () => void;
    onDelete: () => void;
    onSetTimer: () => void;
  }
  
  export function DeviceCard({ device, onClick, onDelete, onSetTimer }: DeviceCardProps) {
    const [displayPower, setDisplayPower] = useState(device.power);
    const [timeRemaining, setTimeRemaining] = useState(device.gamingTimer || device.customTimer || 0);
    const [isHovered, setIsHovered] = useState(false);
  
    useEffect(() => {
      if (device.status === "on" && device.power > 0) {
        const interval = setInterval(() => {
          const fluctuation = Math.random() * 10 - 5;
          setDisplayPower(Math.max(0, device.power + fluctuation));
        }, 2000);
        return () => clearInterval(interval);
      } else {
        setDisplayPower(device.power);
      }
    }, [device.power, device.status]);
  
    useEffect(() => {
      setTimeRemaining(device.customTimer || device.gamingTimer || 0);
    }, [device.customTimer, device.gamingTimer]);
  
    useEffect(() => {
      if (device.status === "on" && timeRemaining > 0) {
        const interval = setInterval(() => {
          setTimeRemaining((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [device.status, timeRemaining]);
  
    const formatTime = (seconds: number) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
  
    const getDeviceIcon = () => {
      switch (device.type) {
        case "tv":
          return Tv;
        case "gaming":
          return Gamepad2;
        case "stove":
          return Flame;
        case "washer":
          return WashingMachine;
        case "dryer":
          return WashingMachine;
        case "refrigerator":
          return Refrigerator;
        case "microwave":
          return Microwave;
        case "lamp":
          return Lightbulb;
        case "computer":
          return Monitor;
        case "charger":
          return Plug2;
        case "router":
          return Wifi;
        case "fan":
          return Fan;
      }
    };
  
    const getStatusColor = () => {
      switch (device.status) {
        case "on":
          return "text-emerald-500";
        case "off":
          return "text-gray-400";
      }
    };
  
    const getStatusBgColor = () => {
      switch (device.status) {
        case "on":
          return "bg-emerald-50";
        case "off":
          return "bg-gray-50";
      }
    };
  
    const Icon = getDeviceIcon();
    const isHighUsage = device.isHighUsage || false;
  
    const showTimer = (device.type === "tv" || device.type === "gaming") && timeRemaining > 0;
    const canSetTimer = device.type === "tv" || device.type === "gaming";
  
    return (
      <div
        className="relative h-[420px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onClick}
          className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all border-2 text-left w-full h-full relative flex flex-col ${
            isHighUsage
              ? "border-red-400 bg-red-50 ring-4 ring-red-200/50 shadow-red-200"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {canSetTimer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetTimer();
              }}
              className="absolute top-3 left-3 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors z-10"
              title="Set Timer"
            >
              <Timer className="w-5 h-5 text-indigo-600" />
            </button>
          )}
  
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute top-3 right-3 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group z-10"
            >
              <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
            </button>
          )}
  
          <div className="flex flex-col items-center mb-6">
            <div className={`w-24 h-24 rounded-2xl ${getStatusBgColor()} flex items-center justify-center mb-4 ${
              isHighUsage ? "animate-pulse" : ""
            }`}>
              <Icon className={`w-12 h-12 ${getStatusColor()}`} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 truncate w-full text-center px-2">{device.name}</h3>
          </div>
  
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${getStatusBgColor()} ${getStatusColor()}`}>
              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
            </span>
            {device.status === "on" && (
              <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
  
          <div className="min-h-[60px] flex flex-col items-center justify-center">
            {showTimer && (
              <div className="flex items-center justify-center gap-2 mb-4 text-purple-600 bg-purple-50 py-2 px-4 rounded-xl">
                <Clock className="w-5 h-5" />
                <span className="text-base font-semibold font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
  
            {device.hasAlert && !showTimer && (
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>
  
          <div className="h-px bg-gray-200 mb-5" />
  
          <div className="flex items-center justify-center gap-2 text-gray-700 mb-6">
            {device.status === "on" && (
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            )}
            <Zap className={`w-5 h-5 ${isHighUsage ? "text-red-500" : "text-emerald-500"}`} />
            <span className={`text-lg font-semibold transition-colors ${isHighUsage ? "text-red-600" : ""}`}>
              {Math.round(displayPower)}W
            </span>
          </div>
  
          <div className="mt-auto"></div>
        </button>
      </div>
    );
  }