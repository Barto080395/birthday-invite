import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { ConfettiComponent } from "@/components/ui/BirthdayInvite/Confetto";
import Countdown from "@/components/ui/BirthdayInvite/Countdown";
import OnboardingModal from "@/components/ui/BirthdayInvite/OnboardingModal";
import CountdownModal from "./modal";
import { createInvite, getInvite, updateInvite } from "./service/InviteService";
import { Invite } from "./types/Invite.types";
import { EditableText } from "@/components/ui/BirthdayInvite/EditableText";
import { Loader } from "@/components/ui/BirthdayInvite/Loader";

export default function Home() {
  const [title, setTitle] = useState("🎉 Festa di Compleanno 🎉");
  const [message, setMessage] = useState(
    "Vuoi venire alla festa? 🎂 Sarà una giornata fantastica, ti aspetto! ✨"
  );
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(require("../assets/images/icon.jpg"));
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const [isOwner, setIsOwner] = useState(true);
  const [Loading, setLoading] = useState(false);
  // Carica ID dalla query string (statico)

  useEffect(() => {
    const url = window.location.href;
    const query = new URL(url).searchParams;
    const id = query.get("id");

    if (id) {
      setInviteId(id);
      setIsOwner(false);

      loadInvite(id).finally(() => {
        setLoading(false); // ✅ finito caricamento
      });
    } else {
      setIsOwner(true);
      setLoading(false); // ✅ nessun caricamento necessario
    }
  }, []);

  const loadInvite = async (id: string) => {
    const invite = await getInvite(id);
    if (invite) {
      setCurrentInvite(invite);
      setTitle(invite.title);
      setMessage(invite.message);
      setLocation(invite.location);
      setTargetDate(invite.targetDate ? new Date(invite.targetDate) : null);
    }
  };

  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (!file) return;
          setImage({ uri: URL.createObjectURL(file) });
        };
        input.click();
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) setImage({ uri: result.assets[0].uri });
    } catch (err) {
      console.error(err);
      alert("Impossibile selezionare l'immagine.");
    }
  };

  const saveInviteFirebase = async (): Promise<string | null> => {
    try {
      // Trasforma `null` in `undefined` per Firebase Service
      const target = targetDate ? targetDate.toISOString() : undefined;

      let invite: Invite;
      const imageFile =
        image && "uri" in image
          ? await (await fetch(image.uri)).blob()
          : undefined;

      if (!inviteId) {
        invite = await createInvite({
          title,
          message,
          location,
          targetDate: target, // ✅ ora è string | undefined
        });
        setInviteId(invite._id || null);
      } else {
        invite = await updateInvite(inviteId, {
          title,
          message,
          location,
          targetDate: target, // ✅ string | undefined
        });
      }

      setCurrentInvite(invite);
      return invite._id || null;
    } catch (err) {
      console.error(err);
      alert("Errore salvataggio invito!");
      return null;
    }
  };

  const shareInvite = async () => {
    const id = await saveInviteFirebase();
    if (!id) return;
    const link = `https://birthday-invite-vert.vercel.app/?id=${id}`; // ✅ query string
    try {
      if (navigator.share)
        await navigator.share({
          title,
          text: `🎉 ${title}\nApri qui: ${link}`,
        });
      else {
        await navigator.clipboard.writeText(link);
        window.open(link, "_blank");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLocation = () => {
    if (!location.trim()) return;

    const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      location
    )}`;

    if (Platform.OS === "web") {
      window.open(mapsUrl, "_blank"); // ✅ apre in nuova scheda
    } else {
      Linking.openURL(mapsUrl); // ✅ su iOS/Android apre Maps o browser
    }
  };

  if (Loading) {
    return (
      <Loader
        bgColor="#ffbfd6" // stesso rosa del background
        dotColor="#ff1493" // stesso rosa del titolo
        duration={800} // opzionale
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isOwner && (
        <OnboardingModal
          visible={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      <ScrollView
        style={{ backgroundColor: "#ffbfd6", flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
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

          {/* Titolo modificabile */}
          {isOwner ? (
            <EditableText title={title} onChangeTitle={setTitle} />
          ) : (
            <Text style={styles.finalTitle}>{title}</Text>
          )}
          {/* Foto */}
          <TouchableOpacity style={styles.photoWrapper} onPress={pickImage}>
            <Image source={image} style={styles.photo} />
          </TouchableOpacity>

          {/* Messaggio modificabile */}
          {isOwner ? (
            <EditableText
              message={message}
              onChangeMessage={setMessage}
              placeholder="Scrivi un messaggio speciale..."
            />
          ) : (
            <Text style={styles.message}>{message}</Text>
          )}

          {/* Countdown */}
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

          {/* Location */}
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

          {/* Condivisione */}
          {isOwner && (
            <TouchableOpacity style={styles.shareButton} onPress={shareInvite}>
              <Text style={styles.shareText}>Condividi Invito</Text>
            </TouchableOpacity>
          )}

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
  helpButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
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
  }, // ====== TITOLO ======
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
  }, // ====== FOTO ======
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
  photo: { width: "100%", height: "100%" }, // ====== MESSAGGIO ======
  message: {
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#ffc3d9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  }, // ====== COUNTDOWN ======
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
  countdownPlaceholder: { color: "#fff", fontSize: 18, textAlign: "center" }, // ====== LOCATION ======
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
  goText: { color: "#fff", fontWeight: "bold" }, // ====== SHARE ======
  shareButton: { backgroundColor: "#ff7aa2", padding: 15, borderRadius: 20 },
  shareText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
