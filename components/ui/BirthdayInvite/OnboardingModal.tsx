import React from "react";
import { ScrollView } from "react-native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Benvenuto in Birthday Invite 🎉</Text>

          <Text style={styles.rowTitle}>1. Aggiungi il titolo</Text>
          <Text style={styles.rowText}>
            Dai un nome speciale alla tua festa — es. "Compleanno di Sara".
          </Text>

          <Text style={styles.rowTitle}>2. Scegli una foto</Text>
          <Text style={styles.rowText}>
            Clicca su "Scegli immagine" per caricare l'immagine dell'invito.
          </Text>

          <Text style={styles.rowTitle}>3. Scrivi il messaggio</Text>
          <Text style={styles.rowText}>
            Inserisci un messaggio personalizzato per i tuoi invitati ✨ Puoi
            raccontare cosa festeggi, dove sarà la festa o qualsiasi dettaglio
            importante 💌
          </Text>

          <Text style={styles.rowTitle}>4. Imposta data</Text>
          <Text style={styles.rowText}>
            Tocca il countdown per selezionare data e ora dell’evento ⏳ (la
            data deve essere futura).
          </Text>

          <Text style={styles.rowTitle}>5. Personalizza il tema 🎨</Text>
          <Text style={styles.rowText}>
            Apri il menu Impostazioni ⚙️ e scegli "Theme". Scegli i colori che
            preferisci per personalizzare l’invito 🌈✨
          </Text>

          <Text style={styles.rowTitle}>6. Aggiungi emoji decorative ✨</Text>
          <Text style={styles.rowText}>
            Dal menu Impostazioni ⚙️ puoi scegliere un’emoji per l’effetto
            confetti!
          </Text>

          <Text style={styles.rowTitle}>7. Condividi l’invito</Text>
          <Text style={styles.rowText}>
            Premi "Condividi Invito" per inviarlo ai tuoi amici tramite link 📲
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Ho capito — Inizia!</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Puoi riaprire questa guida da Impostazioni.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,15,15,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "flex-start",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ff2a7a",
    marginBottom: 12,
    alignSelf: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },
  rowText: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    marginTop: 18,
    backgroundColor: "#ff7a95",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
  },
  footer: {
    marginTop: 10,
    color: "#999",
    fontSize: 12,
    alignSelf: "center",
  },
});
