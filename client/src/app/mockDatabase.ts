export type DeviceType =
  | "tv"
  | "gaming"
  | "stove"
  | "washer"
  | "dryer"
  | "refrigerator"
  | "microwave"
  | "lamp"
  | "computer"
  | "charger"
  | "router"
  | "fan";

export interface EnergyUsageHistory {
  week: { day: string; usage: number }[];
  month: { week: string; usage: number }[];
  sixMonth: { month: string; usage: number }[];
  year: { quarter: string; usage: number }[];
}

export interface Device {
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
  energyHistory?: EnergyUsageHistory;
}

const DEVICE_STORAGE_KEY = "ihms_mock_devices";

const getBasePower = (type: DeviceType) => {
  switch (type) {
    case "gaming":
      return 165;
    case "washer":
      return 450;
    case "dryer":
      return 520;
    case "refrigerator":
      return 180;
    case "microwave":
      return 950;
    case "stove":
      return 1200;
    case "computer":
      return 220;
    case "router":
      return 18;
    case "charger":
      return 12;
    case "fan":
      return 55;
    case "lamp":
      return 35;
    case "tv":
    default:
      return 120;
  }
};

const getUsageMultiplier = (type: DeviceType) => {
  switch (type) {
    case "gaming":
      return 1.5;
    case "washer":
    case "dryer":
      return 1.2;
    case "stove":
    case "microwave":
      return 0.9;
    case "router":
    case "charger":
    case "lamp":
      return 0.45;
    case "refrigerator":
      return 1.1;
    default:
      return 1;
  }
};

const randomUsage = (min: number, max: number, multiplier: number) =>
  Number(((min + Math.random() * (max - min)) * multiplier).toFixed(1));

export const generateEnergyUsageHistory = (type: DeviceType): EnergyUsageHistory => {
  const multiplier = getUsageMultiplier(type);

  return {
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      usage: randomUsage(2, 7, multiplier),
    })),
    month: ["Week 1", "Week 2", "Week 3", "Week 4"].map((week) => ({
      week,
      usage: randomUsage(15, 28, multiplier),
    })),
    sixMonth: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((month) => ({
      month,
      usage: randomUsage(70, 110, multiplier),
    })),
    year: ["Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26"].map((quarter) => ({
      quarter,
      usage: randomUsage(230, 310, multiplier),
    })),
  };
};

export const initialDevices: Device[] = [
  {
    id: "1",
    name: "Living Room TV",
    type: "tv",
    status: "on",
    power: 120,
    hasWifi: true,
    isHighUsage: false,
    runtime: 3240,
    energyHistory: generateEnergyUsageHistory("tv"),
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
    energyHistory: generateEnergyUsageHistory("gaming"),
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
    energyHistory: generateEnergyUsageHistory("stove"),
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
    energyHistory: generateEnergyUsageHistory("washer"),
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
    energyHistory: generateEnergyUsageHistory("tv"),
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
    energyHistory: generateEnergyUsageHistory("tv"),
  },
];

const readStoredDevices = () => {
  try {
    const storedDevices = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    return storedDevices ? (JSON.parse(storedDevices) as Device[]) : null;
  } catch {
    return null;
  }
};

export const getDevices = () => {
  const storedDevices = readStoredDevices();
  if (storedDevices) {
    return storedDevices.map((device) => ({
      ...device,
      energyHistory: device.energyHistory || generateEnergyUsageHistory(device.type),
    }));
  }

  saveDevices(initialDevices);
  return initialDevices;
};

export const saveDevices = (devices: Device[]) => {
  window.localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
};

export const resetDevices = () => {
  saveDevices(initialDevices);
  return initialDevices;
};

export const createDevice = (name: string, type: DeviceType) => {
  const status = Math.random() > 0.35 ? "on" : "off";
  return {
    id: crypto.randomUUID(),
    name,
    type,
    status,
    power: status === "on" ? getBasePower(type) : 0,
    hasWifi: true,
    isHighUsage: false,
    runtime: status === "on" ? Math.floor(Math.random() * 3600) : 0,
    energyHistory: generateEnergyUsageHistory(type),
  };
};

export const addDevice = (name: string, type: DeviceType) => {
  const devices = getDevices();
  const newDevice = createDevice(name, type);

  const updatedDevices = [...devices, newDevice];
  saveDevices(updatedDevices);
  return newDevice;
};
