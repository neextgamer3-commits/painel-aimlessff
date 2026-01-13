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
  Modal,
  Alert,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Primary accent color - RED
const PRIMARY_COLOR = "#FF0040";
const PRIMARY_LIGHT = "rgba(255, 0, 64, 0.15)";
const PRIMARY_GLOW = "rgba(255, 0, 64, 0.25)";

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

export default function PainelAimlessFF() {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("principal");
  
  // Animation for floating button
  const pulseScale = useSharedValue(1);
  
  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

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
        icon: <MaterialCommunityIcons name="target" size={20} color={PRIMARY_COLOR} />,
      },
      {
        id: "mirapro",
        label: "Mira Pro",
        type: "toggle",
        active: false,
        icon: <MaterialCommunityIcons name="crosshairs-gps" size={20} color={PRIMARY_COLOR} />,
      },
    ],
    configs: [
      { id: "sensitivity", label: "Sensibilidade", type: "toggle", active: false, icon: <Ionicons name="settings" size={20} color={PRIMARY_COLOR} /> },
      { id: "fov", label: "Campo de Visão", type: "toggle", active: false, icon: <Ionicons name="eye" size={20} color={PRIMARY_COLOR} /> },
      { id: "smooth", label: "Smooth Aim", type: "checkbox", active: false },
    ],
    gelo: [
      { id: "freezeplayer", label: "Freeze Player", type: "checkbox", active: false },
      { id: "slowmo", label: "Slow Motion", type: "toggle", active: false, icon: <Ionicons name="time" size={20} color={PRIMARY_COLOR} /> },
    ],
    ia: [
      { id: "autoaim", label: "Auto Aim IA", type: "checkbox", active: false },
      { id: "prediction", label: "Predição", type: "toggle", active: false, icon: <MaterialCommunityIcons name="brain" size={20} color={PRIMARY_COLOR} /> },
    ],
    otimizar: [
      { id: "fps", label: "Boost FPS", type: "checkbox", active: false },
      { id: "ram", label: "Limpar RAM", type: "toggle", active: false, icon: <Ionicons name="flash" size={20} color={PRIMARY_COLOR} /> },
      { id: "ping", label: "Reduzir Ping", type: "checkbox", active: false },
    ],
    mais: [
      { id: "wallhack", label: "Wallhack", type: "checkbox", active: false },
      { id: "esp", label: "ESP Player", type: "toggle", active: false, icon: <Ionicons name="eye" size={20} color={PRIMARY_COLOR} /> },
      { id: "radar", label: "Mini Radar", type: "checkbox", active: false },
    ],
  });

  const menuItems: MenuItem[] = [
    {
      id: "principal",
      label: "Principal",
      icon: <FontAwesome5 name="skull" size={18} color={activeMenu === "principal" ? PRIMARY_COLOR : "#888"} />,
    },
    {
      id: "configs",
      label: "Configs",
      icon: <Ionicons name="settings" size={20} color={activeMenu === "configs" ? PRIMARY_COLOR : "#888"} />,
    },
    {
      id: "gelo",
      label: "Gelo",
      icon: <MaterialCommunityIcons name="spray" size={20} color={activeMenu === "gelo" ? PRIMARY_COLOR : "#888"} />,
    },
    {
      id: "ia",
      label: "I.A",
      icon: <MaterialCommunityIcons name="diamond-stone" size={20} color={activeMenu === "ia" ? PRIMARY_COLOR : "#888"} />,
    },
    {
      id: "otimizar",
      label: "Otimizar",
      icon: <Ionicons name="flash" size={20} color={activeMenu === "otimizar" ? PRIMARY_COLOR : "#888"} />,
    },
    {
      id: "mais",
      label: "Mais",
      icon: <Ionicons name="menu" size={20} color={activeMenu === "mais" ? PRIMARY_COLOR : "#888"} />,
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

  const requestOverlayPermission = () => {
    if (Platform.OS === "android") {
      Alert.alert(
        "Permissão de Sobreposição",
        "Para usar o painel sobre outros apps, você precisa conceder a permissão de 'Exibir sobre outros apps' nas configurações.\n\nDeseja abrir as configurações?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Abrir Configurações", 
            onPress: () => {
              // Tenta abrir as configurações de overlay do Android
              Linking.openSettings();
            }
          },
        ]
      );
    } else {
      Alert.alert(
        "Não disponível",
        "A funcionalidade de sobreposição não está disponível no iOS devido às restrições do sistema."
      );
    }
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

  const renderPanel = () => (
    <View style={styles.panel}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PAINEL AimlessFF</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={requestOverlayPermission}>
            <MaterialCommunityIcons name="cellphone-screenshot" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsPanelVisible(false)}>
            <Ionicons name="close" size={24} color="#fff" />
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
                    trackColor={{ false: "#333", true: PRIMARY_COLOR }}
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

      {/* Info about overlay */}
      <View style={styles.overlayInfo}>
        <TouchableOpacity style={styles.overlayButton} onPress={requestOverlayPermission}>
          <MaterialCommunityIcons name="layers" size={16} color={PRIMARY_COLOR} />
          <Text style={styles.overlayButtonText}>Ativar Sobreposição</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Background with floating button when panel is closed */}
      {!isPanelVisible ? (
        <View style={styles.floatingContainer}>
          <View style={styles.backgroundInfo}>
            <MaterialCommunityIcons name="gamepad-variant" size={80} color="#333" />
            <Text style={styles.backgroundTitle}>AimlessFF</Text>
            <Text style={styles.backgroundSubtitle}>Toque no botão vermelho para abrir o painel</Text>
          </View>
          
          {/* Floating Button */}
          <Animated.View style={[styles.floatingButtonContainer, animatedButtonStyle]}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => setIsPanelVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.floatingButtonInner}>
                <MaterialCommunityIcons name="crosshairs-gps" size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.floatingHint}>Toque para abrir</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {renderPanel()}
        </View>
      )}

      {/* Modal overlay simulation */}
      <Modal
        visible={false}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          {renderPanel()}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  floatingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  backgroundInfo: {
    alignItems: "center",
    marginBottom: 60,
  },
  backgroundTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 16,
    letterSpacing: 2,
  },
  backgroundSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 150,
  },
  floatingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  floatingButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  floatingHint: {
    position: "absolute",
    bottom: 100,
    fontSize: 12,
    color: "#666",
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
    borderColor: PRIMARY_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
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
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "rgba(255, 0, 64, 0.1)",
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
    backgroundColor: PRIMARY_COLOR,
  },
  menuLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
    textAlign: "center",
  },
  menuLabelActive: {
    color: PRIMARY_COLOR,
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
    borderColor: PRIMARY_COLOR,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "transparent",
  },
  checkboxActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: PRIMARY_LIGHT,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
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
    backgroundColor: PRIMARY_GLOW,
  },
  statusInactive: {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statusTextActive: {
    color: PRIMARY_COLOR,
  },
  statusTextInactive: {
    color: "#888",
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
  overlayInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0a0a0a",
    borderTopWidth: 1,
    borderTopColor: "#222",
    alignItems: "center",
  },
  overlayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 64, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    gap: 8,
  },
  overlayButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
});
