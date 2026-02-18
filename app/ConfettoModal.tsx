import { CONFETTI_EMOJIS } from "@/constants/emoji";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "./context/ThemeContext";

// --- Interfaccia Props ---
interface ConfettiPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export const ConfettiPickerModal: React.FC<ConfettiPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {

    const {theme} = useTheme()
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Scegli il tuo confetto ✨</Text>

          <ScrollView contentContainerStyle={styles.grid}>
            {CONFETTI_EMOJIS.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={styles.emojiButton}
                onPress={() => {
                  onSelect(emoji);
                  onClose();
                }}
              >
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
        style={[
          styles.closeButton,
          { backgroundColor: theme.button.background },
        ]}
        onPress={onClose}
      >
        <Text style={[styles.closeText, { color: theme.button.text }]}>
          Chiudi
        </Text>
      </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#ffe4ef",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    height: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emojiButton: {
    padding: 10,
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
    backgroundColor: "#ff4081",
  },  
  closeText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
