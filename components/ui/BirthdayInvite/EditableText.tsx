import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
} from "react-native";

type EditableTextProps = {
  title?: string;
  message?: string;
  onChangeTitle?: (newValue: string) => void;
  onChangeMessage?: (newValue: string) => void;
  placeholder?: string;
  titleColor?: string; // nuovo: colore titolo
  titleSize?: number; // nuovo: dimensione titolo
  messageColor?: string; // nuovo: colore messaggio
};

export const EditableText = ({
  title,
  message,
  onChangeTitle,
  onChangeMessage,
  placeholder,
  titleColor = "#000",
  titleSize = 26,
  messageColor = "#000",
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const value = title ?? message ?? "";
  const onChange = title ? onChangeTitle : onChangeMessage;
  const isTitle = !!title;

  const confirm = (newValue: string) => {
    if (!newValue.trim()) return;
    onChange?.(newValue);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            value={value}
            onChangeText={onChange || (() => {})}
            placeholder={placeholder}
            style={[
              styles.input,
              isTitle
                ? { fontSize: titleSize, color: titleColor }
                : { color: messageColor },
            ]}
            multiline
            textAlignVertical="top"
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
          <Text
            style={[
              isTitle
                ? {
                    fontSize: titleSize,
                    fontWeight: "bold",
                    color: titleColor,
                    textAlign: "center",
                    marginBottom: 10,
                  }
                : {
                  fontSize: 16,
                  color: messageColor,
                  textAlign: "center",
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 12,
                  width: "100%",
                  alignSelf: "stretch",
                  overflow: "hidden",
              }
              
            ]}
          >
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
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
  },
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
});
