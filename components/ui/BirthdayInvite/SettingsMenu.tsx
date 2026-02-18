import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import OnboardingModal from "@/components/ui/BirthdayInvite/OnboardingModal";
import { ThemePanel } from "./ThemePanel";
import { useTheme } from "@/app/context/ThemeContext";
import { ConfettiPickerModal } from "@/app/ConfettoModal";

interface SettingsMenuProps {
  confettiEmoji: string;
  setConfettiEmoji: (emoji: string) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  confettiEmoji,
  setConfettiEmoji,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [themePanelVisible, setThemePanelVisible] = useState(false);
  const [guideVisible, setGuideVisible] = useState(true);
  const [confettiModalVisible, setConfettiModalVisible] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      {/* Pulsante Settings principale */}
      <TouchableOpacity
        style={[
          styles.settingsButton,
          { backgroundColor: theme.button.background },
        ]}
        onPress={() => setMenuVisible((prev) => !prev)} // toggle sicuro
        activeOpacity={0.8} // riduce effetto scomparsa visiva
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* Menu impostazioni */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setThemePanelVisible(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>🎨 Theme</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setConfettiModalVisible(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>✨ Confetti Emoji</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setGuideVisible(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>❓ Guida</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pannello Theme */}
      {themePanelVisible && (
        <ThemePanel onClose={() => setThemePanelVisible(false)} />
      )}

       {/* Confetti Emoji Picker */}
       {confettiModalVisible && (
        <ConfettiPickerModal
          visible={confettiModalVisible}
          onClose={() => setConfettiModalVisible(false)}
          onSelect={(emoji) => {
            setConfettiEmoji(emoji);
          }}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        visible={guideVisible}
        onClose={() => setGuideVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 37,
    height: 37,
    backgroundColor: "#ff1493",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  settingsIcon: { fontSize: 24, color: "#fff" },
  menu: {
    position: "absolute",
    top: 35,
    right: 10,
    width: 165,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    zIndex: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
