import { staffApi } from "@/api/staff";
import api from "@/configs/api";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [staff, setStaff] = useState(null);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Loading...");

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/shahadat-gith/NAA-Teacher-Dashboard/commits?per_page=1",
        );

        if (!response.ok) {
          throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        const commitDate = data[0]?.commit?.committer?.date;

        if (!commitDate) {
          throw new Error("Commit date not found");
        }

        const formattedDate = new Date(commitDate).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        setLastUpdated(formattedDate);
      } catch (error) {
        console.error("Error fetching from GitHub:", error);
        setLastUpdated("Recently");
      }
    };

    fetchLastUpdate();
  }, []);

  const loadStaff = async () => {
    try {
      const token = await SecureStore.getItemAsync("staff-token");

      if (!token) {
        setStaff(null);
        setSessionChecking(false);
        return null;
      }

      const data = await staffApi.getProfile();

      if (data?.success && data?.staff) {
        setStaff(data.staff);
        setSessionChecking(false);
        return data.staff;
      }

      // Profile fetch failed, clear the session
      setStaff(null);
      await SecureStore.deleteItemAsync("staff-token");
      delete api.defaults.headers.common["Authorization"];
      setSessionChecking(false);
      return null;
    } catch (error) {
      console.log("loadStaff session persistence failure:", error?.message);
      setStaff(null);
      try {
        await SecureStore.deleteItemAsync("staff-token");
      } catch (e) {
        console.log("Error clearing token:", e?.message);
      }
      delete api.defaults.headers.common["Authorization"];
      setSessionChecking(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("staff-token");
      delete api.defaults.headers.common["Authorization"];
      setStaff(null);
    } catch (error) {
      console.log("Error during logout:", error?.message);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        staff,
        setStaff,
        sessionChecking,
        setSessionChecking,
        loadStaff,
        logout,
        lastUpdated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
