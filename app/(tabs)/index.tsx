import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { ConfettiComponent } from "@/components/ui/BirthdayInvite/Confetto";
import Countdown from "@/components/ui/BirthdayInvite/Countdown";
import OnboardingModal from "@/components/ui/BirthdayInvite/OnboardingModal";
import { ScrollView, StyleSheet } from "react-native";
import CountdownModal from "../modal";
import { Invite } from "../types/Invite.types";
import { createInvite, getInvite, updateInvite } from "../InviteService";

export default function Home() {
  // ====== STATI ======
  const [title, setTitle] = useState("🎉 Festa di Compleanno 🎉");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [location, setLocation] = useState("");
  const [image, setImage] = useState(require("../../assets/images/icon.jpg"));
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);

  useEffect(() => {
    const handleUrl = (url: string) => {
      const { path } = Linking.parse(url);

      if (path?.startsWith("invite/")) {
        const id = path.split("invite/")[1];
        setInviteId(id);
        loadInvite(id);
      }
    };

    // 1️⃣ App aperta
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    // 2️⃣ App chiusa
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // ====== FUNZIONI ======
  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        // Web: usa input type=file
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (!file) return;

          // Crea un URL temporaneo leggibile dal browser
          const url = URL.createObjectURL(file);
          setImage({ uri: url });

          // Se vuoi condividere con altri, qui dovresti fare l'upload al server
          // e poi usare l'URL pubblico restituito dal server
        };

        input.click();
        return;
      }

      // Mobile: iOS / Android
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage({ uri: result.assets[0].uri });

        // Per la produzione, puoi fare anche l'upload qui
        // e poi salvare l'URL restituito sul server / database
      }
    } catch (err) {
      console.error("Errore durante la selezione immagine:", err);
      alert("Impossibile selezionare l'immagine, riprova.");
    }
  };

  const saveInvite = async (): Promise<string | null> => {
    const imageUrl = image && "uri" in image ? image.uri : undefined;

    if (!inviteId) {
      const invite = await createInvite({
        title,
        location,
        targetDate: targetDate ? targetDate.toISOString() : null,
        imageUrl,
      });
      setInviteId(invite._id!);
      setCurrentInvite(invite);
      return invite._id!;
    } else {
      const updated = await updateInvite(inviteId, {
        title,
        location,
        targetDate: targetDate ? targetDate.toISOString() : null,
        imageUrl,
      });
      setCurrentInvite(updated);
      return updated._id!;
    }
  };

  const loadInvite = async (id: string) => {
    const invite = await getInvite(id);
    if (invite) {
      setCurrentInvite(invite);
      setTitle(invite.title);
      setLocation(invite.location);
      setTargetDate(invite.targetDate ? new Date(invite.targetDate) : null);
      // eventualmente mappa imageUrl su image.state
    }
  };

  const editTitle = () => {
    setIsEditingTitle(true);
  };

  const confirmTitle = (newTitle: string) => {
    if (newTitle.trim()) {
      setTitle(newTitle);
      setIsEditingTitle(false);
    }
  };

  const openLocation = () => {
    if (!location.trim()) return;

    const url = `https://www.google.com/maps?q=${encodeURIComponent(location)}`;
    Linking.openURL(url);
  };

  const shareInvite = async () => {
    // salva l'invito se non esiste ancora e ottieni l'id reale
    const id = inviteId || (await saveInvite());

    if (!id) {
      alert("Errore: impossibile generare il link all'invito");
      return;
    }

    const link = `https://birthday-invite-vert.vercel.app/invite/${id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `🎉 ${title}\nTi invito alla mia festa!\nApri qui: ${link}`,
        });
      } catch (err) {
        console.error("Errore con la condivisione:", err);
      }
    } else {
      await navigator.clipboard.writeText(link);
      alert("Invito copiato negli appunti!");
      // opzionale: apri il link in una nuova scheda
      window.open(link, "_blank");
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
        style={{ backgroundColor: "#ffbfd6", flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1, // permette al contenuto di occupare tutto lo spazio
          justifyContent: "center", // centra verticalmente
          alignItems: "center", // centra orizzontalmente
          paddingBottom: 50,
        }}
      >
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.helpButtonCard}
            onPress={() => setShowOnboarding(true)}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          {/* TITOLO */}
          {isEditingTitle ? (
            <View style={{ width: "100%", marginBottom: 18 }}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => confirmTitle(title)}
              >
                <Text style={styles.confirmText}>Conferma</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: "100%", marginBottom: 18 }}>
              <Text style={styles.finalTitle}>{title}</Text>
              <TouchableOpacity style={styles.editButton} onPress={editTitle}>
                <Text style={styles.editText}>Modifica 🖋️</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* FOTO */}
          <TouchableOpacity style={styles.photoWrapper} onPress={pickImage}>
            <Image source={image} style={styles.photo} />
          </TouchableOpacity>

          {/* MESSAGGIO */}
          <Text style={styles.message}>
            Vuoi venire alla festa? 🎂 Sarà una giornata fantastica, ti aspetto!
            ✨
          </Text>

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

          {/* MODALE COUNTDOWN */}
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
        </View>

        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          <ConfettiComponent />
        </View>
      </ScrollView>
    </View>
  );
}

// ====== STILI ======

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 20,
    borderRadius: 25,
    backgroundColor: "#ffe6f0",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "rgba(255, 120, 170, 1.5)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 2,
    shadowRadius: 20,
    elevation: 12,

    ...(Platform.OS === "web"
      ? {
          boxShadow:
            "0 0 20px 8px rgba(255,120,170,0.45), 0 0 40px 12px rgba(255,180,210,0.3)",
        }
      : {}),
  },
  helpButtonCard: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,120,170,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  header: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff1493",
    marginBottom: 15,
  },

  input: {
    borderWidth: 2,
    borderColor: "#ff8fb7",
    backgroundColor: "#ffc3d9",
    borderRadius: 15,
    padding: 12,
    fontSize: 18,
    marginBottom: 12,
  },

  // ====== TITOLO ======
  confirmButton: {
    backgroundColor: "#ff7aa2",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "bold",
  },

  finalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff1493",
    textAlign: "center",
    marginBottom: 10,
  },

  // ====== FOTO ======
  photoWrapper: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#ff8fb7",
    marginBottom: 20,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  // ====== MESSAGGIO ======
  message: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#ffc3d9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  // ====== COUNTDOWN ======
  countdownWrapper: {
    backgroundColor: "#ff1493",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
    shadowColor: "#ff1493",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12,
  },

  countdownPlaceholder: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },

  // ====== LOCATION ======
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },

  goButton: {
    backgroundColor: "#ff1493",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    marginTop: -12,
  },

  goText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // ====== SHARE ======
  shareButton: {
    backgroundColor: "#ff7aa2",
    padding: 15,
    borderRadius: 20,
  },

  shareText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
