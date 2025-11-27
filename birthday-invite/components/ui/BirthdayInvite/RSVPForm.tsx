import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RSVPForm() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/form')}>
        <Text style={styles.buttonText}>📬 Compila il form 🖋️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20, alignItems: 'center' },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#ff1493',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
