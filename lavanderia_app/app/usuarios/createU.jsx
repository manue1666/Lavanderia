import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const EXPO_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL


export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      // Validación de campos
      if (!form.email || !form.password) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }

      setLoading(true);

      const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/users/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }

      // Verifica que el token venga en la respuesta
      if (!data.access_token) {
        throw new Error("No se recibió token de acceso");
      }

      // Aquí deberías guardar el token en AsyncStorage o tu solución de estado global
      // Ejemplo: await AsyncStorage.setItem('userToken', data.access_token);
      
      Alert.alert("Éxito", "Inicio de sesión correcto");
      console.log("Token recibido:", data.access_token);
      router.replace("/home"); // Cambia a tu ruta principal

    } catch (error) {
      console.error("Error en el login:", error.message);
      Alert.alert("Error", error.message || "Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo"
        value={form.email}
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
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </Pressable>

      <Pressable 
        style={styles.secondaryButton} 
        onPress={() => router.push("/register")}
      >
        <Text style={styles.secondaryButtonText}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A0C4FF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 14,
    marginTop: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});