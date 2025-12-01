import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  name: string;
  setName: (text: string) => void;
};

export default function CustomName({ name, setName }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome del festeggiato"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10, alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: 250,
  },
});
