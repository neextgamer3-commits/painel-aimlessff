import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Linking,
  AppState,
  AppStateStatus,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Primary accent color - GREEN NEON
const PRIMARY_COLOR = "#00FF00";
const PRIMARY_DARK = "#00CC00";
const PRIMARY_GLOW = "rgba(0, 255, 0, 0.4)";
const PRIMARY_LIGHT = "rgba(0, 255, 0, 0.15)";

// Try to import native module (only works in development builds)
let FloatingBubble: any = null;
let isNativeModuleAvailable = false;

try {
  FloatingBubble = require('../modules/floating-bubble/src').default;
  isNativeModuleAvailable = Platform.OS === 'android';
} catch (e) {
  console.log('Native FloatingBubble module not available');
}

// Menu items for sidebar
type MenuKey = "principal" | "configs" | "gelo" | "ia" | "otimizar" | "mais";

interface MenuItem {
  id: MenuKey;
  label: string;
  icon: React.ReactNode;
}

// Animated Glow Button Component
const GlowButton = ({ 
  onPress, 
  isActive, 
  children, 
  style 
}: { 
  onPress: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  style?: any;
}) => {
  const glowAnim = useSharedValue(0);
  
  useEffect(() => {
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [5, 15]),
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[
        styles.glowButton,
        isActive && styles.glowButtonActive,
        animatedGlow,
        style
      ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom Toggle Switch Component
const CustomToggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => {
  const translateX = useSharedValue(value ? 22 : 0);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(value ? 22 : 0, { damping: 15 });
    if (value) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      glowAnim.value = 0;
    }
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const trackGlow = useAnimatedStyle(() => ({
    shadowOpacity: value ? interpolate(glowAnim.value, [0, 1], [0.5, 1]) : 0,
    shadowRadius: value ? interpolate(glowAnim.value, [0, 1], [5, 15]) : 0,
  }));

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View style={[
        styles.toggleTrack,
        value && styles.toggleTrackActive,
        trackGlow
      ]}>
        <Animated.View style={[styles.toggleThumb, thumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Code Injection Animation Component
const CodeInjection = ({ visible, onComplete }: { visible: boolean; onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  
  const codeLines = [
    "const CheatMenu = (() => {",
    "  const weapons = ",
    '["Mp40","M1014","UMP","Desert","XM4","Skar","MP5"];',
    "  const state = {",
    "    aimlock: true,",
    "    headshot: true,",
    "    AIMTRICK: true,",
    "    AimDispersal: false,",
    "    sensitivity: 85,",
    "  };",
    "",
    "function initAimAssist() {",
    "  const target = findNearestEnemy();",
    "  if (target && target.distance < 100) {",
    "    adjustAim(target.position);",
    "    return true;",
    "  }",
    "  return false;",
    "}",
    "",
    "function calculateHeadshot(enemy) {",
    "  const headPos = enemy.skeleton.head;",
    "  const offset = getRecoilOffset();",
    "  return { x: headPos.x - offset.x,",
    "           y: headPos.y - offset.y };",
    "}",
    "",
    "// Inicializando módulos...",
    "initAimAssist();",
    "loadWeaponConfigs(weapons);",
    "activateNoRecoil();",
    "enableAutoAim();",
    "",
    "console.log('IA Injetada com sucesso!');",
    "return { status: 'ACTIVE' };",
    "})();",
  ];

  useEffect(() => {
    if (visible) {
      setLines([]);
      let index = 0;
      const interval = setInterval(() => {
        if (index < codeLines.length) {
          setLines(prev => [...prev, codeLines[index]]);
          index++;
          scrollRef.current?.scrollToEnd({ animated: true });
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 1500);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.codeContainer}>
      <View style={styles.codeHeader}>
        <View style={styles.codeHeaderIcon}>
          <Ionicons name="checkmark" size={20} color="#000" />
        </View>
        <Text style={styles.codeHeaderText}>Códigos injetados!</Text>
      </View>
      <ScrollView 
        ref={scrollRef}
        style={styles.codeScroll}
        showsVerticalScrollIndicator={false}
      >
        {lines.map((line, i) => (
          <Text key={i} style={styles.codeLine}>{line}</Text>
        ))}
      </ScrollView>
      <View style={styles.gunIcon}>
        <MaterialCommunityIcons name="pistol" size={120} color={PRIMARY_COLOR} />
      </View>
    </View>
  );
};

// Refresh Rate Selector Component
const RefreshRateSelector = ({ 
  visible, 
  onSelect, 
  onClose,
  currentRate 
}: { 
  visible: boolean; 
  onSelect: (rate: number) => void;
  onClose: () => void;
  currentRate: number;
}) => {
  const rates = [60, 90, 120, 144];

  if (!visible) return null;

  return (
    <View style={styles.rateSelector}>
      <Text style={styles.rateSelectorTitle}>TAXA DE ATUALIZAÇÃO</Text>
      <Text style={styles.rateSelectorSubtitle}>Selecione a taxa de Hz</Text>
      
      <View style={styles.rateOptions}>
        {rates.map((rate) => (
          <GlowButton 
            key={rate}
            onPress={() => onSelect(rate)}
            isActive={currentRate === rate}
            style={styles.rateButton}
          >
            <Text style={[
              styles.rateButtonText,
              currentRate === rate && styles.rateButtonTextActive
            ]}>
              {rate}Hz
            </Text>
          </GlowButton>
        ))}
      </View>
      
      <TouchableOpacity style={styles.rateCloseButton} onPress={onClose}>
        <Text style={styles.rateCloseText}>APLICAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function PainelAimlessFF() {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("principal");
  const [showCodeInjection, setShowCodeInjection] = useState(false);
  const [showRefreshRate, setShowRefreshRate] = useState(false);
  const [selectedRefreshRate, setSelectedRefreshRate] = useState(60);
  const [selectedGelo, setSelectedGelo] = useState<'normal' | 'invertido' | 'reduzido'>('normal');
  const [iaInjected, setIaInjected] = useState(false);
  
  // Feature states
  const [features, setFeatures] = useState({
    aimbot: true,
    aimlock: false,
    norecoil: false,
    headshot: false,
    antiban: true,
  });

  const pulseScale = useSharedValue(1);
  
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const menuItems: MenuItem[] = [
    {
      id: "principal",
      label: "Principal",
      icon: <FontAwesome5 name="skull" size={16} color={activeMenu === "principal" ? "#000" : "#888"} />,
    },
    {
      id: "configs",
      label: "Configs",
      icon: <Ionicons name="settings" size={18} color={activeMenu === "configs" ? "#000" : "#888"} />,
    },
    {
      id: "gelo",
      label: "Gelo",
      icon: <MaterialCommunityIcons name="spray" size={18} color={activeMenu === "gelo" ? "#000" : "#888"} />,
    },
    {
      id: "ia",
      label: "I.A",
      icon: <MaterialCommunityIcons name="diamond-stone" size={18} color={activeMenu === "ia" ? "#000" : "#888"} />,
    },
    {
      id: "otimizar",
      label: "Otimizar",
      icon: <Ionicons name="flash" size={18} color={activeMenu === "otimizar" ? "#000" : "#888"} />,
    },
    {
      id: "mais",
      label: "Mais",
      icon: <Ionicons name="menu" size={18} color={activeMenu === "mais" ? "#000" : "#888"} />,
    },
  ];

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInjectIA = () => {
    setShowCodeInjection(true);
  };

  const handleCodeComplete = () => {
    setShowCodeInjection(false);
    setIaInjected(true);
    Alert.alert("Sucesso!", "IA injetada com sucesso! Suas configurações foram aplicadas.");
  };

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/@AIMLESSREGEDIT');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "principal":
        return (
          <View style={styles.contentArea}>
            <FeatureRow 
              label="Aimbot Rage" 
              active={features.aimbot} 
              onToggle={() => toggleFeature('aimbot')}
              hasCheckbox
            />
            <FeatureRow 
              label="Aimlock" 
              active={features.aimlock} 
              onToggle={() => toggleFeature('aimlock')}
              hasCheckbox
            />
            <FeatureRow 
              label="No Recoil" 
              active={features.norecoil} 
              onToggle={() => toggleFeature('norecoil')}
              hasCheckbox
            />
            <FeatureRow 
              label="Headshot" 
              active={features.headshot} 
              onToggle={() => toggleFeature('headshot')}
              hasToggle
            />
            <FeatureRow 
              label="Anti-Ban" 
              active={features.antiban} 
              onToggle={() => toggleFeature('antiban')}
              hasToggle
            />
          </View>
        );

      case "gelo":
        return (
          <View style={styles.contentArea}>
            <View style={styles.geloHeader}>
              <View style={styles.geloIconContainer}>
                <MaterialCommunityIcons name="spray" size={24} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.geloTitle}>DEFINA O TIPO DE GELO</Text>
            </View>
            
            <View style={styles.geloImageContainer}>
              <MaterialCommunityIcons 
                name="account-cowboy-hat" 
                size={100} 
                color={PRIMARY_COLOR} 
                style={{ opacity: 0.6 }}
              />
            </View>
            
            <View style={styles.geloOptions}>
              <GlowButton 
                onPress={() => setSelectedGelo('normal')}
                isActive={selectedGelo === 'normal'}
                style={styles.geloButton}
              >
                <Text style={[styles.geloButtonText, selectedGelo === 'normal' && styles.geloButtonTextActive]}>
                  NORMAL
                </Text>
              </GlowButton>
              
              <GlowButton 
                onPress={() => setSelectedGelo('invertido')}
                isActive={selectedGelo === 'invertido'}
                style={styles.geloButton}
              >
                <Text style={[styles.geloButtonText, selectedGelo === 'invertido' && styles.geloButtonTextActive]}>
                  INVERTIDO
                </Text>
                <MaterialCommunityIcons name="moon-waning-crescent" size={16} color={selectedGelo === 'invertido' ? "#000" : "#fff"} />
              </GlowButton>
              
              <GlowButton 
                onPress={() => setSelectedGelo('reduzido')}
                isActive={selectedGelo === 'reduzido'}
                style={styles.geloButton}
              >
                <Text style={[styles.geloButtonText, selectedGelo === 'reduzido' && styles.geloButtonTextActive]}>
                  REDUZIDO
                </Text>
                <MaterialCommunityIcons name="arrow-collapse" size={16} color={selectedGelo === 'reduzido' ? "#000" : "#fff"} />
              </GlowButton>
            </View>
          </View>
        );

      case "ia":
        return (
          <View style={styles.contentArea}>
            {showCodeInjection ? (
              <CodeInjection visible={showCodeInjection} onComplete={handleCodeComplete} />
            ) : (
              <View style={styles.iaContainer}>
                <MaterialCommunityIcons name="robot" size={80} color={PRIMARY_COLOR} style={{ opacity: 0.3 }} />
                <Text style={styles.iaTitle}>INTELIGÊNCIA ARTIFICIAL</Text>
                <Text style={styles.iaSubtitle}>
                  {iaInjected 
                    ? "IA ativa! Seus módulos estão funcionando." 
                    : "Injete a IA para melhorar sua mira automaticamente"}
                </Text>
                
                <GlowButton 
                  onPress={handleInjectIA}
                  isActive={iaInjected}
                  style={styles.injectButton}
                >
                  <MaterialCommunityIcons 
                    name={iaInjected ? "check-circle" : "needle"} 
                    size={24} 
                    color={iaInjected ? "#000" : "#fff"} 
                  />
                  <Text style={[styles.injectButtonText, iaInjected && { color: "#000" }]}>
                    {iaInjected ? "IA INJETADA" : "INJETAR IA"}
                  </Text>
                </GlowButton>
              </View>
            )}
          </View>
        );

      case "otimizar":
        return (
          <View style={styles.contentArea}>
            {showRefreshRate ? (
              <RefreshRateSelector 
                visible={showRefreshRate}
                currentRate={selectedRefreshRate}
                onSelect={(rate) => setSelectedRefreshRate(rate)}
                onClose={() => setShowRefreshRate(false)}
              />
            ) : (
              <View style={styles.optimizeContainer}>
                <MaterialCommunityIcons name="speedometer" size={60} color={PRIMARY_COLOR} style={{ opacity: 0.3 }} />
                <Text style={styles.optimizeTitle}>OTIMIZAÇÃO DE TELA</Text>
                
                <View style={styles.currentRate}>
                  <Text style={styles.currentRateLabel}>Taxa atual:</Text>
                  <Text style={styles.currentRateValue}>{selectedRefreshRate}Hz</Text>
                </View>
                
                <GlowButton 
                  onPress={() => setShowRefreshRate(true)}
                  style={styles.optimizeButton}
                >
                  <Ionicons name="speedometer" size={20} color="#fff" />
                  <Text style={styles.optimizeButtonText}>ALTERAR TAXA DE Hz</Text>
                </GlowButton>
                
                <GlowButton 
                  onPress={() => Alert.alert("Otimizado!", "RAM limpa com sucesso!")}
                  style={[styles.optimizeButton, { marginTop: 12 }]}
                >
                  <MaterialCommunityIcons name="memory" size={20} color="#fff" />
                  <Text style={styles.optimizeButtonText}>LIMPAR RAM</Text>
                </GlowButton>
              </View>
            )}
          </View>
        );

      case "mais":
        return (
          <View style={styles.contentArea}>
            <View style={styles.maisContainer}>
              <View style={styles.maisHeader}>
                <MaterialCommunityIcons name="information" size={40} color={PRIMARY_COLOR} />
                <Text style={styles.maisTitle}>INFORMAÇÕES</Text>
              </View>
              
              <View style={styles.maisInfo}>
                <View style={styles.maisRow}>
                  <Ionicons name="calendar" size={20} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Última atualização:</Text>
                  <Text style={styles.maisValue}>13 / 01 / 2026</Text>
                </View>
                
                <View style={styles.maisRow}>
                  <Ionicons name="code-slash" size={20} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Versão:</Text>
                  <Text style={styles.maisValue}>5.0</Text>
                </View>
                
                <View style={styles.maisRow}>
                  <Ionicons name="person" size={20} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Criador:</Text>
                  <Text style={styles.maisValue}>AimlessFF</Text>
                </View>
              </View>
              
              <GlowButton onPress={openYouTube} style={styles.youtubeButton}>
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
                <Text style={styles.youtubeButtonText}>CANAL DO CRIADOR</Text>
              </GlowButton>
              
              <Text style={styles.youtubeSub}>@AIMLESSREGEDIT</Text>
            </View>
          </View>
        );

      case "configs":
        return (
          <View style={styles.contentArea}>
            <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
            <FeatureRow 
              label="Sensibilidade Auto" 
              active={true} 
              onToggle={() => {}}
              hasToggle
            />
            <FeatureRow 
              label="Campo de Visão" 
              active={false} 
              onToggle={() => {}}
              hasToggle
            />
            <FeatureRow 
              label="Smooth Aim" 
              active={true} 
              onToggle={() => {}}
              hasToggle
            />
          </View>
        );

      default:
        return null;
    }
  };

  const FeatureRow = ({ 
    label, 
    active, 
    onToggle, 
    hasCheckbox,
    hasToggle 
  }: { 
    label: string; 
    active: boolean; 
    onToggle: () => void;
    hasCheckbox?: boolean;
    hasToggle?: boolean;
  }) => (
    <View style={styles.featureRow}>
      <View style={styles.featureLeft}>
        {hasCheckbox && (
          <TouchableOpacity onPress={onToggle}>
            <View style={[styles.checkbox, active && styles.checkboxActive]}>
              {active && <Ionicons name="checkmark" size={16} color="#000" />}
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.featureLabel}>{label}</Text>
      </View>
      <View style={styles.featureRight}>
        <View style={[styles.statusBadge, active ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, active ? styles.statusTextActive : styles.statusTextInactive]}>
            {active ? "ATIVO" : "DESATIVADO"}
          </Text>
        </View>
        {hasToggle && <CustomToggle value={active} onToggle={onToggle} />}
      </View>
    </View>
  );

  const renderPanel = () => (
    <View style={styles.panelLandscape}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PAINEL AimlessFF 5.0</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="arrow-collapse" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsPanelVisible(false)}>
            <Ionicons name="close" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentWrapper}>
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
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" hidden={isPanelVisible} />
      
      {!isPanelVisible ? (
        <View style={styles.floatingContainer}>
          <View style={styles.backgroundInfo}>
            <MaterialCommunityIcons name="gamepad-variant" size={80} color="#333" />
            <Text style={styles.backgroundTitle}>AimlessFF</Text>
            <Text style={styles.backgroundSubtitle}>Toque no botão para abrir o painel</Text>
          </View>
          
          <Animated.View style={[styles.floatingButtonContainer, animatedButtonStyle]}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => setIsPanelVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.floatingButtonInner}>
                <MaterialCommunityIcons name="crosshairs-gps" size={32} color="#000" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  floatingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
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
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  floatingButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.2)",
  },
  floatingHint: {
    position: "absolute",
    bottom: 110,
    fontSize: 12,
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  panelLandscape: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    margin: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
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
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 90,
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: "#0d0d0d",
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  menuIconContainer: {
    width: 38,
    height: 38,
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
    fontSize: 9,
    color: "#888",
    fontWeight: "500",
  },
  menuLabelActive: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentArea: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  featureLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 85,
    alignItems: "center",
  },
  statusActive: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
  },
  statusInactive: {
    backgroundColor: "rgba(255, 150, 150, 0.2)",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  statusTextActive: {
    color: PRIMARY_COLOR,
  },
  statusTextInactive: {
    color: "#ff9090",
  },
  // Custom Toggle
  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#333",
    justifyContent: "center",
    padding: 3,
    shadowColor: PRIMARY_COLOR,
  },
  toggleTrackActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000",
  },
  // Glow Button
  glowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#444",
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
  },
  glowButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  // Gelo Section
  geloHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  geloIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  geloTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  geloImageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  geloOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  geloButton: {
    minWidth: 100,
  },
  geloButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  geloButtonTextActive: {
    color: "#000",
  },
  // IA Section
  iaContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  iaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 16,
  },
  iaSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },
  injectButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  injectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  // Code Injection
  codeContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 16,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  codeHeaderIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  codeHeaderText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  codeScroll: {
    flex: 1,
  },
  codeLine: {
    color: PRIMARY_COLOR,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    lineHeight: 18,
  },
  gunIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    opacity: 0.8,
  },
  // Refresh Rate
  rateSelector: {
    alignItems: "center",
    paddingVertical: 20,
  },
  rateSelectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  rateSelectorSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  rateOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  rateButton: {
    minWidth: 80,
  },
  rateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  rateButtonTextActive: {
    color: "#000",
  },
  rateCloseButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 24,
  },
  rateCloseText: {
    color: "#000",
    fontWeight: "bold",
  },
  // Optimize
  optimizeContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  optimizeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 12,
  },
  currentRate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  currentRateLabel: {
    color: "#888",
    fontSize: 14,
  },
  currentRateValue: {
    color: PRIMARY_COLOR,
    fontSize: 24,
    fontWeight: "bold",
  },
  optimizeButton: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  optimizeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Mais Section
  maisContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  maisHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  maisTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 8,
  },
  maisInfo: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  maisRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  maisLabel: {
    color: "#888",
    fontSize: 13,
    flex: 1,
  },
  maisValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  youtubeButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#1a1a1a",
    borderColor: "#FF0000",
  },
  youtubeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  youtubeSub: {
    color: "#666",
    fontSize: 12,
    marginTop: 8,
  },
});
