import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    try {
      // Validacion de campos
      if (!credentials.email || !credentials.password) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }

      const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenciales incorrectas");
      }

      const data = await response.json();
      Alert.alert("Éxito", "Sesión iniciada correctamente");
      console.log(data)
      router.push("/clientes");

    } catch (error) {
      console.error("Error en el login:", error);
      Alert.alert("Error", error.message || "Error en el servidor");
    }
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        value={credentials.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        secureTextEntry={true}
        value={credentials.password}
        onChangeText={(text) => handleChange('password', text)}
        autoCapitalize="none"
      />
      
      <Pressable 
        style={styles.button} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});