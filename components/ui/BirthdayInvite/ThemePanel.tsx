import { useTheme } from "@/app/context/ThemeContext";
import { COLOR_MAP } from "@/constants/theme";
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Props = {
  onClose: () => void;
};

export const ThemePanel = ({ onClose }: Props) => {
  const { theme, setTheme } = useTheme();

  // Converte nomi colori in hex se presenti in COLOR_MAP
  const parseColor = (value: string) => {
    const lower = value.toLowerCase().trim();
    if (COLOR_MAP[lower]) return COLOR_MAP[lower];
    return value; // supporta anche #hex o rgb
  };

  // Aggiorna proprietà nested del tema
  const updateTheme = (path: string, value: string) => {
    const newTheme: any = { ...theme };
    const keys = path.split(".");
    let obj = newTheme;

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }

    obj[keys[keys.length - 1]] = parseColor(value);
    setTheme(newTheme);
  };

  // Riga input colore
  const Row = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: value, color: "#000" }]}
        value={value}
        onChangeText={onChange}
        placeholder="es: blu, #ff0000"
      />
    </View>
  );

  return (
    <View style={styles.panel}>
      <ScrollView>
        <Text style={styles.title}>🎨 Tema</Text>

        <Row
          label="Background"
          value={theme.background}
          onChange={(v) => updateTheme("background", v)}
        />

        <Row
          label="Card Bg"
          value={theme.card.background}
          onChange={(v) => updateTheme("card.background", v)}
        />

        <Row
          label="Card Shadow"
          value={theme.card.shadowColor}
          onChange={(v) => updateTheme("card.shadowColor", v)}
        />

        <Row
          label="Title Color"
          value={theme.titleColor}
          onChange={(v) => updateTheme("titleColor", v)}
        />

        <Row
          label="Message Color"
          value={theme.messageColor}
          onChange={(v) => updateTheme("messageColor", v)}
        />

        <Row
          label="Button Bg"
          value={theme.button.background}
          onChange={(v) => updateTheme("button.background", v)}
        />
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
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: "15%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 130,
    fontWeight: "700",
    fontSize: 12,
  },
  input: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 140,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
