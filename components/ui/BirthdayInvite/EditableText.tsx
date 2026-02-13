import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type EditableTextProps = {
  title?: string; // se voglio modificare un titolo
  message?: string; // se voglio modificare un messaggio
  onChangeTitle?: (newValue: string) => void;
  onChangeMessage?: (newValue: string) => void;
  placeholder?: string;
};

export const EditableText = ({
  title,
  message,
  onChangeTitle,
  onChangeMessage,
  placeholder,
}: EditableTextProps) => {
    
  const [isEditing, setIsEditing] = useState(false);
  const value = title ?? message ?? "";
  const onChange = title ? onChangeTitle : onChangeMessage;

  const confirm = (newValue: string) => {
    if (!newValue.trim()) return;
    onChange?.(newValue);
    setIsEditing(false);
  };

  const isTitle = !!title;

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            value={value}
            onChangeText={onChange || (() => {})}
            placeholder={placeholder}
            style={[styles.input, isTitle && styles.titleInput]}
            multiline={true} // ✅ permette più righe
            textAlignVertical="top" // opzionale: fa partire il testo dall'alto
          />

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => confirm(value)}
          >
            <Text style={styles.confirmText}>Conferma</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={isTitle ? styles.titleText : styles.messageText}>
            {value}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editText}>Modifica 🖋️</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 18 },
  input: {
    borderWidth: 2,
    borderColor: "#ff8fb7",
    backgroundColor: "#ffc3d9",
    borderRadius: 15,
    padding: 12,
    fontSize: 18,
    marginBottom: 12,
  },
  titleInput: { fontSize: 26 },
  confirmButton: {
    backgroundColor: "#ff7aa2",
    padding: 12,
    borderRadius: 12,
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  editButton: {
    backgroundColor: "#ffb6d6",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  editText: {
    color: "#ff0066",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff1493",
    textAlign: "center",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#ffc3d9",
    padding: 15,
    borderRadius: 12,
    width: "100%",       // ✅ assicura che il testo sappia dove spezzarsi
    flexWrap: "wrap",    // ✅ permette il wrapping
  }
  
});
