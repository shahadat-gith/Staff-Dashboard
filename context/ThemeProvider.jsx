import React, { createContext, useMemo } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

const lightColors = {
  primary: "#ff4d2d",
  background: "#f5f5f5",
  card: "#ffffff",
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  success: "#16a34a",
  danger: "#ef4444",
  white: "#ffffff",
  inactive: "#9ca3af",
};

const darkColors = {
  primary: "#ff6b4a",
  background: "#111827",
  card: "#1f2937",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
  success: "#22c55e",
  danger: "#ef4444",
  white: "#ffffff",
  inactive: "#6b7280",
};

export const ThemeProvider = ({ children }) => {
  // Automatically reads "light" or "dark" from the Android/iOS system settings live
  const systemTheme = useColorScheme();

  // Safely fallback to "light" if the device doesn't expose a specific theme preference scheme
  const activeTheme = systemTheme || "light";

  // Choose the theme properties immediately based on the native system runtime status
  const COLORS = activeTheme === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      activeTheme,
      COLORS,
    }),
    [COLORS, activeTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
