import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link href="/login" style={styles.buttonText}>Iniciar Sesión</Link>
        </Pressable>
        
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link href="/usuarios/createU" style={styles.buttonText}>Registrarse</Link>
        </Pressable>
        
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Link href="/clientes" style={styles.buttonText}>Ver Clientes</Link>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: '#2980b9',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});