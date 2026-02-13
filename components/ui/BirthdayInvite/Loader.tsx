import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, Dimensions } from "react-native";

type LoaderProps = {
  bgColor?: string;
  dotColor?: string;
  duration?: number;
  onComplete?: () => void;
};

export const Loader = ({
  bgColor = "#ffbfd6",
  dotColor = "#ff1493",
  duration = 1500,
  onComplete,
}: LoaderProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dots = [
    { size: 4, angle: 0 },
    { size: 6, angle: 72 },
    { size: 8, angle: 144 },
    { size: 10, angle: 216 },
    { size: 12, angle: 288 },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: bgColor }]}>
      <Animated.View
        style={[styles.spinner, { transform: [{ rotate: spin }] }]}
      >
        {dots.map((dot, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: dot.size,
                height: dot.size,
                backgroundColor: dotColor,
                transform: [{ rotate: `${dot.angle}deg` }, { translateY: -20 }],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    borderRadius: 50,
  },
});
