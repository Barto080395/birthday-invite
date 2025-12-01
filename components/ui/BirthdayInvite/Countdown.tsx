import React, { useEffect, useState } from "react";
import { Text } from "react-native";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownProps = {
  targetDate: Date;
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Text style={{ color: "#fff", fontSize: 16 }}>
      {timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds <= 0
        ? "Auguri di buon compleanno! 🥳🎉"
        : `Mancano: ${timeLeft.days} giorni, ${timeLeft.hours} ore, ${timeLeft.minutes} minuti, ${timeLeft.seconds} secondi`}
    </Text>
  );
};

export default Countdown;
