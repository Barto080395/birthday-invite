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
import * as Linking from "expo-linking";
import { ConfettiComponent } from "@/components/ui/BirthdayInvite/Confetto";
import Countdown from "@/components/ui/BirthdayInvite/Countdown";
import { EditableText } from "@/components/ui/BirthdayInvite/EditableText";
import { Loader } from "@/components/ui/BirthdayInvite/Loader";
import CustomImage from "@/components/ui/BirthdayInvite/CustomImage";
import { Share2, ArrowRight } from "lucide-react";
import CountdownModal from "@/app/modal";
import { useOwner } from "@/app/context/OwnerContext";
import { useTheme } from "@/app/context/ThemeContext";
import { Invite } from "@/app/types/Invite.types";
import {
  createInvite,
  getInvite,
  updateInvite,
} from "@/app/service/InviteService";
import { SettingsMenu } from "./ui/BirthdayInvite/SettingsMenu";

export default function Home() {
  const [title, setTitle] = useState("🎉 Inserisci Titolo 🎉");
  const [message, setMessage] = useState(
    "📝 Scrivi qui il tuo messaggio speciale per l’invito!✨ Non dimenticare di aggiungere un tocco personale 🌈💖"
  );
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const [Loading, setLoading] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(true);
  const [confettiEmoji, setConfettiEmoji] = useState(""); // default emoji

  // STATI GLOBALI
  const { isOwner, setIsOwner } = useOwner();
  const { theme, setTheme } = useTheme();

  // Carica ID dalla query string
  useEffect(() => {
    const url = window.location.href;
    const query = new URL(url).searchParams;
    const id = query.get("id");
  
    if (id) {
      setLoading(true);
      setInviteId(id);
      setIsOwner(false);
  
      loadInvite(id).finally(() => setIsCheckingId(false));
    } else {
      setIsOwner(true);
      setIsCheckingId(false); // ✅ AGGIUNGI QUESTO
      setLoading(true);
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
      if (invite.image) setImage(invite.image);
      if (invite.theme) {
        setTheme(invite.theme);
      }
      if (invite.confettiEmoji) {
        setConfettiEmoji(invite.confettiEmoji);
      }
    }
  };

  const saveInviteFirebase = async (): Promise<string | null> => {
    try {
      const target = targetDate ? targetDate.toISOString() : undefined;
      let imageBase64: string | undefined;

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      let invite: Invite;

      if (!inviteId) {
        invite = await createInvite({
          title,
          message,
          location,
          targetDate: target,
          image: imageBase64,
          theme,
          confettiEmoji,
        });
        setInviteId(invite._id || null);
      } else {
        invite = await updateInvite(inviteId, {
          title,
          message,
          location,
          targetDate: target,
          image: imageBase64,
          theme,
          confettiEmoji,
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
    const link = `https://birthday-invite-vert.vercel.app/?id=${id}`;
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
    if (Platform.OS === "web") window.open(mapsUrl, "_blank");
    else Linking.openURL(mapsUrl);
  };

  // Mostra loader se sei ospite e non hai ancora caricato l'invito
  if (isCheckingId) {
    return (
      <Loader
        bgColor={theme.background}
        dotColor={theme.titleColor}
        duration={800}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card.background,
              shadowColor: theme.card.shadowColor,
              shadowOpacity: theme.card.shadowOpacity,
              ...(Platform.OS === "web"
                ? {
                    boxShadow: `0 0 20px 8px ${theme.card.shadowColor}55`,
                  }
                : {}),
            },
          ]}
        >
          {isOwner && (
            <SettingsMenu
              confettiEmoji={confettiEmoji}
              setConfettiEmoji={setConfettiEmoji}
            />
          )}

          {isOwner ? (
            <EditableText
              title={title}
              onChangeTitle={setTitle}
              titleColor={theme.titleColor} // ✅ colore dinamico
              titleSize={theme.titleSize} // ✅ dimensione dinamica
            />
          ) : (
            <Text
              style={[
                styles.finalTitle,
                { color: theme.titleColor, fontSize: theme.titleSize },
              ]}
            >
              {title}
            </Text>
          )}

          <CustomImage imageUri={image} setImageUri={setImage} />

          {isOwner ? (
            <EditableText
              message={message}
              onChangeMessage={setMessage}
              messageColor={theme.messageColor} // ✅ colore dinamico
            />
          ) : (
            <Text
              style={[
                styles.message,
                {
                  backgroundColor: theme.background,
                  color: theme.messageColor,
                },
              ]}
            >
              {message}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.countdownWrapper,
              { backgroundColor: theme.button.background },
            ]}
            onPress={() => setShowCountdownModal(true)}
          >
            {targetDate ? (
              <Countdown targetDate={targetDate} />
            ) : (
              <Text
                style={[
                  styles.countdownPlaceholder,
                  { color: theme.button.text },
                ]}
              >
                Imposta il countdown ⏳
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.locationRow}>
            <TextInput
              placeholder="Inserisci la location.."
              value={location}
              onChangeText={setLocation}
              style={[styles.input, { flex: 1 }]}
            />

            <TouchableOpacity
              onPress={openLocation}
              style={[
                styles.goButton,
                { backgroundColor: theme.button.background },
              ]}
            >
              <Text style={[styles.goText, { color: theme.button.text }]}>
                <ArrowRight />
              </Text>
            </TouchableOpacity>
          </View>

          {isOwner && (
            <TouchableOpacity
              style={[
                styles.shareButton,
                { backgroundColor: theme.button.background },
              ]}
              onPress={shareInvite}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Share2 color={theme.button.text} size={20} />

                <Text style={[styles.shareText, { color: theme.button.text }]}>
                  Condividi Invito
                </Text>
              </View>
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
          <ConfettiComponent key={confettiEmoji} emoji={confettiEmoji} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 20,
    maxWidth: 500,
    borderRadius: 25,
    alignSelf: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    width: "90%",
  },
  helpButtonCard: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  helpButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  finalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  countdownWrapper: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  countdownPlaceholder: { color: "#fff", fontSize: 18, textAlign: "center" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  input: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 12,
    fontSize: 18,
    marginBottom: 12,
  },
  goButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    marginTop: -12,
  },
  goText: { color: "#fff", fontWeight: "bold" },
  shareButton: { padding: 15, borderRadius: 20 },
  shareText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
