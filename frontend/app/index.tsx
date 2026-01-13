import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Menu items for sidebar
type MenuKey = "principal" | "configs" | "gelo" | "ia" | "otimizar" | "mais";

interface MenuItem {
  id: MenuKey;
  label: string;
  icon: React.ReactNode;
}

// Feature item types
interface CheckboxFeature {
  id: string;
  label: string;
  type: "checkbox";
  active: boolean;
}

interface ToggleFeature {
  id: string;
  label: string;
  type: "toggle";
  active: boolean;
  icon: React.ReactNode;
}

type Feature = CheckboxFeature | ToggleFeature;

export default function PainelFreestyle() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("principal");
  const [features, setFeatures] = useState<Record<MenuKey, Feature[]>>({
    principal: [
      { id: "aimbot", label: "Aimbot Rage", type: "checkbox", active: true },
      { id: "aimlock", label: "Aimlock", type: "checkbox", active: false },
      { id: "norecoil", label: "No Recoil", type: "checkbox", active: false },
      {
        id: "botaotrick",
        label: "Botão Trick",
        type: "toggle",
        active: false,
        icon: <MaterialCommunityIcons name="target" size={20} color="#00FF00" />,
      },
      {
        id: "mirapro",
        label: "Mira Pro",
        type: "toggle",
        active: false,
        icon: <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#00FF00" />,
      },
    ],
    configs: [
      { id: "sensitivity", label: "Sensibilidade", type: "toggle", active: false, icon: <Ionicons name="settings" size={20} color="#00FF00" /> },
      { id: "fov", label: "Campo de Visão", type: "toggle", active: false, icon: <Ionicons name="eye" size={20} color="#00FF00" /> },
      { id: "smooth", label: "Smooth Aim", type: "checkbox", active: false },
    ],
    gelo: [
      { id: "freezeplayer", label: "Freeze Player", type: "checkbox", active: false },
      { id: "slowmo", label: "Slow Motion", type: "toggle", active: false, icon: <Ionicons name="time" size={20} color="#00FF00" /> },
    ],
    ia: [
      { id: "autoaim", label: "Auto Aim IA", type: "checkbox", active: false },
      { id: "prediction", label: "Predição", type: "toggle", active: false, icon: <MaterialCommunityIcons name="brain" size={20} color="#00FF00" /> },
    ],
    otimizar: [
      { id: "fps", label: "Boost FPS", type: "checkbox", active: false },
      { id: "ram", label: "Limpar RAM", type: "toggle", active: false, icon: <Ionicons name="flash" size={20} color="#00FF00" /> },
      { id: "ping", label: "Reduzir Ping", type: "checkbox", active: false },
    ],
    mais: [
      { id: "wallhack", label: "Wallhack", type: "checkbox", active: false },
      { id: "esp", label: "ESP Player", type: "toggle", active: false, icon: <Ionicons name="eye" size={20} color="#00FF00" /> },
      { id: "radar", label: "Mini Radar", type: "checkbox", active: false },
    ],
  });

  const menuItems: MenuItem[] = [
    {
      id: "principal",
      label: "Principal",
      icon: <FontAwesome5 name="skull" size={18} color={activeMenu === "principal" ? "#00FF00" : "#888"} />,
    },
    {
      id: "configs",
      label: "Configs",
      icon: <Ionicons name="settings" size={20} color={activeMenu === "configs" ? "#00FF00" : "#888"} />,
    },
    {
      id: "gelo",
      label: "Gelo",
      icon: <MaterialCommunityIcons name="spray" size={20} color={activeMenu === "gelo" ? "#00FF00" : "#888"} />,
    },
    {
      id: "ia",
      label: "I.A",
      icon: <MaterialCommunityIcons name="diamond-stone" size={20} color={activeMenu === "ia" ? "#00FF00" : "#888"} />,
    },
    {
      id: "otimizar",
      label: "Otimizar",
      icon: <Ionicons name="flash" size={20} color={activeMenu === "otimizar" ? "#00FF00" : "#888"} />,
    },
    {
      id: "mais",
      label: "Mais",
      icon: <Ionicons name="menu" size={20} color={activeMenu === "mais" ? "#00FF00" : "#888"} />,
    },
  ];

  const toggleFeature = (featureId: string) => {
    setFeatures((prev) => ({
      ...prev,
      [activeMenu]: prev[activeMenu].map((feature) =>
        feature.id === featureId ? { ...feature, active: !feature.active } : feature
      ),
    }));
  };

  const renderCheckbox = (active: boolean) => (
    <View style={[styles.checkbox, active && styles.checkboxActive]}>
      {active && <Ionicons name="checkmark" size={18} color="#000" />}
    </View>
  );

  const renderFeatureIcon = (feature: Feature) => {
    if (feature.type === "toggle" && "icon" in feature) {
      return (
        <View style={styles.featureIconContainer}>
          {feature.icon}
        </View>
      );
    }
    return null;
  };

  const renderStatusBadge = (active: boolean) => (
    <View style={[styles.statusBadge, active ? styles.statusActive : styles.statusInactive]}>
      <Text style={[styles.statusText, active ? styles.statusTextActive : styles.statusTextInactive]}>
        {active ? "ATIVO" : "DESATIVADO"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Panel Container */}
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>PAINEL FREESTYLE 5.0</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Feather name="minimize-2" size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Area */}
          <View style={styles.content}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, activeMenu === item.id && styles.menuItemActive]}
                  onPress={() => setActiveMenu(item.id)}
                >
                  <View style={[styles.menuIconContainer, activeMenu === item.id && styles.menuIconContainerActive]}>
                    {item.icon}
                  </View>
                  <Text style={[styles.menuLabel, activeMenu === item.id && styles.menuLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Main Content */}
            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
              {features[activeMenu].map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.featureRow}
                  onPress={() => feature.type === "checkbox" && toggleFeature(feature.id)}
                  activeOpacity={feature.type === "checkbox" ? 0.7 : 1}
                >
                  <View style={styles.featureLeft}>
                    {feature.type === "checkbox" ? (
                      renderCheckbox(feature.active)
                    ) : (
                      renderFeatureIcon(feature)
                    )}
                    <Text style={styles.featureLabel}>{feature.label}</Text>
                  </View>

                  <View style={styles.featureRight}>
                    {renderStatusBadge(feature.active)}
                    {feature.type === "toggle" && (
                      <Switch
                        value={feature.active}
                        onValueChange={() => toggleFeature(feature.id)}
                        trackColor={{ false: "#333", true: "#00FF00" }}
                        thumbColor={feature.active ? "#fff" : "#888"}
                        ios_backgroundColor="#333"
                        style={styles.switch}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#0a0a0a",
  },
  panel: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#00FF00",
    ...Platform.select({
      ios: {
        shadowColor: "#00FF00",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00FF00",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 95,
    paddingVertical: 16,
    paddingHorizontal: 6,
    backgroundColor: "#0d0d0d",
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  menuIconContainerActive: {
    backgroundColor: "#00FF00",
  },
  menuLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
    textAlign: "center",
  },
  menuLabelActive: {
    color: "#00FF00",
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  featureLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featureRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "transparent",
  },
  checkboxActive: {
    backgroundColor: "#00FF00",
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "rgba(0, 255, 0, 0.15)",
    borderWidth: 2,
    borderColor: "#00FF00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
  },
  statusActive: {
    backgroundColor: "rgba(0, 255, 0, 0.25)",
  },
  statusInactive: {
    backgroundColor: "rgba(255, 150, 150, 0.3)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statusTextActive: {
    color: "#00FF00",
  },
  statusTextInactive: {
    color: "#ff9090",
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
});
