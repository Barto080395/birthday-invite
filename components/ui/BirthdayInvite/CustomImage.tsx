// app/components/CustomImage.tsx
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Button, Image, StyleSheet, View, Alert } from "react-native";

type Props = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
};

export default function CustomImage({ imageUri, setImageUri }: Props) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      
      // Controllo dimensione
      if (asset.width > 150 || asset.height > 150) {
        Alert.alert(
          "Attenzione",
          "L'immagine deve essere massimo 150x150 px"
        );
        return;
      }

      setImageUri(asset.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Scegli immagine" onPress={pickImage} color="#ff1493" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10 },
  image: { width: 150, height: 150, marginVertical: 10, borderRadius: 75 },
});
