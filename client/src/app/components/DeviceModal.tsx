import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Edit2, Zap, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: {
    id: string;
    name: string;
    type: string;
    status: "on" | "off";
    power: number;
    isHighUsage?: boolean;
    runtime?: number;
  };
}

const generateDeviceData = (deviceId: string, deviceType: string) => {
  const seed = parseInt(deviceId) || 1;

  const randomInRange = (min: number, max: number, index: number) => {
    const hash = (seed * 1000 + index * 17) % 100;
    return min + (hash / 100) * (max - min);
  };

  const baseMultiplier = deviceType === "gaming" ? 1.5 :
                         deviceType === "washer" ? 1.2 :
                         deviceType === "stove" ? 0.8 :
                         deviceType === "tv" ? 1.0 : 0.7;

  return {
    week: [
      { day: "Mon", usage: randomInRange(2.5, 5.0, 0) * baseMultiplier },
      { day: "Tue", usage: randomInRange(2.0, 4.5, 1) * baseMultiplier },
      { day: "Wed", usage: randomInRange(3.0, 5.5, 2) * baseMultiplier },
      { day: "Thu", usage: randomInRange(2.5, 4.8, 3) * baseMultiplier },
      { day: "Fri", usage: randomInRange(3.5, 6.0, 4) * baseMultiplier },
      { day: "Sat", usage: randomInRange(4.0, 7.0, 5) * baseMultiplier },
      { day: "Sun", usage: randomInRange(3.8, 6.5, 6) * baseMultiplier },
    ],
    month: [
      { week: "Week 1", usage: randomInRange(18, 25, 0) * baseMultiplier },
      { week: "Week 2", usage: randomInRange(15, 23, 1) * baseMultiplier },
      { week: "Week 3", usage: randomInRange(20, 28, 2) * baseMultiplier },
      { week: "Week 4", usage: randomInRange(17, 24, 3) * baseMultiplier },
    ],
    sixMonth: [
      { month: "Nov", usage: randomInRange(75, 95, 0) * baseMultiplier },
      { month: "Dec", usage: randomInRange(80, 100, 1) * baseMultiplier },
      { month: "Jan", usage: randomInRange(70, 90, 2) * baseMultiplier },
      { month: "Feb", usage: randomInRange(75, 95, 3) * baseMultiplier },
      { month: "Mar", usage: randomInRange(85, 105, 4) * baseMultiplier },
      { month: "Apr", usage: randomInRange(90, 110, 5) * baseMultiplier },
    ],
    year: [
      { quarter: "Q2 '25", usage: randomInRange(240, 280, 0) * baseMultiplier },
      { quarter: "Q3 '25", usage: randomInRange(260, 300, 1) * baseMultiplier },
      { quarter: "Q4 '25", usage: randomInRange(230, 270, 2) * baseMultiplier },
      { quarter: "Q1 '26", usage: randomInRange(270, 310, 3) * baseMultiplier },
    ],
  };
};

export function DeviceModal({ isOpen, onClose, device }: DeviceModalProps) {
  const [timeRange, setTimeRange] = useState("week");
  const [liveRuntime, setLiveRuntime] = useState(device.runtime || 0);

  const deviceData = generateDeviceData(device.id, device.type);

  useEffect(() => {
    setLiveRuntime(device.runtime || 0);
  }, [device.runtime]);

  useEffect(() => {
    if (device.status === "on" && isOpen) {
      const interval = setInterval(() => {
        setLiveRuntime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [device.status, isOpen]);

  const formatRuntime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getChartData = () => {
    switch (timeRange) {
      case "week":
        return deviceData.week;
      case "month":
        return deviceData.month;
      case "6months":
        return deviceData.sixMonth;
      case "year":
        return deviceData.year;
      default:
        return deviceData.week;
    }
  };

  const getDataKey = () => {
    switch (timeRange) {
      case "week":
        return "day";
      case "month":
        return "week";
      case "6months":
        return "month";
      case "year":
        return "quarter";
      default:
        return "day";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{device.name}</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${device.status === "on" ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-base font-medium text-gray-600">
                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 ${device.isHighUsage ? "text-red-500" : "text-emerald-500"}`} />
              <span className={`text-3xl font-bold ${device.isHighUsage ? "text-red-600" : "text-gray-900"}`}>
                {device.power}W
              </span>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <Clock className="w-6 h-6 text-indigo-500" />
              <span className="text-2xl font-bold text-gray-900 font-mono">
                {device.status === "on" ? formatRuntime(liveRuntime) : "00:00:00"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-base text-gray-500">Current power consumption</p>
            <p className="text-base text-gray-500">
              {device.status === "on" ? "Running time" : "Not active"}
            </p>
          </div>
        </div>

        {device.isHighUsage && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <p className="text-base font-bold text-red-900">⚡ High energy usage detected</p>
                <p className="text-sm text-red-700 mt-1">This device is consuming more power than usual</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-base font-bold text-emerald-900">📈 Usage increased by 12% this week</p>
              <p className="text-sm text-emerald-700 mt-1">Slightly higher than your typical usage</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Energy Usage</h3>
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-base font-semibold">+12%</span>
            </div>
          </div>

          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1.5 h-12">
              <TabsTrigger value="week" className="rounded-lg data-[state=active]:bg-white text-sm font-medium">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="rounded-lg data-[state=active]:bg-white text-sm font-medium">
                Month
              </TabsTrigger>
              <TabsTrigger value="6months" className="rounded-lg data-[state=active]:bg-white text-sm font-medium">
                6 Months
              </TabsTrigger>
              <TabsTrigger value="year" className="rounded-lg data-[state=active]:bg-white text-sm font-medium">
                Year
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={getChartData() as any} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey={getDataKey()}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 13 }}
                    tickFormatter={(value) => `${value}kWh`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "12px",
                    }}
                    formatter={(value) => [`${value} kWh`, "Usage"]}
                  />
                  <Bar dataKey="usage" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}