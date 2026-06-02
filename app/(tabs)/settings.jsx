import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import ImageCropperModal from "@/components/modals/ImageCropperModal";
import { SettingRowItem } from "@/components/settings/SettingRowItem";
import { SettingSectionHeader } from "@/components/settings/SettingSectionHeader";
import api from "@/configs/api";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const Settings = () => {
  const { teacher, lastUpdated, loadTeacher, setTeacher } =
    useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [selectedRawUri, setSelectedRawUri] = useState("");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out of your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("teacher-token");
          setTeacher(null);
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  const handleChangeProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Gallery access is required to change your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setSelectedRawUri(result.assets[0].uri);
    setCropperVisible(true);
  };

  const handleUploadCroppedImage = async (croppedFile) => {
    setCropperVisible(false);
    setUploadingImage(true);

    const formData = new FormData();
    const filename = croppedFile.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("image", {
      uri:
        Platform.OS === "android"
          ? croppedFile.uri
          : croppedFile.uri.replace("file://", ""),
      name: filename || "profile.jpg",
      type,
    });

    try {
      const response = await api.post("/api/teacher/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        await loadTeacher();
        Alert.alert("Success", "Profile picture updated successfully.");
      } else {
        Alert.alert(
          "Update Failed",
          response.data?.message || "Failed to update profile picture.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message ||
          "An error occurred while updating profile picture.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <AnimatedScreen>
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: COLORS.background }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        >
          {/* ── TEACHER AVATAR TOP CARD CONTAINER ── */}
          <View className="p-6 rounded-3xl mb-6 items-center">
            <View className="relative w-24 h-24 mb-4">
              {teacher?.image?.url ? (
                <Image
                  source={{ uri: teacher.image.url }}
                  className="w-full h-full rounded-full bg-neutral-800"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full rounded-full items-center justify-center bg-neutral-800">
                  <Ionicons
                    name="person"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                </View>
              )}

              {uploadingImage && (
                <View className="absolute inset-0 bg-black/60 rounded-full items-center justify-center">
                  <ActivityIndicator color={COLORS.primary} size="small" />
                </View>
              )}

              <TouchableOpacity
                onPress={handleChangeProfilePicture}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border shadow-md"
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.card,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text
              className="text-xs text-center mt-1 px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor: COLORS.background,
                color: COLORS.primary,
              }}
            >
              ID: {teacher?.teacherId || "NAA-STAFF"}
            </Text>
          </View>

          {/* ── SECTION 1: DETAILED PROFILE DATA LIST ── */}
          <SettingSectionHeader title="Account Information" colors={COLORS} />
          <View
            className="rounded-3xl px-4 py-2 mb-6 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <View
              className="flex-row items-center justify-between py-3.5 border-b"
              style={{ borderColor: COLORS.border }}
            >
              <View className="flex-row items-center space-x-3 flex-1 pr-2">
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  Full Name
                </Text>
              </View>
              <Text
                className="text-sm font-bold text-right flex-1"
                numberOfLines={1}
                style={{ color: COLORS.textPrimary }}
              >
                {teacher?.name || "N/A"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-3.5">
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  Email Address
                </Text>
              </View>
              <Text
                className="text-sm font-bold text-right"
                style={{ color: COLORS.textPrimary }}
              >
                {teacher?.email}
              </Text>
            </View>
          </View>

          {/* ── SECTION 2: SECURITY OPTIONS ── */}
          <SettingSectionHeader title="Security" colors={COLORS} />
          <View
            className="rounded-3xl overflow-hidden mb-6 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <SettingRowItem
              icon="key-outline"
              title="Change Password"
              description="Update your security credentials regularly"
              onPress={() => router.push("/change-password")}
              colors={COLORS}
              isLast
            />
          </View>

          {/* ── SECTION 3: ACADEMY INFORMATION ── */}
          <SettingSectionHeader title="Academy Information" colors={COLORS} />
          <View
            className="rounded-3xl overflow-hidden mb-6 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <SettingRowItem
              icon="book-outline"
              title="Academic Rules"
              description="Institutional guidelines and parameters"
              onPress={() => router.push("/academic-rules")}
              colors={COLORS}
            />
            <SettingRowItem
              icon="document-text-outline"
              title="Terms & Conditions"
              description="Operational usage parameters"
              onPress={() => router.push("/terms-conditions")}
              colors={COLORS}
            />
            <SettingRowItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              description="Data footprint protection protocols"
              onPress={() => router.push("/privacy-policy")}
              colors={COLORS}
              isLast
            />
          </View>

          {/* ── SECTION 4: SYSTEM ABOUT & INFORMATION ── */}
          <SettingSectionHeader title="About & System" colors={COLORS} />
          <View
            className="rounded-3xl px-4 py-2 mb-6 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            {/* Developer Item Segment */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/developer")}
              className="flex-row items-center justify-between py-3.5 border-b"
              style={{ borderColor: COLORS.border }}
            >
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="code-slash-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  Developer
                </Text>
              </View>
              <Text
                className="text-sm font-bold underline"
                style={{ color: COLORS.primary }}
              >
                Shahadat Ali
              </Text>
            </TouchableOpacity>

            {/* Sync Status Info Row */}
            <View
              className="flex-row items-center justify-between py-3.5 border-b"
              style={{ borderColor: COLORS.border }}
            >
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  Last Updated On
                </Text>
              </View>
              <Text
                className="text-xs font-medium"
                style={{ color: COLORS.success }}
              >
                {lastUpdated || "Just now"}
              </Text>
            </View>

            {/* Build Version Info Row */}
            <View className="flex-row items-center justify-between py-3.5">
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="options-outline"
                  size={18}
                  color={COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.textSecondary }}
                >
                  Portal Version
                </Text>
              </View>
              <Text
                className="text-sm font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                v1.0.0 (Production)
              </Text>
            </View>
          </View>

          {/* ── SECTION 5: ACCOUNT SYSTEM MUTATIONS ── */}
          <SettingSectionHeader title="Session Management" colors={COLORS} />
          <View
            className="rounded-3xl overflow-hidden mb-8 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <TouchableOpacity
              onPress={handleLogout}
              className="py-4 flex-row items-center justify-center"
              style={{ backgroundColor: COLORS.card }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={COLORS.danger}
              />
              <Text
                className="font-bold ml-2 text-base"
                style={{ color: COLORS.danger }}
              >
                Log Out From Portal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Clean, simple legal mark stamp */}
          <Text
            className="text-[10px] font-medium text-center"
            style={{ color: COLORS.inactive }}
          >
            Nashib Ali Academy • © {new Date().getFullYear()} All Rights
            Reserved
          </Text>
        </ScrollView>
      </AnimatedScreen>

      <ImageCropperModal
        visible={cropperVisible}
        imageUri={selectedRawUri}
        onClose={() => setCropperVisible(false)}
        onCropSuccess={handleUploadCroppedImage}
      />
    </>
  );
};

export default Settings;
