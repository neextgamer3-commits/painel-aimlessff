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
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Primary accent color - STRONG RED
const PRIMARY_COLOR = "#FF0040";
const PRIMARY_DARK = "#CC0033";
const PRIMARY_GLOW = "rgba(255, 0, 64, 0.6)";
const PRIMARY_LIGHT = "rgba(255, 0, 64, 0.2)";

// Menu items for sidebar
type MenuKey = "principal" | "configs" | "gelo" | "ia" | "otimizar" | "mais";

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
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.4, 1]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [8, 20]),
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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

// Custom Toggle Switch with Glow
const CustomToggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => {
  const translateX = useSharedValue(value ? 24 : 0);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(value ? 24 : 0, { damping: 15 });
    if (value) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
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
    shadowOpacity: value ? interpolate(glowAnim.value, [0, 1], [0.6, 1]) : 0,
    shadowRadius: value ? interpolate(glowAnim.value, [0, 1], [10, 25]) : 0,
  }));

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View style={[
        styles.toggleTrack,
        value && styles.toggleTrackActive,
        trackGlow
      ]}>
        <Animated.View style={[
          styles.toggleThumb, 
          thumbStyle,
          value && styles.toggleThumbActive
        ]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Checkbox with Glow
const GlowCheckbox = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => {
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    if (checked) {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.4, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      glowAnim.value = 0;
    }
  }, [checked]);

  const animatedGlow = useAnimatedStyle(() => ({
    shadowOpacity: checked ? interpolate(glowAnim.value, [0, 1], [0.5, 1]) : 0,
    shadowRadius: checked ? interpolate(glowAnim.value, [0, 1], [8, 18]) : 0,
  }));

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <Animated.View style={[
        styles.checkbox,
        checked && styles.checkboxActive,
        animatedGlow
      ]}>
        {checked && <Ionicons name="checkmark" size={18} color="#fff" />}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Code Animation Component (for IA and RAM)
