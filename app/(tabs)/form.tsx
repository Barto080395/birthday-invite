import { StyleSheet, Text, View } from 'react-native';

export default function Form() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Qui ci sarà il form RSVP 🎉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 },
});
