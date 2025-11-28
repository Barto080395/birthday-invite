import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, StyleSheet, TextInput, View } from "react-native";

type Props = {
  onSubmit: (title: string, imageUri: string | null, date: Date) => void;
};

export default function CustomInviteForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Titolo invito"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button title="Scegli immagine" onPress={pickImage} color="#ff1493" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Scegli data compleanno" onPress={() => setShowPicker(true)} color="#ff69b4" />
      {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />}
      <Button title="Conferma invito" onPress={() => onSubmit(title, imageUri, date)} color="#ff69b4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    width: 250,
    marginVertical: 10,
  },
  image: { width: 150, height: 150, marginVertical: 10, borderRadius: 75 },
});
