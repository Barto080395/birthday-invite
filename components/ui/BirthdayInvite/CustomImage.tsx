import React from "react";
import { View, Button, Image, StyleSheet, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";

type Props = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
};

export default function CustomImage({ imageUri, setImageUri }: Props) {
  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Errore", response.errorMessage || "Errore selezione immagine");
          return;
        }

        if (response.assets && response.assets.length > 0) {
          try {
            const assetUri = response.assets[0].uri;

            // Ridimensiona immagine a 150x150 px
            const resized = await ImageResizer.createResizedImage(
              assetUri!,
              150,
              150,
              "PNG",
              100
            );

            setImageUri(resized.uri);
          } catch (err) {
            console.error(err);
            Alert.alert("Errore", "Impossibile ridimensionare l'immagine");
          }
        }
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
