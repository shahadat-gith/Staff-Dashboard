import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { ThemeContext } from "@/context/ThemeProvider";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const TodaySchedule = ({ timetableData }) => {
  const { COLORS } = useContext(ThemeContext);

  const schedule = timetableData?.schedule || emptyScheduleStructure;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaySchedule = schedule?.[today] || [];

  return (
    <View
      className="rounded-3xl p-5 mb-5"
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      {/* Widget Header Area */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text
            className="text-xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Today&apos;s Schedule
          </Text>

          <Text
            className="mt-1 text-xs font-medium"
            style={{ color: COLORS.textSecondary }}
          >
            {today} • {todaySchedule.length} classes scheduled
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/timetable")}
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
          activeOpacity={0.7}
        >
          <Feather name="arrow-up-right" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Conditional Slots Listing */}
      {todaySchedule.length > 0 ? (
        <View>
          {todaySchedule.map((slot, index) => {
            // Clean up default fallback data layouts safely
            const classText = slot.class || "N/A";
            const mediumText = slot.medium || "N/A";

            // Filter out default backend string assignments smoothly
            const hasStream =
              slot.stream && slot.stream !== "null" && slot.stream !== "None";
            const subDetailLabel = hasStream
              ? `Class ${classText} (${slot.stream}) • ${mediumText}`
              : `Class ${classText} • ${mediumText}`;

            return (
              <View
                key={index}
                className="rounded-2xl p-4 mb-3"
                style={{ backgroundColor: COLORS.background }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-2">
                    <Text
                      className="text-base font-bold"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {slot.subject || "Subject"}
                    </Text>

                    <Text
                      className="mt-1 text-xs font-medium"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {subDetailLabel}
                    </Text>
                  </View>

                  {/* Time Indicator Frame */}
                  <View className="flex-row items-center bg-transparent px-2 py-1 rounded-xl">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={COLORS.primary}
                    />

                    <Text
                      className="ml-1 font-bold text-sm"
                      style={{ color: COLORS.primary }}
                    >
                      {slot.timeSlot || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        /* Empty Schedule Fallback State */
        <View className="items-center py-8">
          <Ionicons
            name="calendar-clear-outline"
            size={42}
            color={COLORS.textSecondary}
          />

          <Text
            className="text-lg font-bold mt-3"
            style={{ color: COLORS.textPrimary }}
          >
            No Classes Today
          </Text>

          <Text
            className="text-center mt-1 px-6 text-xs leading-relaxed"
            style={{ color: COLORS.textSecondary }}
          >
            You do not have any scheduled academic routines assigned for {today}
            .
          </Text>
        </View>
      )}
    </View>
  );
};

export default TodaySchedule;
