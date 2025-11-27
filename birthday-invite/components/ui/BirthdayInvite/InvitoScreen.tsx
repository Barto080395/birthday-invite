import { db } from "@/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function InvitoScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Legge i dati in tempo reale da Firebase
    const unsub = onSnapshot(doc(db, "inviti", "invito1"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    });

    return () => unsub();
  }, []);

  if (!data) return <Text>Caricamento invito...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      {data.imageUri && <Image source={{ uri: data.imageUri }} style={styles.image} />}
      <Text style={styles.text}>Location: {data.location}</Text>
      <Text style={styles.text}>
        Data: {data.targetDate ? new Date(data.targetDate).toLocaleString() : "Da definire"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  image: { width: 250, height: 250, borderRadius: 12, marginBottom: 15 },
  text: { fontSize: 18, marginBottom: 8 },
});
