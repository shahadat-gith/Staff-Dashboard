import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";

import api from "@/configs/api";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [teacher, setTeacher] = useState(null);
  const [sessionChecking, setSessionChecking] = useState(true);

  const [lastUpdated, setLastUpdated] = useState("Loading...");

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/shahadat-gith/NAA/commits?per_page=1",
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

  const loadTeacher = async () => {
    try {
      const token = await SecureStore.getItemAsync("teacher-token");

      if (!token) {
        setTeacher(null);
        return null;
      }

      const response = await api.get("/api/auth/teacher/me");

      if (response.data?.success && response.data?.teacher) {
        setTeacher(response.data.teacher);
        return response.data.teacher;
      }

      setTeacher(null);
      await SecureStore.deleteItemAsync("teacher-token");
      return null;
    } catch (error) {
      console.log(
        "loadTeacher error:",
        error?.response?.data || error?.message,
      );
      setTeacher(null);
      await SecureStore.deleteItemAsync("teacher-token");
      return null;
    } finally {
      setSessionChecking(false);
    }
  };

  useEffect(() => {
    loadTeacher();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        teacher,
        setTeacher,
        sessionChecking,
        setSessionChecking,
        loadTeacher,
        lastUpdated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
