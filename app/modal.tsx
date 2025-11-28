import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

interface CountdownModalProps {
  initialDate: Date;
  initialName?: string;
  onConfirm: (newDate: Date, name?: string) => void;
  onClose: () => void;
}

export default function CountdownModal({
  initialDate,
  initialName = "",
  onConfirm,
  onClose,
}: CountdownModalProps) {
  const [name, setName] = useState(initialName);
  const [tempDay, setTempDay] = useState(initialDate.getDate());
  const [tempMonth, setTempMonth] = useState(initialDate.getMonth() + 1);
  const [tempYear, setTempYear] = useState(initialDate.getFullYear());
  const [tempHour, setTempHour] = useState(initialDate.getHours());
  const [tempMinute, setTempMinute] = useState(initialDate.getMinutes());
  const [tempSecond, setTempSecond] = useState(initialDate.getSeconds());

  const handleConfirm = () => {
    const newDate = new Date(tempYear, tempMonth - 1, tempDay, tempHour, tempMinute, tempSecond);
    if (!isNaN(newDate.getTime())) {
      onConfirm(newDate, name.trim() ? name : undefined);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Imposta Countdown</Text>

        {/* Grid inputs giorno/mese/anno/ora/minuti/secondi */}
        <View style={styles.grid}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Giorno</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempDay)}
              onChangeText={(t) => setTempDay(Number(t))}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mese</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempMonth)}
              onChangeText={(t) => setTempMonth(Number(t))}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Anno</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempYear)}
              onChangeText={(t) => setTempYear(Number(t))}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Ora</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempHour)}
              onChangeText={(t) => setTempHour(Number(t))}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Minuti</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempMinute)}
              onChangeText={(t) => setTempMinute(Number(t))}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Secondi</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(tempSecond)}
              onChangeText={(t) => setTempSecond(Number(t))}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Button title="Conferma" onPress={handleConfirm} color="#ff1493" />
          <Button title="Chiudi" onPress={onClose} color="#666" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#ffe6f0",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff1493",
  },
  inputWrapper: {
    marginBottom: 10,
    width: "30%",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "600",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
});
