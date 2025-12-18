import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";

import { ConfettiComponent } from "@/components/ui/BirthdayInvite/Confetto";
import Countdown from "@/components/ui/BirthdayInvite/Countdown";
import OnboardingModal from "@/components/ui/BirthdayInvite/OnboardingModal";
import CountdownModal from "../modal";

export default function Home() {
  // ====== STATE ======
  const [title, setTitle] = useState("🎉 Festa di Compleanno 🎉");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // ====== PERMESSI (iOS / Android) ======
  useEffect(() => {
    if (Platform.OS !== "web") {
      ImagePicker.requestMediaLibraryPermissionsAsync().then(({ status }) => {
        if (status !== "granted") {
          Alert.alert(
            "Permessi necessari",
            "Serve il permesso per accedere alle foto"
          );
        }
      });
    }
  }, []);

  // ====== PICK IMAGE ======
  const pickImage = async () => {
    // WEB
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImageUri(url);
      };

      input.click();
      return;
    }

    // IOS / ANDROID
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Errore ImagePicker:", error);
      Alert.alert("Errore", "Impossibile selezionare l'immagine");
    }
  };

  // ====== ALTRE FUNZIONI ======
  const openLocation = () => {
    if (!location.trim()) return;
    Linking.openURL(
      `https://www.google.com/maps?q=${encodeURIComponent(location)}`
    );
  };

  const shareInvite = async () => {
    const text = `🎉 ${title}\nTi invito alla mia festa!`;

    if (Platform.OS !== "web") {
      if (imageUri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(imageUri, { dialogTitle: title });
      } else {
        Alert.alert(text);
      }
      return;
    }

    if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Invito copiato!");
    }
  };

  // ====== UI ======
  return (
    <View style={{ flex: 1 }}>
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <ScrollView
        style={{ backgroundColor: "#ffbfd6" }}
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          {/* TITOLO */}
          {isEditingTitle ? (
            <>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setIsEditingTitle(false)}
              >
                <Text style={styles.confirmText}>Conferma</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.finalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingTitle(true)}
              >
                <Text style={styles.editText}>Modifica 🖋️</Text>
              </TouchableOpacity>
            </>
          )}

          {/* FOTO */}
          <TouchableOpacity style={styles.photoWrapper} onPress={pickImage}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require("../../assets/images/icon.jpg")
              }
              style={styles.photo}
            />
          </TouchableOpacity>

          {/* COUNTDOWN */}
          <TouchableOpacity
            style={styles.countdownWrapper}
            onPress={() => setShowCountdownModal(true)}
          >
            {targetDate ? (
              <Countdown targetDate={targetDate} />
            ) : (
              <Text style={styles.countdownPlaceholder}>
                Imposta il countdown ⏳
              </Text>
            )}
          </TouchableOpacity>

          {/* LOCATION */}
          <View style={styles.locationRow}>
            <TextInput
              placeholder="Inserisci la location"
              value={location}
              onChangeText={setLocation}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={openLocation} style={styles.goButton}>
              <Text style={styles.goText}>Vai</Text>
            </TouchableOpacity>
          </View>

          {/* SHARE */}
          <TouchableOpacity style={styles.shareButton} onPress={shareInvite}>
            <Text style={styles.shareText}>Condividi Invito</Text>
          </TouchableOpacity>
        </View>

        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          <ConfettiComponent />
        </View>

        {showCountdownModal && (
          <CountdownModal
            initialDate={targetDate || new Date()}
            onConfirm={(date) => {
              setTargetDate(date);
              setShowCountdownModal(false);
            }}
            onClose={() => setShowCountdownModal(false)}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ====== STILI ======
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  card: {
    padding: 20,
    borderRadius: 25,
    backgroundColor: "#ffe6f0",
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ff8fb7",
    borderRadius: 15,
    padding: 12,
    fontSize: 18,
    marginBottom: 12,
    width: "100%",
  },
  finalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff1493",
    textAlign: "center",
  },
  editButton: {
    marginTop: 6,
  },
  editText: {
    color: "#ff0066",
    fontWeight: "bold",
  },
  photoWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  countdownWrapper: {
    backgroundColor: "#ff1493",
    padding: 18,
    borderRadius: 25,
    marginBottom: 20,
  },
  countdownPlaceholder: {
    color: "#fff",
  },
  locationRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  goButton: {
    backgroundColor: "#ff1493",
    padding: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  goText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: "#ff7aa2",
    padding: 15,
    borderRadius: 20,
  },
  shareText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#ff7aa2",
    padding: 12,
    borderRadius: 12,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