const CodeAnimation = ({ 
  visible, 
  onComplete,
  type 
}: { 
  visible: boolean; 
  onComplete: () => void;
  type: 'ia' | 'ram';
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  
  const iaCodeLines = [
    "const AimAssist = (() => {",
    "  const weapons = ",
    '  ["Mp40","M1014","UMP","Desert","XM8","Scar"];',
    "  const config = {",
    "    aimlock: true,",
    "    headshot: true,",
    "    AIMTRICK: true,",
    "    sensitivity: 85,",
    "  };",
    "",
    "function initAimAssist() {",
    "  const target = findNearestEnemy();",
    "  if (target && target.distance < 100) {",
    "    adjustAim(target.position);",
    "    return true;",
    "  }",
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
    "",
    "console.log('IA Injetada com sucesso!');",
    "return { status: 'ACTIVE' };",
    "})();",
  ];

  const ramCodeLines = [
    "const RAMCleaner = (() => {",
    "  const memoryBlocks = [];",
    "  let freedMemory = 0;",
    "",
    "function scanMemory() {",
    "  console.log('Escaneando memória...');",
    "  const blocks = getMemoryBlocks();",
    "  return blocks.filter(b => !b.inUse);",
    "}",
    "",
    "function clearCache() {",
    "  const cache = getCacheData();",
    "  cache.forEach(item => {",
    "    if (item.age > 30000) {",
    "      item.dispose();",
    "      freedMemory += item.size;",
    "    }",
    "  });",
    "}",
    "",
    "function optimizeRAM() {",
    "  // Liberando processos em background",
    "  killBackgroundProcesses();",
    "  ",
    "  // Limpando cache do sistema",
    "  clearSystemCache();",
    "  ",
    "  // Compactando memória",
    "  compactMemory();",
    "}",
    "",
    "// Executando limpeza...",
    "const unused = scanMemory();",
    "clearCache();",
    "optimizeRAM();",
    "",
    "console.log('RAM otimizada!');",
    "console.log('Memória liberada: 847MB');",
    "return { freed: '847MB' };",
    "})();",
  ];

  const codeLines = type === 'ia' ? iaCodeLines : ramCodeLines;

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
      }, 80);
      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.codeContainer}>
      <View style={styles.codeHeader}>
        <View style={styles.codeHeaderIcon}>
          <Ionicons name="checkmark" size={18} color="#000" />
        </View>
        <Text style={styles.codeHeaderText}>
          {type === 'ia' ? 'Códigos injetados!' : 'Limpando RAM...'}
        </Text>
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
      <View style={styles.codeIcon}>
        {type === 'ia' ? (
          <MaterialCommunityIcons name="pistol" size={100} color={PRIMARY_COLOR} />
        ) : (
          <MaterialCommunityIcons name="memory" size={100} color={PRIMARY_COLOR} />
        )}
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
  const [showRamCleaning, setShowRamCleaning] = useState(false);
  const [showRefreshRate, setShowRefreshRate] = useState(false);
  const [selectedRefreshRate, setSelectedRefreshRate] = useState(60);
  const [selectedGelo, setSelectedGelo] = useState<'normal' | 'invertido' | 'reduzido'>('normal');
  const [iaInjected, setIaInjected] = useState(false);
  const [ramCleaned, setRamCleaned] = useState(false);
  
  // Feature states
  const [features, setFeatures] = useState({
    aimbot: true,
    aimlock: false,
    norecoil: false,
    headshot: false,
    antiban: true,
    sensitivity: true,
    fov: false,
    smooth: true,
  });

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

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const menuItems = [
    { id: "principal" as MenuKey, label: "Principal", iconName: "skull" as const },
    { id: "configs" as MenuKey, label: "Configs", iconName: "settings" as const },
    { id: "gelo" as MenuKey, label: "Gelo", iconName: "snow" as const },
    { id: "ia" as MenuKey, label: "I.A", iconName: "hardware-chip" as const },
    { id: "otimizar" as MenuKey, label: "Otimizar", iconName: "flash" as const },
    { id: "mais" as MenuKey, label: "Mais", iconName: "menu" as const },
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
    Alert.alert("Sucesso!", "IA injetada com sucesso!");
  };

  const handleCleanRAM = () => {
    setShowRamCleaning(true);
  };

  const handleRamComplete = () => {
    setShowRamCleaning(false);
    setRamCleaned(true);
    Alert.alert("Sucesso!", "RAM otimizada! 847MB liberados.");
  };

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/@AIMLESSREGEDIT');
  };

  const renderMenuIcon = (iconName: string, isActive: boolean) => {
    const color = isActive ? "#000" : "#888";
    switch(iconName) {
      case "skull":
        return <FontAwesome5 name="skull" size={16} color={color} />;
      case "settings":
        return <Ionicons name="settings" size={18} color={color} />;
      case "snow":
        return <Ionicons name="snow" size={18} color={color} />;
      case "hardware-chip":
        return <Ionicons name="hardware-chip" size={18} color={color} />;
      case "flash":
        return <Ionicons name="flash" size={18} color={color} />;
      case "menu":
        return <Ionicons name="menu" size={18} color={color} />;
      default:
        return null;
    }
  };

  const FeatureRow = ({ 
    label, 
    featureKey,
    hasCheckbox,
    hasToggle 
  }: { 
    label: string; 
    featureKey: keyof typeof features;
    hasCheckbox?: boolean;
    hasToggle?: boolean;
  }) => {
    const isActive = features[featureKey];
    
    return (
      <View style={styles.featureRow}>
        <View style={styles.featureLeft}>
          {hasCheckbox && (
            <GlowCheckbox 
              checked={isActive} 
              onToggle={() => toggleFeature(featureKey)}
            />
          )}
          <Text style={styles.featureLabel}>{label}</Text>
        </View>
        <View style={styles.featureRight}>
          <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextInactive]}>
              {isActive ? "ATIVO" : "DESATIVADO"}
            </Text>
          </View>
          {hasToggle && (
            <CustomToggle 
              value={isActive} 
              onToggle={() => toggleFeature(featureKey)}
            />
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "principal":
        return (
          <View style={styles.contentArea}>
            <FeatureRow label="Aimbot Rage" featureKey="aimbot" hasCheckbox />
            <FeatureRow label="Aimlock" featureKey="aimlock" hasCheckbox />
            <FeatureRow label="No Recoil" featureKey="norecoil" hasCheckbox />
            <FeatureRow label="Headshot" featureKey="headshot" hasToggle />
            <FeatureRow label="Anti-Ban" featureKey="antiban" hasToggle />
          </View>
        );

      case "configs":
        return (
          <View style={styles.contentArea}>
            <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
            <FeatureRow label="Sensibilidade Auto" featureKey="sensitivity" hasToggle />
            <FeatureRow label="Campo de Visão" featureKey="fov" hasToggle />
            <FeatureRow label="Smooth Aim" featureKey="smooth" hasToggle />
          </View>
        );

      case "gelo":
        return (
          <View style={styles.contentArea}>
            <View style={styles.geloHeader}>
              <View style={styles.geloIconContainer}>
                <Ionicons name="snow" size={24} color="#fff" />
              </View>
              <Text style={styles.geloTitle}>DEFINA O TIPO DE GELO</Text>
            </View>
            
            <View style={styles.geloImageContainer}>
              {/* Ice wall / frozen wall icon */}
              <View style={styles.iceWallContainer}>
                <MaterialCommunityIcons name="wall" size={80} color={PRIMARY_COLOR} />
                <View style={styles.iceOverlay}>
                  <Ionicons name="snow" size={30} color="#fff" style={styles.snowIcon1} />
                  <Ionicons name="snow" size={20} color="#fff" style={styles.snowIcon2} />
                  <Ionicons name="snow" size={25} color="#fff" style={styles.snowIcon3} />
                </View>
              </View>
            </View>
            
            <View style={styles.geloOptions}>
              <GlowButton 
                onPress={() => setSelectedGelo('normal')}
                isActive={selectedGelo === 'normal'}
                style={styles.geloButton}
              >
                <Ionicons name="snow" size={16} color={selectedGelo === 'normal' ? "#000" : "#fff"} />
                <Text style={[styles.geloButtonText, selectedGelo === 'normal' && styles.geloButtonTextActive]}>
                  NORMAL
                </Text>
              </GlowButton>
              
              <GlowButton 
                onPress={() => setSelectedGelo('invertido')}
                isActive={selectedGelo === 'invertido'}
                style={styles.geloButton}
              >
                <MaterialCommunityIcons name="rotate-3d-variant" size={16} color={selectedGelo === 'invertido' ? "#000" : "#fff"} />
                <Text style={[styles.geloButtonText, selectedGelo === 'invertido' && styles.geloButtonTextActive]}>
                  INVERTIDO
                </Text>
              </GlowButton>
              
              <GlowButton 
                onPress={() => setSelectedGelo('reduzido')}
                isActive={selectedGelo === 'reduzido'}
                style={styles.geloButton}
              >
                <MaterialCommunityIcons name="arrow-collapse" size={16} color={selectedGelo === 'reduzido' ? "#000" : "#fff"} />
                <Text style={[styles.geloButtonText, selectedGelo === 'reduzido' && styles.geloButtonTextActive]}>
                  REDUZIDO
                </Text>
              </GlowButton>
            </View>
          </View>
        );

      case "ia":
        return (
          <View style={styles.contentArea}>
            {showCodeInjection ? (
              <CodeAnimation visible={showCodeInjection} onComplete={handleCodeComplete} type="ia" />
            ) : (
              <View style={styles.iaContainer}>
                <MaterialCommunityIcons name="robot" size={70} color={PRIMARY_COLOR} style={{ opacity: 0.4 }} />
                <Text style={styles.iaTitle}>INTELIGÊNCIA ARTIFICIAL</Text>
                <Text style={styles.iaSubtitle}>
                  {iaInjected 
                    ? "IA ativa! Módulos funcionando." 
                    : "Injete a IA para melhorar sua mira"}
                </Text>
                
                <GlowButton 
                  onPress={handleInjectIA}
                  isActive={iaInjected}
                  style={styles.injectButton}
                >
                  <MaterialCommunityIcons 
                    name={iaInjected ? "check-circle" : "needle"} 
                    size={22} 
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
            {showRamCleaning ? (
              <CodeAnimation visible={showRamCleaning} onComplete={handleRamComplete} type="ram" />
            ) : showRefreshRate ? (
              <RefreshRateSelector 
                visible={showRefreshRate}
                currentRate={selectedRefreshRate}
                onSelect={(rate) => setSelectedRefreshRate(rate)}
                onClose={() => setShowRefreshRate(false)}
              />
            ) : (
              <View style={styles.optimizeContainer}>
                <MaterialCommunityIcons name="speedometer" size={50} color={PRIMARY_COLOR} style={{ opacity: 0.4 }} />
                <Text style={styles.optimizeTitle}>OTIMIZAÇÃO</Text>
                
                <View style={styles.currentRate}>
                  <Text style={styles.currentRateLabel}>Taxa atual:</Text>
                  <Text style={styles.currentRateValue}>{selectedRefreshRate}Hz</Text>
                </View>
                
                <GlowButton 
                  onPress={() => setShowRefreshRate(true)}
                  style={styles.optimizeButton}
                >
                  <Ionicons name="speedometer" size={18} color="#fff" />
                  <Text style={styles.optimizeButtonText}>ALTERAR TAXA DE Hz</Text>
                </GlowButton>
                
                <GlowButton 
                  onPress={handleCleanRAM}
                  isActive={ramCleaned}
                  style={styles.optimizeButton}
                >
                  <MaterialCommunityIcons 
                    name="memory" 
                    size={18} 
                    color={ramCleaned ? "#000" : "#fff"} 
                  />
                  <Text style={[styles.optimizeButtonText, ramCleaned && { color: "#000" }]}>
                    {ramCleaned ? "RAM LIMPA" : "LIMPAR RAM"}
                  </Text>
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
                <MaterialCommunityIcons name="information" size={36} color={PRIMARY_COLOR} />
                <Text style={styles.maisTitle}>INFORMAÇÕES</Text>
              </View>
              
              <View style={styles.maisInfo}>
                <View style={styles.maisRow}>
                  <Ionicons name="calendar" size={18} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Última atualização:</Text>
                  <Text style={styles.maisValue}>13 / 01 / 2026</Text>
                </View>
                
                <View style={styles.maisRow}>
                  <Ionicons name="code-slash" size={18} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Versão:</Text>
                  <Text style={styles.maisValue}>5.0</Text>
                </View>
                
                <View style={styles.maisRow}>
                  <Ionicons name="person" size={18} color={PRIMARY_COLOR} />
                  <Text style={styles.maisLabel}>Criador:</Text>
                  <Text style={styles.maisValue}>AimlessFF</Text>
                </View>
              </View>
              
              <GlowButton onPress={openYouTube} style={styles.youtubeButton}>
                <Ionicons name="logo-youtube" size={22} color="#FF0000" />
                <Text style={styles.youtubeButtonText}>CANAL DO CRIADOR</Text>
              </GlowButton>
              
              <Text style={styles.youtubeSub}>@AIMLESSREGEDIT</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderPanel = () => (
    <View style={styles.panelLandscape}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PAINEL AimlessFF 5.0</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="arrow-collapse" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsPanelVisible(false)}>
            <Ionicons name="close" size={20} color="#fff" />
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
                {renderMenuIcon(item.iconName, activeMenu === item.id)}
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
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
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
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
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
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 85,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: "#0d0d0d",
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: "rgba(255, 0, 64, 0.15)",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  menuIconContainerActive: {
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
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
    marginVertical: 10,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  contentArea: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    gap: 8,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  statusActive: {
    backgroundColor: "rgba(255, 0, 64, 0.25)",
  },
  statusInactive: {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
  },
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statusTextActive: {
    color: PRIMARY_COLOR,
  },
  statusTextInactive: {
    color: "#888",
  },
  // Custom Toggle
  toggleTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#333",
    justifyContent: "center",
    padding: 2,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
  },
  toggleTrackActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#666",
  },
  toggleThumbActive: {
    backgroundColor: "#fff",
  },
  // Glow Button
  glowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    marginVertical: 4,
  },
  glowButtonActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  // Gelo Section
  geloHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  geloIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  geloTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  geloImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  iceWallContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iceOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  snowIcon1: {
    position: "absolute",
    top: 5,
    left: 10,
  },
  snowIcon2: {
    position: "absolute",
    bottom: 10,
    right: 5,
  },
  snowIcon3: {
    position: "absolute",
    top: 20,
    right: 15,
  },
  geloOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  geloButton: {
    minWidth: 95,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  geloButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
  geloButtonTextActive: {
    color: "#000",
  },
  // IA Section
  iaContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  iaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 12,
  },
  iaSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
    textAlign: "center",
  },
  injectButton: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  injectButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  // Code Animation
  codeContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  codeHeaderIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  codeHeaderText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
  },
  codeScroll: {
    flex: 1,
  },
  codeLine: {
    color: PRIMARY_COLOR,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    lineHeight: 16,
  },
  codeIcon: {
    position: "absolute",
    right: 8,
    bottom: 8,
    opacity: 0.7,
  },
  // Refresh Rate
  rateSelector: {
    alignItems: "center",
    paddingVertical: 16,
  },
  rateSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  rateSelectorSubtitle: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  rateOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  rateButton: {
    minWidth: 75,
    paddingVertical: 10,
  },
  rateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  rateButtonTextActive: {
    color: "#000",
  },
  rateCloseButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  rateCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Optimize
  optimizeContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  optimizeTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 10,
  },
  currentRate: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  currentRateLabel: {
    color: "#888",
    fontSize: 13,
  },
  currentRateValue: {
    color: PRIMARY_COLOR,
    fontSize: 22,
    fontWeight: "bold",
  },
  optimizeButton: {
    marginTop: 14,
    paddingHorizontal: 20,
    minWidth: 180,
  },
  optimizeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  // Mais Section
  maisContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  maisHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  maisTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginTop: 6,
  },
  maisInfo: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  maisRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
  maisLabel: {
    color: "#888",
    fontSize: 12,
    flex: 1,
  },
  maisValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  youtubeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderColor: "#FF0000",
  },
  youtubeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  youtubeSub: {
    color: "#666",
    fontSize: 11,
    marginTop: 6,
  },
});
