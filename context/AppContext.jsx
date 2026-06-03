import { createContext } from "react";

export const AppContext = createContext({
  backendUrl: "",
  staff: null,
  setStaff: () => {},
  sessionChecking: true,
  setSessionChecking: () => {},
  loadStaff: async () => {},
  logout: async () => {},
  lastUpdated: "Loading...",
});