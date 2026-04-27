import type { Device } from "./mockDatabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const request = async <T>(path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const fetchDevices = () => request<Device[]>("/api/devices");

export const createDeviceOnApi = (device: Device) =>
  request<Device>("/api/devices", {
    method: "POST",
    body: JSON.stringify(device),
  });

export const updateDeviceOnApi = (id: string, updates: Partial<Device>) =>
  request<Device>(`/api/devices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const deleteDeviceOnApi = (id: string) =>
  request<void>(`/api/devices/${id}`, {
    method: "DELETE",
  });
