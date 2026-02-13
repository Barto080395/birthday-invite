import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

// --- INTERFACCIA ---
interface ConfettoProps {
  left: number;
  delay: number;
  size: number;
  content: string;
}

// --- Componente per un singolo Confetto/Petalo (SENZA ROTAZIONE) ---
const Confetto: React.FC<ConfettoProps> = ({ left, delay, size, content }) => {
  // Usiamo un solo valore animato per gestire sia la caduta (Y) che l'oscillazione (X)
  const fallProgress = useRef(new Animated.Value(0)).current;

  // Durata casuale per rendere il movimento meno uniforme tra i petali
  const duration = 4000 + Math.random() * 2000; // 4s - 6s

  // Funzione ricorsiva per avviare il loop infinito
  const startAnimation = () => {
    // Resetta il valore animato per far apparire il petalo in cima
    fallProgress.setValue(0);

    // Avvia l'animazione di caduta
    Animated.timing(fallProgress, {
      toValue: 1,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      // Se l'animazione è finita, riavvia il loop (ricorsione)
      if (finished) {
        startAnimation();
      }
    });
  };

  useEffect(() => {
    // Applica il delay iniziale e poi avvia l'animazione
    const timer = setTimeout(() => {
      startAnimation();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 1. Interpolazione per la Caduta Verticale (Y)
  const translateY = fallProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, screenHeight + 30],
  });

  // 2. Interpolazione per l'Oscillazione Orizzontale (X)
  const translateX = fallProgress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 25, 0, -25, 0],
  });

  // 3. L'Interpolazione per la Rotazione (rotateZ) è stata RIMOSSA.

  // 4. L'Interpolazione per l'Opacità
  const opacity = fallProgress.interpolate({
    inputRange: [0, 0.01, 0.99, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.confetto,
        {
          left: `${left}%`,
          // APPLICA SOLO CADUTA (Y) E OSCILLAZIONE (X)
          transform: [
            { translateY },
            { translateX }, // Rotazione rimossa
          ],
          opacity: opacity,
        },
      ]}
    >
      <Text style={{ fontSize: size * 16, color: "pink" }}>{content}</Text>
    </Animated.View>
  );
};

// --- Componente Contenitore Principale (Invariato) ---
export const ConfettiComponent = () => {
  const confettiCount = 30;
  const content = "❤️";

  const confettiArray = useMemo(
    () =>
      Array.from({ length: confettiCount }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 1.5 + 0.8,
      })),
    []
  );

  return (
    <View style={styles.container}>
      {confettiArray.map((c, i) => (
        <Confetto
          key={i}
          left={c.left}
          delay={c.delay}
          size={c.size}
          content={content}
        />
      ))}
    </View>
  );
};

// --- StyleSheet di React Native (Invariato) ---
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  confetto: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
  },
});
