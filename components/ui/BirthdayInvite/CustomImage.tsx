import React from "react";
import { View, Button, Image, StyleSheet, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

type Props = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
};

export default function CustomImage({ imageUri, setImageUri }: Props) {
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 150,
        maxHeight: 150,
        quality: 1,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Errore", response.errorMessage || "Errore selezione immagine");
          return;
        }
  
        // ✅ Controllo sicuro su TypeScript
        const uri = response.assets?.[0].uri ?? null;
        if (uri) setImageUri(uri);
      }
    );
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
  image: { width: 150, height: 150, borderRadius: 75, marginTop: 10 },
});
