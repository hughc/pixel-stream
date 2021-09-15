export const API_BASE_URL = "http://192.168.0.85:3001";

export function getBaseURL() {
  return process.env.NODE_ENV === "production"
    ? ""
    : "http://192.168.0.85:3001";
}
