import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { ThemeContext } from "@/context/ThemeProvider";

const RecentAttendance = ({ attendance = [] }) => {
  const { COLORS } = useContext(ThemeContext);

  const formatDate = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCheckInTime = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      className="rounded-3xl p-5 mb-5"
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      {/* Header Label Block */}
      <View className="flex-row items-center justify-between mb-4">
        <Text
          className="text-xl font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          Recent Attendance Logs
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/attendance")}
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
          activeOpacity={0.7}
        >
          <Feather name="arrow-up-right" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Conditional Logs Rendering Layout */}
      {attendance.length > 0 ? (
        <View>
          {attendance.slice(0, 5).map((log) => {
            const status = log.status || "Present";

            // Comprehensive styling map for all 3 backend database enum values
            let badgeBg = "rgba(107, 114, 128, 0.15)";
            let badgeBorder = "rgba(107, 114, 128, 0.1)";
            let textColor = COLORS.textSecondary;

            if (status === "Present") {
              badgeBg =
                COLORS.card === "#ffffff"
                  ? "#dcfce7"
                  : "rgba(22, 163, 74, 0.15)";
              badgeBorder = "rgba(22, 163, 74, 0.1)";
              textColor = COLORS.success;
            } else if (status === "Absent") {
              badgeBg =
                COLORS.card === "#ffffff"
                  ? "#fee2e2"
                  : "rgba(239, 68, 68, 0.2)";
              badgeBorder = "rgba(239, 68, 68, 0.1)";
              textColor = COLORS.danger;
            } else if (status === "On-Leave") {
              // Smooth warning amber palette injection for approved absences
              badgeBg =
                COLORS.card === "#ffffff"
                  ? "#fef3c7"
                  : "rgba(217, 119, 6, 0.15)";
              badgeBorder = "rgba(217, 119, 6, 0.1)";
              textColor = COLORS.warning || "#d97706";
            }

            return (
              <View
                key={log._id}
                className="rounded-2xl px-4 py-3 mb-3"
                style={{ backgroundColor: COLORS.background }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text
                      className="font-bold text-base"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {formatDate(log.date)}
                    </Text>

                    <Text
                      className="text-xs mt-1"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Check-In: {formatCheckInTime(log.createdAt)}
                    </Text>
                  </View>

                  {/* Adaptive Status Badge Container */}
                  <View
                    className="px-3 py-1 rounded-full border items-center justify-center"
                    style={{
                      backgroundColor: badgeBg,
                      borderColor: badgeBorder,
                    }}
                  >
                    <Text
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: textColor }}
                    >
                      {status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Empty Logs Fallback Placeholder */
        <View className="items-center py-8">
          <Ionicons
            name="document-text-outline"
            size={42}
            color={COLORS.textSecondary}
          />

          <Text
            className="text-base font-semibold mt-3 text-center"
            style={{ color: COLORS.textPrimary }}
          >
            No recent attendance entries recorded.
          </Text>
        </View>
      )}
    </View>
  );
};

export default RecentAttendance;
