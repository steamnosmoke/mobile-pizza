import axios from "axios";
import { Platform } from "react-native";

function getDefaultBaseUrl(): string {
  const override =
    (global as any).__JSON_SERVER_HOST ||
    (process.env && process.env.JSON_SERVER_HOST);
  if (override) {
    return String(override);
  }

  if (Platform.OS === "android") {
    return "http://192.168.1.2:3001";
  }

  return "http://192.168.1.2:3001";
}

export const api = axios.create({
  baseURL: getDefaultBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
  (global as any).__JSON_SERVER_HOST = url;
}
