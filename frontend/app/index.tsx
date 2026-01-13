import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Linking,
  AppState,
  AppStateStatus,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Primary accent color - RED
const PRIMARY_COLOR = "#FF0040";
const PRIMARY_LIGHT = "rgba(255, 0, 64, 0.15)";
const PRIMARY_GLOW = "rgba(255, 0, 64, 0.25)";

// Try to import native module (only works in development builds)
let FloatingBubble: any = null;
let isNativeModuleAvailable = false;

try {
  FloatingBubble = require('../modules/floating-bubble/src').default;
  isNativeModuleAvailable = Platform.OS === 'android';
} catch (e) {
  console.log('Native FloatingBubble module not available (expected in Expo Go/Web)');
}

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
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);
  const [isBubbleActive, setIsBubbleActive] = useState(false);
  
  // Animation for floating button
  const pulseScale = useSharedValue(1);
  
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  // Check overlay permission on mount and app resume
  useEffect(() => {
    checkOverlayPermission();
    
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkOverlayPermission();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Setup bubble event listeners
  useEffect(() => {
    if (isNativeModuleAvailable && FloatingBubble) {
      try {
        const { addBubblePressListener, addBubbleRemoveListener } = require('../modules/floating-bubble/src');
        
        const pressSubscription = addBubblePressListener(() => {
          // When bubble is pressed, show the panel
          setIsPanelVisible(true);
        });

        const removeSubscription = addBubbleRemoveListener(() => {
          setIsBubbleActive(false);
        });

        return () => {
          pressSubscription?.remove();
          removeSubscription?.remove();
        };
      } catch (e) {
        console.log('Could not setup bubble listeners');
      }
    }
  }, []);

  const checkOverlayPermission = async () => {
    if (isNativeModuleAvailable && FloatingBubble) {
      try {
        const { hasOverlayPermission: checkPermission } = require('../modules/floating-bubble/src');
        const hasPermission = checkPermission();
        setHasOverlayPermission(hasPermission);
      } catch (e) {
        setHasOverlayPermission(false);
      }
    }
  };

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
      if (isNativeModuleAvailable && FloatingBubble) {
        try {
          const { requestOverlayPermission: requestPerm } = require('../modules/floating-bubble/src');
          requestPerm();
          Alert.alert(
            "Permissão Necessária",
            "Após conceder a permissão, volte ao app e ative a sobreposição novamente.",
            [{ text: "OK" }]
          );
        } catch (e) {
          Linking.openSettings();
        }
      } else {
        Alert.alert(
          "Development Build Necessário",
          "Para usar a sobreposição real sobre outros apps, você precisa:\n\n1. Criar um Development Build\n2. Instalar o APK no seu dispositivo\n3. Conceder a permissão 'Exibir sobre outros apps'\n\nNo Expo Go, apenas a simulação está disponível.",
          [
            { text: "Entendi" },
            { 
              text: "Abrir Configurações", 
              onPress: () => Linking.openSettings()
            }
          ]
        );
      }
    } else {
      Alert.alert(
        "Não disponível no iOS",
        "A funcionalidade de sobreposição não está disponível no iOS devido às restrições do sistema Apple."
      );
    }
  };

  const activateFloatingBubble = async () => {
    if (!isNativeModuleAvailable || !FloatingBubble) {
      Alert.alert(
        "Módulo Nativo Não Disponível",
        "O botão flutuante sobre outros apps só funciona em um Development Build.\n\nPara criar:\n\n• npx expo prebuild\n• npx expo run:android\n\nOu use EAS Build para gerar um APK.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const { hasOverlayPermission: checkPerm, showBubble, hideBubble } = require('../modules/floating-bubble/src');
      
      if (!checkPerm()) {
        requestOverlayPermission();
        return;
      }

      if (isBubbleActive) {
        hideBubble();
        setIsBubbleActive(false);
      } else {
        await showBubble(50, 200);
        setIsBubbleActive(true);
        setIsPanelVisible(false);
        
        Alert.alert(
          "Bolha Ativada!",
          "O botão flutuante agora aparecerá sobre outros apps. Toque nele para abrir o painel.",
          [{ text: "OK" }]
        );
      }
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Não foi possível ativar o botão flutuante");
    }
  };

  const minimizeToOverlay = () => {
    if (isNativeModuleAvailable && hasOverlayPermission) {
      activateFloatingBubble();
    } else {
      setIsPanelVisible(false);
    }
  };

  const renderCheckbox = (active: boolean) => (
    <View style={[styles.checkbox, active && styles.checkboxActive]}>
      {active && <Ionicons name="checkmark" size={18} color="#fff" />}
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
          <TouchableOpacity style={styles.headerButton} onPress={minimizeToOverlay}>
            <MaterialCommunityIcons name="picture-in-picture-bottom-right" size={22} color="#fff" />
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

      {/* Overlay Controls */}
      <View style={styles.overlayControls}>
        <TouchableOpacity 
          style={[styles.overlayButton, isBubbleActive && styles.overlayButtonActive]} 
          onPress={activateFloatingBubble}
        >
          <MaterialCommunityIcons 
            name={isBubbleActive ? "close-circle" : "layers"} 
            size={18} 
            color={isBubbleActive ? "#fff" : PRIMARY_COLOR} 
          />
          <Text style={[styles.overlayButtonText, isBubbleActive && styles.overlayButtonTextActive]}>
            {isBubbleActive ? "Desativar Bolha" : "Ativar Sobreposição"}
          </Text>
        </TouchableOpacity>
        
        {Platform.OS === 'android' && (
          <TouchableOpacity style={styles.permissionButton} onPress={requestOverlayPermission}>
            <Ionicons name="settings-outline" size={16} color="#888" />
            <Text style={styles.permissionButtonText}>
              {hasOverlayPermission ? "Permissão OK" : "Dar Permissão"}
            </Text>
            {hasOverlayPermission && (
              <View style={styles.permissionDot} />
            )}
          </TouchableOpacity>
        )}
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
            
            {/* Native module status */}
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, isNativeModuleAvailable ? styles.statusDotActive : styles.statusDotInactive]} />
              <Text style={styles.statusLabel}>
                {isNativeModuleAvailable 
                  ? "Módulo nativo disponível" 
                  : "Modo simulação (Expo Go)"}
              </Text>
            </View>
            
            {Platform.OS === 'android' && isNativeModuleAvailable && (
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, hasOverlayPermission ? styles.statusDotActive : styles.statusDotInactive]} />
                <Text style={styles.statusLabel}>
                  {hasOverlayPermission 
                    ? "Permissão de overlay concedida" 
                    : "Permissão de overlay pendente"}
                </Text>
              </View>
            )}
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
          
          {/* Instructions for development build */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Para sobreposição real:</Text>
            <Text style={styles.instructionsText}>
              {Platform.OS === 'android' 
                ? "1. Execute: npx expo prebuild\n2. Execute: npx expo run:android\n3. Conceda permissão de overlay"
                : "Funcionalidade não disponível no iOS"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {renderPanel()}
        </View>
      )}
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: "#00FF00",
  },
  statusDotInactive: {
    backgroundColor: "#FF6600",
  },
  statusLabel: {
    fontSize: 12,
    color: "#888",
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 180,
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
    bottom: 140,
    fontSize: 12,
    color: "#666",
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginHorizontal: 20,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 11,
    color: "#888",
    lineHeight: 18,
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
  overlayControls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0a0a0a",
    borderTopWidth: 1,
    borderTopColor: "#222",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  overlayButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 0, 64, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    gap: 8,
  },
  overlayButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  overlayButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    fontWeight: "600",
  },
  overlayButtonTextActive: {
    color: "#fff",
  },
  permissionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  permissionButtonText: {
    color: "#888",
    fontSize: 11,
  },
  permissionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00FF00",
    marginLeft: 4,
  },
});
