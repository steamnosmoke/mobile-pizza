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
    return "http://10.0.2.2:3001";
  }

  return "http://localhost:3001";
}

export const api = axios.create({
  baseURL: getDefaultBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

export function setApiBaseUrl(url: string) {
  api.defaults.baseURL = url;
  (global as any).__JSON_SERVER_HOST = url;
}
